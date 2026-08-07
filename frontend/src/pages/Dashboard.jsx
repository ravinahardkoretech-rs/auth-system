import { useEffect, useState } from "react";
import { getProfile } from "../services/authService";
import { useNavigate, useLocation, Link } from "react-router-dom";
import confetti from "canvas-confetti";
import { clearToken } from "../utils/tokenStorage";

const Dashboard = () => {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setUser(data.user);
      } catch (error) {
        clearToken();
        navigate("/login");
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (location.state?.justLoggedIn) {
      const duration = 2 * 1000;
      const end = Date.now() + duration;

      const fireConfetti = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 1 },
          colors: ["#8a6d3f", "#ede1cf", "#c9b79c"],
        });

        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 1 },
          colors: ["#8a6d3f", "#ede1cf", "#c9b79c"],
        });

        if (Date.now() < end) {
          requestAnimationFrame(fireConfetti);
        }
      };

      fireConfetti();
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const logout = () => {
    clearToken();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#3d1220" }}>
      <div
        className="w-full max-w-sm rounded-sm overflow-hidden"
        style={{ backgroundColor: "#ede1cf", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}
      >
        <div style={{ height: "6px", backgroundColor: "#8a6d3f" }} />

        <div className="px-10 pt-10 pb-8 text-center">
          <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: "#8a6d3f", fontFamily: "'Inter', sans-serif" }}>
            Your account
          </p>
          <h1 className="text-4xl mb-1" style={{ color: "#3d1220", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
            Dashboard
          </h1>

          <div className="flex items-center justify-center gap-3 my-6">
            <span style={{ width: 24, height: 1, backgroundColor: "#8a6d3f" }} />
            <span style={{ width: 6, height: 6, backgroundColor: "#8a6d3f", transform: "rotate(45deg)" }} />
            <span style={{ width: 24, height: 1, backgroundColor: "#8a6d3f" }} />
          </div>

          {user && (
            <div className="space-y-3 mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div>
                <p className="text-xs uppercase tracking-wider" style={{ color: "#8a6d3f" }}>Name</p>
                <p className="text-lg" style={{ color: "#3d1220" }}>{user.name}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider" style={{ color: "#8a6d3f" }}>Email</p>
                <p className="text-lg" style={{ color: "#3d1220" }}>{user.email}</p>
              </div>
            </div>
          )}

          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="block w-full py-3 mb-3 rounded-sm tracking-wide text-center"
              style={{
                backgroundColor: "#8a6d3f",
                color: "#ede1cf",
                fontWeight: 600,
                letterSpacing: "0.05em",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              ADMIN PANEL
            </Link>
          )}

          <button
            onClick={logout}
            className="w-full py-3 rounded-sm tracking-wide transition-colors"
            style={{ backgroundColor: "#3d1220", color: "#ede1cf", fontWeight: 600, letterSpacing: "0.05em", fontFamily: "'Inter', sans-serif" }}
          >
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;