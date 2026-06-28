import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [resetUrl, setResetUrl] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResetUrl("");
        try {
            const res = await api.post("/api/auth/forgot-password", { email });
            setResetUrl(res.data.resetUrl);
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

                <div className="login-title">Forgot password</div>
                <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 20 }}>
                    Enter your email to get a reset link.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="abc@example.com"
                            className="form-input"
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    {/* Show reset link directly */}
                    {resetUrl && (
                        <div style={{ fontSize: 12, color: "#22C55E", background: "#0a1f0a", border: "1px solid #1a3f1a", borderRadius: 6, padding: "12px", marginBottom: 16 }}>
                            <div style={{ marginBottom: 8 }}>Reset link generated:</div>
                            <a href={resetUrl} style={{ color: "#00D4FF", wordBreak: "break-all" }}>
                                {resetUrl}
                            </a>
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? "Generating..." : "Get reset link →"}
                    </button>

                    <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#6B7280" }}>
                        <span onClick={() => navigate("/")} style={{ color: "#00D4FF", cursor: "pointer" }}>
                            Back to sign in
                        </span>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default ForgotPassword;