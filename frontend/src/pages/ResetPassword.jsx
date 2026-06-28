import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirm) {
            return setError("Passwords do not match");
        }

        setLoading(true);
        try {
            const res = await api.post(`/api/auth/reset-password/${token}`, { password });
            setMessage(res.data.message);
            setTimeout(() => navigate("/"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">

                <div className="login-logo">
                    <h1>PLCMON</h1>
                    <p>Industrial Control System Dashboard</p>
                </div>

                <div className="login-title">Reset password</div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="min. 8 characters"
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            placeholder="••••••••"
                            className="form-input"
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    {message && (
                        <div style={{ fontSize: 12, color: "#22C55E", background: "#0a1f0a", border: "1px solid #1a3f1a", borderRadius: 6, padding: "8px 12px", marginBottom: 16 }}>
                            {message} Redirecting to login...
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? "Resetting..." : "Reset password →"}
                    </button>
                </form>

            </div>
        </div>
    );
};

export default ResetPassword;