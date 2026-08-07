import { useEffect, useState } from "react";
import { getAllUsers, toggleUserActive } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data.users);
    } catch (error) {
      if (error.response?.status === 403) {
        alert("Admin access required");
        navigate("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggle = async (id) => {
    try {
      await toggleUserActive(id);
      // optimistic-ish: just refetch to stay in sync with server
      loadUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update user");
    }
  };

  return (
    <div className="min-h-screen px-4 py-10" style={{ backgroundColor: "#3d1220" }}>
      <div
        className="max-w-3xl mx-auto rounded-sm overflow-hidden"
        style={{ backgroundColor: "#ede1cf", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}
      >
        <div style={{ height: "6px", backgroundColor: "#8a6d3f" }} />

        <div className="px-10 pt-10 pb-8">
          <p className="text-center text-xs tracking-[0.3em] uppercase mb-2" style={{ color: "#8a6d3f", fontFamily: "'Inter', sans-serif" }}>
            Admin
          </p>
          <h1 className="text-center text-4xl mb-1" style={{ color: "#3d1220", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
            User Management
          </h1>

          <div className="flex items-center justify-center gap-3 my-6">
            <span style={{ width: 24, height: 1, backgroundColor: "#8a6d3f" }} />
            <span style={{ width: 6, height: 6, backgroundColor: "#8a6d3f", transform: "rotate(45deg)" }} />
            <span style={{ width: 24, height: 1, backgroundColor: "#8a6d3f" }} />
          </div>

          {loading ? (
            <p className="text-center" style={{ color: "#6b4f3a", fontFamily: "'Inter', sans-serif" }}>
              Loading users...
            </p>
          ) : (
            <div className="overflow-x-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid #c9b79c" }}>
                    <th className="text-left py-2 uppercase text-xs tracking-wider" style={{ color: "#8a6d3f" }}>Name</th>
                    <th className="text-left py-2 uppercase text-xs tracking-wider" style={{ color: "#8a6d3f" }}>Email</th>
                    <th className="text-left py-2 uppercase text-xs tracking-wider" style={{ color: "#8a6d3f" }}>Role</th>
                    <th className="text-left py-2 uppercase text-xs tracking-wider" style={{ color: "#8a6d3f" }}>Status</th>
                    <th className="text-left py-2 uppercase text-xs tracking-wider" style={{ color: "#8a6d3f" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} style={{ borderBottom: "1px solid #e4d5b7" }}>
                      <td className="py-3" style={{ color: "#3d1220" }}>{u.name}</td>
                      <td className="py-3" style={{ color: "#3d1220" }}>{u.email}</td>
                      <td className="py-3" style={{ color: "#6b4f3a" }}>{u.role}</td>
                      <td className="py-3">
                        <span
                          className="px-2 py-1 rounded-sm text-xs font-semibold"
                          style={{
                            backgroundColor: u.isActive ? "#5c7a52" : "#a8453a",
                            color: "#f7f1e6",
                          }}
                        >
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => handleToggle(u._id)}
                          className="px-3 py-1.5 rounded-sm text-xs font-semibold"
                          style={{ backgroundColor: "#3d1220", color: "#ede1cf" }}
                        >
                          {u.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link to="/dashboard" className="text-sm hover:underline" style={{ color: "#8a6d3f" }}>
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;