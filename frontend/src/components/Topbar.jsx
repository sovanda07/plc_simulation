import { useState, useEffect } from "react";

const Topbar = ({ machines }) => {
    const [time, setTime] = useState(new Date().toLocaleString());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toLocaleString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const statusColor = {
        Running: "#22C55E",
        Stopped: "#4B5563",
        Alarm: "#EF4444",
    };

    return (
        <div className="topbar">
            <div className="topbar-time">
                {time} · Socket.io
                <span className="live-dot" />
            </div>
            <div style={{ display: "flex", gap: 16 }}>
                {machines.map(m => (
                    <span key={m.machineId} style={{ fontFamily: "monospace", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: statusColor[m.status] || "#4B5563", display: "inline-block" }} />
                        <span style={{ color: "#6B7280" }}>{m.name}</span>
                    </span>
                ))}
            </div>
        </div>
    );
};

export default Topbar;