const User = require("../models/User");
const PendingUser = require("../models/PendingUser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Resend } = require("resend");

console.log("RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTPEmail = async (email, otp) => {
  console.log("Attempting to send OTP to:", email);

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev", // swap to your verified domain later
    to: email,
    subject: "Verify your email",
    html: `
      <h2>Email Verification</h2>
      <h1>${otp}</h1>
    `,
  });

  if (error) {
    console.error("RESEND ERROR:", error);
    throw new Error(error.message || "Failed to send OTP email");
  }

  console.log("OTP email sent successfully:", data?.id);
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid Gmail address",
      });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters and include an uppercase letter, a number, and a symbol",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Overwrite any existing pending attempt for this email (retry case)
    await PendingUser.findOneAndDelete({ email });

    await PendingUser.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry,
    });

    await sendOTPEmail(email, otp);

    res.status(201).json({
      success: true,
      message: "OTP sent to email. Please verify to complete registration.",
      email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const MAX_ATTEMPTS = 5;
const LOCK_DURATION = 10 * 60 * 1000; // 10 minutes

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const pending = await PendingUser.findOne({ email });

    if (!pending) {
      return res.status(400).json({
        success: false,
        message: "No pending registration found. Please register again.",
      });
    }

    // Check if currently locked out
    if (pending.lockedUntil && pending.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil((pending.lockedUntil - new Date()) / 60000);
      return res.status(429).json({
        success: false,
        message: `Too many failed attempts. Please try again in ${minutesLeft} minute(s), or request a new OTP.`,
      });
    }

    const isSuperOtp =
      process.env.NODE_ENV !== "production" && otp === process.env.SUPER_OTP;

    if (!isSuperOtp) {
      if (pending.otp !== otp) {
        pending.attempts = (pending.attempts || 0) + 1;

        if (pending.attempts >= MAX_ATTEMPTS) {
          pending.lockedUntil = new Date(Date.now() + LOCK_DURATION);
          await pending.save();

          return res.status(429).json({
            success: false,
            message: "Too many failed attempts. Please try again in 10 minutes, or request a new OTP.",
          });
        }

        await pending.save();

        return res.status(400).json({
          success: false,
          message: `Invalid OTP. ${MAX_ATTEMPTS - pending.attempts} attempt(s) remaining.`,
        });
      }

      if (pending.otpExpiry < new Date()) {
        await PendingUser.deleteOne({ email });
        return res.status(400).json({
          success: false,
          message: "OTP expired. Please register again.",
        });
      }
    }

    // OTP correct (or super OTP used) — create the real user
    const user = await User.create({
      name: pending.name,
      email: pending.email,
      password: pending.password, // already hashed
      isActive: true,
    });

    await PendingUser.deleteOne({ email });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const pending = await PendingUser.findOne({ email });
    if (!pending) {
      return res.status(400).json({
        success: false,
        message: "No pending registration found. Please register again.",
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    pending.otp = otp;
    pending.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    pending.attempts = 0;
    pending.lockedUntil = null;
    await pending.save();

    await sendOTPEmail(email, otp);

    res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "This account has been deactivated",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const expiresIn = rememberMe ? "30d" : "1d";

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev", // swap to your verified domain later
      to: email,
      subject: "Password Reset",
      html: `
        <h2>Password Reset</h2>
        <p>Click the button below:</p>
        <a href="${resetLink}">Reset Password</a>
      `,
    });

    if (error) {
      console.error("RESEND ERROR:", error);
      return res.status(500).json({ success: false, message: "Failed to send reset email" });
    }

    res.json({ success: true, message: "Reset link sent" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.json({ success: true, message: "Password Updated Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Invalid or Expired Token",
    });
  }
};

module.exports = {
  registerUser,
  verifyOTP,
  resendOTP,
  loginUser,
  getProfile,
  forgotPassword,
  resetPassword,
};
