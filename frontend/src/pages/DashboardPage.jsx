const StatusBadge = ({ status }) => {
    const classes = {
        Running: "badge badge-running",
        Stopped: "badge badge-stopped",
        Alarm: "badge badge-alarm",
    };
    return <span className={classes[status] || "badge badge-stopped"}>{status}</span>;
};

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
            <div className="card-grid-4">
                <div className="card">
                    <div className="card-label">Total Production</div>
                    <div className="card-value" style={{ color: "#22C55E" }}>
                        {totalProduction}
                        <span className="card-unit">units</span>
                    </div>
                </div>
                <div className="card">
                    <div className="card-label">Avg Temperature</div>
                    <div className="card-value" style={{ color: Number(avgTemp) > 80 ? "#F59E0B" : "#00D4FF" }}>
                        {avgTemp}
                        <span className="card-unit">°C</span>
                    </div>
                </div>
                <div className="card">
                    <div className="card-label">Total Energy</div>
                    <div className="card-value">
                        {totalEnergy}
                        <span className="card-unit">kW</span>
                    </div>
                </div>
                <div className="card">
                    <div className="card-label">Machines Running</div>
                    <div className="card-value" style={{ color: "#22C55E" }}>
                        {runningCount}
                        <span className="card-unit">/ {machines.length}</span>
                    </div>
                </div>
            </div>

            {/* Machine Cards */}
            <div style={{ fontSize: 11, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
                Machines
            </div>
            <div className="card-grid-3">
                {machines.map(machine => {
                    const data = sensorData[machine.machineId] || {};
                    return (
                        <div key={machine.machineId} className="card" style={{
                            borderColor: machine.status === "Alarm" ? "#EF444466" : "#1E2D40",
                            boxShadow: machine.status === "Alarm" ? "0 0 20px #EF444422" : "none"
                        }}>
                            {/* Header */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 16, color: "#E5E7EB" }}>{machine.name}</div>
                                    <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{machine.location}</div>
                                </div>
                                <StatusBadge status={machine.status} />
                            </div>

                            {/* Sensor Values */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                {[
                                    { label: "Temp", value: data.temperature?.toFixed(1), unit: "°C", color: data.temperature > 90 ? "#EF4444" : "#00D4FF" },
                                    { label: "Speed", value: data.speed?.toFixed(0), unit: "RPM", color: "#00D4FF" },
                                    { label: "Current", value: data.current?.toFixed(1), unit: "A", color: data.current > 5.5 ? "#F59E0B" : "#22C55E" },
                                    { label: "Energy", value: data.energy?.toFixed(1), unit: "kW", color: "#00D4FF" },
                                ].map(({ label, value, unit, color }) => (
                                    <div key={label} style={{ background: "#0A0E1A", borderRadius: 6, padding: "8px 10px" }}>
                                        <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 2 }}>{label}</div>
                                        <div style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 600, color }}>
                                            {value ?? "--"} <span style={{ fontSize: 11, color: "#6B7280" }}>{unit}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DashboardPage;