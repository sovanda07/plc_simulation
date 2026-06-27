import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api/axios";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Operator");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api.post("/api/auth/register", { username, email, password, role });
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
            setLoading(false);
        }
    };

    return (
        <div className='login-page'>
            <div className='login-card'>

                <div className='login-logo'>
                    <h1>PLCMON</h1>
                    <p>Industrial Control System Dashboard</p>
                </div>

                <div className='login-title'>Create account</div>

                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label className='form-label'>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="johndoe"
                            className='form-input'
                        />
                    </div>

                    <div className='form-group'>
                        <label className='form-label'>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="abc@example.com"
                            className='form-input'
                        />
                    </div>

                    <div className='form-group'>
                        <label className='form-label'>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="at least 8 characters"
                            className='form-input'
                        />
                    </div>

                    <div className='form-group'>
                        <label className='form-label'>Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className='form-input'
                        >
                            <option value="Operator">Operator</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>

                    {error && <div className='error-message'>{error}</div>}

                    <button type='submit' disabled={loading} className='btn-primary'>
                        {loading ? "Creating account..." : "Create account →"}
                    </button>

                    <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#6B7280" }}>
                        Already have an account?{" "}
                        <span
                            onClick={() => navigate("/")}
                            style={{ color: "#00D4FF", cursor: "pointer" }}
                        >
                            Sign in
                        </span>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default Register;