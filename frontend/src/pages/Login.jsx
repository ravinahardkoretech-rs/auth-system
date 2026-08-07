import { useState } from "react";
import { login } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { setToken } from "../utils/tokenStorage";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await login({ ...formData, rememberMe });

      setToken(data.token, rememberMe);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard", { state: { justLoggedIn: true } });
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
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
            Welcome back
          </p>
          <h1
            className="text-center text-4xl mb-1"
            style={{ color: "#3d1220", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
          >
            Sign In
          </h1>

          <div className="flex items-center justify-center gap-3 my-6">
            <span style={{ width: 24, height: 1, backgroundColor: "#8a6d3f" }} />
            <span style={{ width: 6, height: 6, backgroundColor: "#8a6d3f", transform: "rotate(45deg)" }} />
            <span style={{ width: 24, height: 1, backgroundColor: "#8a6d3f" }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div>
              <label className="block text-xs uppercase tracking-wider mb-1.5" style={{ color: "#6b4f3a" }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded-sm outline-none"
                style={{ backgroundColor: "#f7f1e6", border: "1px solid #c9b79c", color: "#3d1220" }}
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider mb-1.5" style={{ color: "#6b4f3a" }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 rounded-sm outline-none"
                style={{ backgroundColor: "#f7f1e6", border: "1px solid #c9b79c", color: "#3d1220" }}
                required
              />
            </div>

            <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "#6b4f3a" }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: "#8a6d3f" }}
              />
              Remember me
            </label>

            <button
              type="submit"
              className="w-full py-3 mt-2 rounded-sm tracking-wide transition-colors"
              style={{ backgroundColor: "#3d1220", color: "#ede1cf", fontWeight: 600, letterSpacing: "0.05em" }}
            >
              SIGN IN
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link to="/forgot-password" className="text-sm hover:underline" style={{ color: "#8a6d3f" }}>
              Forgot your password?
            </Link>
          </div>
        </div>

        <div
          className="text-center py-4 text-sm"
          style={{ backgroundColor: "#3d1220", color: "#c9b79c", fontFamily: "'Inter', sans-serif" }}
        >
          New here?{" "}
          <Link to="/register" style={{ color: "#ede1cf", fontWeight: 600 }}>
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;