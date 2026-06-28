import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const NAV_ITEMS = [
    { id: "dashboard", label: "Dashboard", icon: "grid_view" },
    { id: "monitor", label: "Real-Time", icon: "settings_input_antenna" },
    { id: "alarms", label: "Alarms", icon: "circle_notifications" },
    { id: "historical", label: "Historical", icon: "show_chart" },
    { id: "users", label: "Users", icon: "admin_panel_settings" },
];

const Sidebar = ({ activePage, onNavigate, alarmCount }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="sidebar">

            {/* Logo */}
            <div className="sidebar-logo" onClick={() => onNavigate("dashboard")} style={{ cursor: "pointer" }}>PLCMON</div>

            {/* Nav */}
            <nav className="sidebar-nav">
                {NAV_ITEMS.map(item => (
                    <button
                        key={item.id}
                        className={`nav-item ${activePage === item.id ? "active" : ""}`}
                        onClick={() => onNavigate(item.id)}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                            {item.icon}
                        </span>
                        <span>{item.label}</span>

                        {item.id === "alarms" && alarmCount > 0 && (
                            <span style={{
                                marginLeft: "auto",
                                background: "#EF4444",
                                color: "#fff",
                                borderRadius: 10,
                                fontSize: 10,
                                fontWeight: 700,
                                padding: "1px 6px",
                            }}>
                                {alarmCount}
                            </span>
                        )}
                    </button>
                ))}
            </nav>

            {/* Footer */}
            <div className="sidebar-footer">
                <div className="sidebar-user">{user?.username}</div>
                <div className={user?.role === "Admin" ? "sidebar-role-admin" : "sidebar-role-operator"}>{user?.role}</div>
                <button className="btn-signout" onClick={handleLogout}>
                    Sign out
                </button>
            </div>

        </div>
    );
};

export default Sidebar;