import { useOutletContext } from "react-router-dom";
import { useState } from "react";

const MonitorPage = () => {
    const { machines, sensorData } = useOutletContext();
    const [selected, setSelected] = useState("A");
    const data = sensorData[selected] || {};

    const getPercent = (value, unit) => {
        if (!value) return 0;
        if (unit === "°C") return Math.min((value / 120) * 100, 100);
        if (unit === "RPM") return Math.min((value / 160) * 100, 100);
        if (unit === "A") return Math.min((value / 8) * 100, 100);
        return 0;
    };

    return (
        <div>
            <div className="page-title">Real-Time Monitor</div>
            <div className="page-subtitle">Live sensor readings · updates every second</div>

            {/* Machine Selector */}
            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
                {machines.map(m => (
                    <button
                        key={m.machineId}
                        onClick={() => setSelected(m.machineId)}
                        style={{
                            padding: "8px 20px",
                            borderRadius: 6,
                            border: `1px solid ${selected === m.machineId ? "#00D4FF" : "#1E2D40"}`,
                            background: selected === m.machineId ? "#00D4FF18" : "#111827",
                            color: selected === m.machineId ? "#00D4FF" : "#6B7280",
                            fontWeight: selected === m.machineId ? 600 : 400,
                            cursor: "pointer",
                            fontSize: 13,
                        }}
                    >
                        {m.name}
                    </button>
                ))}
            </div>

            {/* Big Readouts */}
            <div className="card-grid-3" style={{ marginBottom: 24 }}>
                {[
                    { label: "Temperature", value: data.temperature?.toFixed(1), unit: "°C", color: data.temperature > 90 ? "#EF4444" : "#00D4FF" },
                    { label: "Motor Speed", value: data.speed?.toFixed(0), unit: "RPM", color: "#00D4FF" },
                    { label: "Current Draw", value: data.current?.toFixed(1), unit: "A", color: data.current > 5.5 ? "#F59E0B" : "#22C55E" },
                ].map(({ label, value, unit, color }) => (
                    <div key={label} className="card" style={{ textAlign: "center" }}>
                        <div className="card-label">{label}</div>
                        <div style={{ fontFamily: "monospace", fontSize: 52, fontWeight: 700, color, lineHeight: 1, margin: "12px 0" }}>
                            {value ?? "--"}
                        </div>
                        <div style={{ fontSize: 16, color: "#6B7280" }}>{unit}</div>

                        {/* Progress bar */}
                        <div style={{ marginTop: 16, background: "#0A0E1A", borderRadius: 4, height: 6, overflow: "hidden" }}>
                            <div style={{
                                height: "100%",
                                borderRadius: 4,
                                background: color,
                                width: `${getPercent(value, unit)}%`,
                                transition: "width 0.5s ease"
                            }} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Secondary Readings */}
            <div className="card-grid-3">
                {[
                    { label: "Energy Usage", value: data.energy?.toFixed(1), unit: "kW", color: "#00D4FF" },
                    { label: "Production Count", value: data.productionCount, unit: "units", color: "#22C55E" },
                    { label: "Machine Status", value: machines.find(m => m.machineId === selected)?.status, unit: "", color: { Running: "#22C55E", Stopped: "#6B7280", Alarm: "#EF4444" }[machines.find(m => m.machineId === selected)?.status] },
                ].map(({ label, value, unit, color }) => (
                    <div key={label} className="card">
                        <div className="card-label">{label}</div>
                        <div style={{ fontFamily: "monospace", fontSize: 28, fontWeight: 700, color, marginTop: 8 }}>
                            {value ?? "--"} <span style={{ fontSize: 13, color: "#6B7280" }}>{unit}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MonitorPage;