import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";

const AlarmsPage = () => {
    const { alarms, setAlarms } = useOutletContext();
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const filtered = alarms.filter(a => {
        const matchFilter =
            filter === "All" ||
            (filter === "Active" && !a.acknowledged) ||
            (filter === "Acknowledged" && a.acknowledged);
        const matchSearch =
            a.message.toLowerCase().includes(search.toLowerCase()) ||
            `Machine ${a.machineId}`.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    const handleAcknowledge = async (id) => {
        try {
            await api.patch(`/api/alarms/${id}/acknowledge`);
            setAlarms(prev => prev.map(a => a._id === id ? { ...a, acknowledged: true } : a));
            setSuccessMsg("Alarm acknowledged successfully");
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (err) {
            console.error(err);
        }
    };

    const severityColor = {
        Critical: "#EF4444",
        Warning: "#F59E0B",
        Info: "#00D4FF",
    };

    return (
        <div>
            <div className="page-title">Alarm Management</div>
            <div className="page-subtitle">{alarms.filter(a => !a.acknowledged).length} active alarms</div>

            {/* Search and Filter */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search alarms..."
                    className="form-input"
                    style={{ flex: 1, minWidth: 200 }}
                />
                {["All", "Active", "Acknowledged"].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: "8px 16px",
                            borderRadius: 6,
                            border: `1px solid ${filter === f ? "#00D4FF" : "#1E2D40"}`,
                            background: filter === f ? "#00D4FF18" : "#111827",
                            color: filter === f ? "#00D4FF" : "#6B7280",
                            fontSize: 13,
                            cursor: "pointer",
                        }}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Alarm List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {filtered.length === 0 && (
                    <div style={{ textAlign: "center", padding: 40, color: "#6B7280", fontFamily: "monospace" }}>
                        No alarms found.
                    </div>
                )}
                {filtered.map(alarm => (
                    <div
                        key={alarm._id}
                        className={`alarm-item ${alarm.severity === "Warning" ? "warning" : alarm.severity === "Info" ? "info" : ""} ${alarm.acknowledged ? "acknowledged" : ""}`}
                        style={{ borderLeftColor: severityColor[alarm.severity] || "#6B7280" }}
                    >
                        <div style={{ flex: 1 }}>
                            {/* Header */}
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                                <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: "#E5E7EB" }}>
                                    Machine {alarm.machineId}
                                </span>
                                <span style={{
                                    padding: "2px 8px", borderRadius: 4,
                                    background: (severityColor[alarm.severity] || "#6B7280") + "22",
                                    color: severityColor[alarm.severity] || "#6B7280",
                                    fontSize: 11,
                                }}>
                                    {alarm.severity}
                                </span>
                                {alarm.acknowledged && (
                                    <span style={{ fontSize: 11, color: "#22C55E" }}>✓ Acknowledged</span>
                                )}
                            </div>

                            {/* Message */}
                            <div style={{ fontSize: 14, color: "#E5E7EB" }}>{alarm.message}</div>

                            {/* Timestamp */}
                            <div style={{ fontFamily: "monospace", fontSize: 11, color: "#6B7280", marginTop: 4 }}>
                                {new Date(alarm.timestamp).toLocaleString()}
                            </div>
                        </div>

                        {/* Acknowledge Button */}
                        {!alarm.acknowledged && (
                            <button
                                onClick={() => handleAcknowledge(alarm._id)}
                                style={{
                                    padding: "7px 16px",
                                    background: "transparent",
                                    border: "1px solid #22C55E",
                                    borderRadius: 6,
                                    color: "#22C55E",
                                    fontSize: 12,
                                    cursor: "pointer",
                                }}
                            >
                                Acknowledge
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlarmsPage;