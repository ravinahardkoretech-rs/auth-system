import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await forgotPassword(email);
      alert(data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send reset link");
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
            Account recovery
          </p>
          <h1
            className="text-center text-4xl mb-1"
            style={{ color: "#3d1220", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
          >
            Forgot Password
          </h1>

          <div className="flex items-center justify-center gap-3 my-6">
            <span style={{ width: 24, height: 1, backgroundColor: "#8a6d3f" }} />
            <span style={{ width: 6, height: 6, backgroundColor: "#8a6d3f", transform: "rotate(45deg)" }} />
            <span style={{ width: 24, height: 1, backgroundColor: "#8a6d3f" }} />
          </div>

          <p className="text-center text-sm mb-6" style={{ color: "#6b4f3a", fontFamily: "'Inter', sans-serif" }}>
            Enter your email and we'll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div>
              <label className="block text-xs uppercase tracking-wider mb-1.5" style={{ color: "#6b4f3a" }}>
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-sm outline-none"
                style={{ backgroundColor: "#f7f1e6", border: "1px solid #c9b79c", color: "#3d1220" }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-sm tracking-wide disabled:opacity-50"
              style={{ backgroundColor: "#3d1220", color: "#ede1cf", fontWeight: 600, letterSpacing: "0.05em" }}
            >
              {loading ? "SENDING..." : "SEND RESET LINK"}
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

export default ForgotPassword;