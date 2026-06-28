import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const UsersPage = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showAdd, setShowAdd] = useState(false);
    const [newUser, setNewUser] = useState({ username: "", email: "", password: "", role: "Operator" });
    const [addError, setAddError] = useState("");

    // Only admin can access
    if (user?.role !== "Admin") {
        return (
            <div style={{ textAlign: "center", padding: 60 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
                <div style={{ color: "#6B7280", fontFamily: "monospace" }}>Admin access required</div>
            </div>
        );
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get("/api/users");
            setUsers(res.data);
        } catch (err) {
            setError("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        setAddError("");
        try {
            await api.post("/api/users", newUser);
            setNewUser({ username: "", email: "", password: "", role: "Operator" });
            setShowAdd(false);
            fetchUsers();
        } catch (err) {
            setAddError(err.response?.data?.message || "Failed to create user");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await api.delete(`/api/users/${id}`);
            setUsers(prev => prev.filter(u => u._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div className="page-title">User Management</div>
            <div className="page-subtitle">{users.length} users · RBAC enabled</div>

            {/* Add User Button */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                <button
                    onClick={() => setShowAdd(s => !s)}
                    className="btn-primary"
                    style={{ width: "auto", padding: "8px 20px" }}
                >
                    {showAdd ? "Cancel" : "+ Add User"}
                </button>
            </div>

            {/* Add User Form */}
            {showAdd && (
                <div className="card" style={{ marginBottom: 16, borderColor: "#00D4FF44" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                        <div className="form-group">
                            <label className="form-label">Username</label>
                            <input
                                className="form-input"
                                value={newUser.username}
                                onChange={e => setNewUser(n => ({ ...n, username: e.target.value }))}
                                placeholder="johndoe"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                className="form-input"
                                type="email"
                                value={newUser.email}
                                onChange={e => setNewUser(n => ({ ...n, email: e.target.value }))}
                                placeholder="john@example.com"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                className="form-input"
                                type="password"
                                value={newUser.password}
                                onChange={e => setNewUser(n => ({ ...n, password: e.target.value }))}
                                placeholder="min. 8 characters"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Role</label>
                            <select
                                className="form-input"
                                value={newUser.role}
                                onChange={e => setNewUser(n => ({ ...n, role: e.target.value }))}
                            >
                                <option value="Operator">Operator</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                    </div>

                    {addError && <div className="error-message">{addError}</div>}

                    <button
                        onClick={handleAdd}
                        className="btn-primary"
                        style={{ width: "auto", padding: "8px 20px" }}
                    >
                        Create User
                    </button>
                </div>
            )}

            {/* Error */}
            {error && <div className="error-message">{error}</div>}

            {/* Loading */}
            {loading && (
                <div style={{ textAlign: "center", padding: 40, color: "#6B7280", fontFamily: "monospace" }}>
                    Loading users...
                </div>
            )}

            {/* Users List */}
            {!loading && (
                <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Created</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id}>
                                    {/* Avatar + Username */}
                                    <td>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <div style={{
                                                width: 32, height: 32, borderRadius: "50%",
                                                background: "#00D4FF22", border: "1px solid #00D4FF44",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: "#00D4FF"
                                            }}>
                                                {u.username[0].toUpperCase()}
                                            </div>
                                            <span>{u.username}</span>
                                        </div>
                                    </td>

                                    {/* Email */}
                                    <td style={{ color: "#6B7280" }}>{u.email}</td>

                                    {/* Role Badge */}
                                    <td>
                                        <span style={{
                                            padding: "3px 10px", borderRadius: 4, fontSize: 12,
                                            background: u.role === "Admin" ? "#F59E0B22" : "#00D4FF22",
                                            color: u.role === "Admin" ? "#F59E0B" : "#00D4FF",
                                        }}>
                                            {u.role}
                                        </span>
                                    </td>

                                    {/* Created At */}
                                    <td style={{ color: "#6B7280", fontSize: 12, fontFamily: "monospace" }}>
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </td>

                                    {/* Delete */}
                                    <td>
                                        {u.username !== user.username && (
                                            <button
                                                onClick={() => handleDelete(u._id)}
                                                style={{
                                                    padding: "4px 12px", background: "transparent",
                                                    border: "1px solid #EF444455", borderRadius: 6,
                                                    color: "#EF4444", fontSize: 12, cursor: "pointer",
                                                }}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UsersPage;