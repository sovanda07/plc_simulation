import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div style={{ minHeight: "100vh", background: "#0A0E1A", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: "monospace", fontSize: 72, fontWeight: 700, color: "#1E2D40" }}>404</div>
            <div style={{ fontFamily: "monospace", fontSize: 16, color: "#6B7280", marginBottom: 24 }}>Page not found</div>
            <button className="btn-primary" style={{ width: "auto", padding: "10px 24px" }} onClick={() => navigate("/")}>
                Back to login
            </button>
        </div>
    );
};

export default NotFound;