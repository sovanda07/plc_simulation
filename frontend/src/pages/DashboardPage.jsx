const StatusBadge = ({ status }) => {
    const styles = {
        Running: { background: "#22C55E22", border: "1px solid #22C55E44", color: "#22C55E" },
        Stopped: { background: "#4B556322", border: "1px solid #4B556344", color: "#4B5563" },
        Alarm: { background: "#EF444422", border: "1px solid #EF444444", color: "#EF4444" },
    };
    return (
        <span style={{ ...styles[status], padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
            {status}
        </span>
    );
};

const KPICard = ({ label, value, unit, icon, color, sub }) => (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</span>
            <span className="material-symbols-outlined" style={{ fontSize: 22, color }}>{icon}</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 32, fontWeight: 700, color, lineHeight: 1 }}>{value}</span>
            <span style={{ fontSize: 13, color: "#6B7280" }}>{unit}</span>
        </div>
        {sub && <span style={{ fontSize: 12, color: "#6B7280" }}>{sub}</span>}
    </div>
);

const DashboardPage = ({ machines, sensorData }) => {
    const totalProduction = Object.values(sensorData).reduce((sum, d) => sum + (d.productionCount || 0), 0);
    const avgTemp = machines.length > 0
        ? (Object.values(sensorData).reduce((sum, d) => sum + (d.temperature || 0), 0) / machines.length).toFixed(1)
        : 0;
    const totalEnergy = Object.values(sensorData).reduce((sum, d) => sum + (d.energy || 0), 0).toFixed(1);
    const runningCount = machines.filter(m => m.status === "Running").length;

    return (
        <div>
            <div className="page-title">Plant Overview</div>
            <div className="page-subtitle">Live data · updates every second</div>

            {/* KPI Cards */}
            <div className="card-grid-4" style={{ marginBottom: 32 }}>
                <KPICard
                    label="Total Production"
                    value={totalProduction}
                    unit="units"
                    icon="inventory_2"
                    color="#22C55E"
                    sub="All machines combined"
                />
                <KPICard
                    label="Avg Temperature"
                    value={avgTemp}
                    unit="°C"
                    icon="device_thermostat"
                    color={Number(avgTemp) > 80 ? "#F59E0B" : "#00D4FF"}
                    sub={Number(avgTemp) > 80 ? "Above normal range" : "Within normal range"}
                />
                <KPICard
                    label="Total Energy"
                    value={totalEnergy}
                    unit="kW"
                    icon="bolt"
                    color="#00D4FF"
                    sub="Current consumption"
                />
                <KPICard
                    label="Machines Running"
                    value={runningCount}
                    unit={`/ ${machines.length}`}
                    icon="precision_manufacturing"
                    color={runningCount === machines.length ? "#22C55E" : runningCount === 0 ? "#EF4444" : "#F59E0B"}
                    sub={runningCount === machines.length ? "All machines active" : `${machines.length - runningCount} machine(s) offline`}
                />
            </div>

            {/* Section Label */}
            <div style={{ fontSize: 11, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
                Machines
            </div>

            {/* Machine Cards */}
            <div className="card-grid-3">
                {machines.map(machine => {
                    const data = sensorData[machine.machineId] || {};
                    const isAlarm = machine.status === "Alarm";
                    const statusColor = { Running: "#22C55E", Stopped: "#4B5563", Alarm: "#EF4444" };
                    const color = statusColor[machine.status] || "#4B5563";

                    return (
                        <div key={machine.machineId} className="card" style={{
                            borderColor: isAlarm ? "#EF444466" : "#1E2D40",
                            boxShadow: isAlarm ? "0 0 24px #EF444422" : "none",
                            padding: 0,
                            overflow: "hidden",
                        }}>
                            {/* Card Header */}
                            <div style={{
                                padding: "16px 20px",
                                borderBottom: "1px solid #1E2D40",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                background: isAlarm ? "#EF444408" : "transparent",
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: 8,
                                        background: color + "22", border: `1px solid ${color}44`,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                    }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: 20, color }}>
                                            precision_manufacturing
                                        </span>
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 15, color: "#E5E7EB" }}>{machine.name}</div>
                                        <div style={{ fontSize: 12, color: "#6B7280" }}>{machine.location}</div>
                                    </div>
                                </div>
                                <StatusBadge status={machine.status} />
                            </div>

                            {/* Sensor Grid */}
                            <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                {[
                                    { label: "Temperature", value: data.temperature?.toFixed(1), unit: "°C", icon: "thermometer", color: data.temperature > 90 ? "#EF4444" : "#00D4FF" },
                                    { label: "Speed", value: data.speed?.toFixed(0), unit: "RPM", icon: "speed", color: "#00D4FF" },
                                    { label: "Current", value: data.current?.toFixed(1), unit: "A", icon: "electric_bolt", color: data.current > 5.5 ? "#F59E0B" : "#22C55E" },
                                    { label: "Energy", value: data.energy?.toFixed(1), unit: "kW", icon: "bolt", color: "#00D4FF" },
                                ].map(({ label, value, unit, icon, color }) => (
                                    <div key={label} style={{
                                        background: "#0A0E1A",
                                        borderRadius: 8,
                                        padding: "10px 12px",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 6,
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#6B7280" }}>{icon}</span>
                                            <span style={{ fontSize: 10, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
                                        </div>
                                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 700, color }}>
                                            {value ?? "--"} <span style={{ fontSize: 11, color: "#6B7280", fontWeight: 400 }}>{unit}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer bar */}
                            <div style={{
                                padding: "10px 20px",
                                borderTop: "1px solid #1E2D40",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}>
                                <span style={{ fontSize: 11, color: "#6B7280" }}>Production</span>
                                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, color: "#22C55E" }}>
                                    {data.productionCount ?? "--"} units
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DashboardPage;