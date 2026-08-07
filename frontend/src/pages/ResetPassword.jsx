import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordChecks = {
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordValid) return;

    setLoading(true);
    try {
      const res = await axios.put(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password }
      );

      alert(res.data.message);
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Reset failed");
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
            One last step
          </p>
          <h1
            className="text-center text-4xl mb-1"
            style={{ color: "#3d1220", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
          >
            Reset Password
          </h1>

          <div className="flex items-center justify-center gap-3 my-6">
            <span style={{ width: 24, height: 1, backgroundColor: "#8a6d3f" }} />
            <span style={{ width: 6, height: 6, backgroundColor: "#8a6d3f", transform: "rotate(45deg)" }} />
            <span style={{ width: 24, height: 1, backgroundColor: "#8a6d3f" }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div>
              <label className="block text-xs uppercase tracking-wider mb-1.5" style={{ color: "#6b4f3a" }}>
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-sm outline-none"
                style={{ backgroundColor: "#f7f1e6", border: "1px solid #c9b79c", color: "#3d1220" }}
                required
              />

              {password.length > 0 && (
                <ul className="mt-2 space-y-0.5 text-xs">
                  {[
                    ["length", "At least 6 characters"],
                    ["uppercase", "One uppercase letter"],
                    ["number", "One number"],
                    ["symbol", "One symbol"],
                  ].map(([key, label]) => (
                    <li key={key} style={{ color: passwordChecks[key] ? "#5c7a52" : "#a8453a" }}>
                      {passwordChecks[key] ? "✓" : "✗"} {label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !isPasswordValid}
              className="w-full py-3 rounded-sm tracking-wide disabled:opacity-50"
              style={{ backgroundColor: "#3d1220", color: "#ede1cf", fontWeight: 600, letterSpacing: "0.05em" }}
            >
              {loading ? "UPDATING..." : "UPDATE PASSWORD"}
            </button>
          </form>
        </div>

        <div
          className="text-center py-4 text-sm"
          style={{ backgroundColor: "#3d1220", color: "#c9b79c", fontFamily: "'Inter', sans-serif" }}
        >
          <Link to="/login" style={{ color: "#ede1cf", fontWeight: 600 }}>
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;