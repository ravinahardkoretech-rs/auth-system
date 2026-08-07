import { useState } from "react";
import { register, verifyOtp, resendOtp } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const inputStyle = {
  backgroundColor: "#f7f1e6",
  border: "1px solid #c9b79c",
  color: "#3d1220",
};

const labelStyle = { color: "#6b4f3a" };

const Register = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState("register");
  const [formData, setFormData] = useState({
    name: "",
    emailPrefix: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fullEmail = formData.emailPrefix ? `${formData.emailPrefix}@gmail.com` : "";

  const passwordChecks = {
    length: formData.password.length >= 6,
    uppercase: /[A-Z]/.test(formData.password),
    number: /\d/.test(formData.password),
    symbol: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };
  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailPrefixChange = (e) => {
    const value = e.target.value.split("@")[0];
    setFormData({ ...formData, emailPrefix: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match");
    }
    if (!isPasswordValid) return;

    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: fullEmail,
        password: formData.password,
      });

      setInfo(`OTP sent to ${fullEmail}. Enter it below to complete registration.`);
      setStep("otp");
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const res = await verifyOtp({ email: fullEmail, otp });
      if (res.token) localStorage.setItem("token", res.token);

      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await resendOtp(fullEmail);
      setInfo("A new OTP has been sent to your email.");
    } catch (error) {
      alert(error.response?.data?.message || "Could not resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#3d1220" }}
    >
      <div
        className="w-full max-w-sm rounded-sm overflow-hidden"
        style={{ backgroundColor: "#ede1cf", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}
      >
        <div style={{ height: "6px", backgroundColor: "#8a6d3f" }} />

        <div className="px-10 pt-10 pb-8">
          <p
            className="text-center text-xs tracking-[0.3em] uppercase mb-2"
            style={{ color: "#8a6d3f", fontFamily: "'Inter', sans-serif" }}
          >
            {step === "register" ? "Join us" : "Almost there"}
          </p>
          <h1
            className="text-center text-4xl mb-1"
            style={{ color: "#3d1220", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
          >
            {step === "register" ? "Create Account" : "Verify Email"}
          </h1>

          <div className="flex items-center justify-center gap-3 my-6">
            <span style={{ width: 24, height: 1, backgroundColor: "#8a6d3f" }} />
            <span style={{ width: 6, height: 6, backgroundColor: "#8a6d3f", transform: "rotate(45deg)" }} />
            <span style={{ width: 24, height: 1, backgroundColor: "#8a6d3f" }} />
          </div>

          {info && (
            <p
              className="text-center text-sm mb-4"
              style={{ color: "#5c7a52", fontFamily: "'Inter', sans-serif" }}
            >
              {info}
            </p>
          )}

          {step === "register" && (
            <form onSubmit={handleSubmit} className="space-y-4" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div>
                <label className="block text-xs uppercase tracking-wider mb-1.5" style={labelStyle}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Jane Doe"
                  onChange={handleChange}
                  className="w-full p-3 rounded-sm outline-none"
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-1.5" style={labelStyle}>
                  Email
                </label>
                <div className="flex items-center rounded-sm overflow-hidden" style={{ border: "1px solid #c9b79c" }}>
                  <input
                    type="text"
                    name="emailPrefix"
                    placeholder="yourname"
                    value={formData.emailPrefix}
                    onChange={handleEmailPrefixChange}
                    className="flex-1 p-3 outline-none"
                    style={{ backgroundColor: "#f7f1e6", color: "#3d1220" }}
                    required
                  />
                  <span
                    className="px-3 h-full flex items-center text-sm"
                    style={{ backgroundColor: "#e4d5b7", color: "#6b4f3a", borderLeft: "1px solid #c9b79c" }}
                  >
                    @gmail.com
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-1.5" style={labelStyle}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-3 pr-10 rounded-sm outline-none"
                    style={inputStyle}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: "#8a6d3f" }}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <p className="text-xs mt-1.5" style={{ color: "#6b4f3a" }}>
                  6+ characters, one uppercase letter, one number, one symbol.
                </p>

                {formData.password.length > 0 && (
                  <ul className="mt-2 space-y-0.5 text-xs">
                    {[
                      ["length", "At least 6 characters"],
                      ["uppercase", "One uppercase letter"],
                      ["number", "One number"],
                      ["symbol", "One symbol"],
                    ].map(([key, label]) => (
                      <li
                        key={key}
                        style={{ color: passwordChecks[key] ? "#5c7a52" : "#a8453a" }}
                      >
                        {passwordChecks[key] ? "✓" : "✗"} {label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-1.5" style={labelStyle}>
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-3 pr-10 rounded-sm outline-none"
                    style={inputStyle}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: "#8a6d3f" }}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !isPasswordValid}
                className="w-full py-3 mt-2 rounded-sm tracking-wide transition-colors disabled:opacity-50"
                style={{ backgroundColor: "#3d1220", color: "#ede1cf", fontWeight: 600, letterSpacing: "0.05em" }}
              >
                {loading ? "REGISTERING..." : "REGISTER"}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerify} className="space-y-4" style={{ fontFamily: "'Inter', sans-serif" }}>
              <p className="text-center text-sm" style={{ color: "#6b4f3a" }}>
                Enter the 6-digit code sent to <strong style={{ color: "#3d1220" }}>{fullEmail}</strong>
              </p>

              <input
                type="text"
                name="otp"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="w-full p-3 rounded-sm outline-none text-center tracking-[0.5em] text-lg"
                style={inputStyle}
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-sm tracking-wide disabled:opacity-50"
                style={{ backgroundColor: "#3d1220", color: "#ede1cf", fontWeight: 600, letterSpacing: "0.05em" }}
              >
                {loading ? "VERIFYING..." : "VERIFY OTP"}
              </button>

              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                className="w-full text-center text-sm py-1 hover:underline"
                style={{ color: "#8a6d3f" }}
              >
                Resend OTP
              </button>
            </form>
          )}
        </div>

        {step === "register" && (
          <div
            className="text-center py-4 text-sm"
            style={{ backgroundColor: "#3d1220", color: "#c9b79c", fontFamily: "'Inter', sans-serif" }}
          >
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#ede1cf", fontWeight: 600 }}>
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;