import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await api.post("/api/auth/login", { email, password });
            login({ username: res.data.username, role: res.data.role }, res.data.token);
            navigate("/dashboard");
        } catch (err) {
            setError("Invalid email or password");
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

                <div className='login-title'>Sign in</div>

                <form onSubmit={handleSubmit}>
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
                            placeholder="••••••••"
                            className='form-input'
                        />
                    </div>

                    {error && <div className='error-message'>{error}</div>}

                    <button type='submit' disabled={loading} className='btn-primary'>
                        {loading ? "Signing in..." : "Sign in →"}
                    </button>
                </form>

                <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#6B7280" }}>
                    Don't have an account?{" "}
                    <span
                        onClick={() => navigate("/register")}
                        style={{ color: "#00D4FF", cursor: "pointer" }}
                    >
                        Create one
                    </span>
                </div>

            </div>
        </div>
    );                       
};                            

export default Login;