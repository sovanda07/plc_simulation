import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import api from "../api/axios";

const HistoricalPage = () => {
    const { machines } = useOutletContext();
    const [selected, setSelected] = useState("A");
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/api/historical/${selected}`);
                const formatted = res.data.map(d => ({
                    ...d,
                    time: new Date(d.timestamp).toLocaleTimeString(),
                }));
                setHistory(formatted);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();

        // Refresh every 10 seconds
        const interval = setInterval(fetchHistory, 3000);
        return () => clearInterval(interval);
    }, [selected]);

    const charts = [
        { key: "temperature", label: "Temperature", unit: "°C", color: "#FF6B35" },
        { key: "speed", label: "Motor Speed", unit: "RPM", color: "#00D4FF" },
        { key: "current", label: "Current Draw", unit: "A", color: "#22C55E" },
        { key: "energy", label: "Energy Usage", unit: "kW", color: "#F59E0B" },
    ];

    return (
        <div>
            <div className="page-title">Historical Data</div>
            <div className="page-subtitle">Last 60 readings per machine</div>

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

            {loading && (
                <div style={{ textAlign: "center", padding: 40, color: "#6B7280", fontFamily: "monospace" }}>
                    Loading data...
                </div>
            )}

            {!loading && history.length === 0 && (
                <div style={{ textAlign: "center", padding: 40, color: "#6B7280", fontFamily: "monospace" }}>
                    No data yet — simulator needs a few seconds to generate readings.
                </div>
            )}

            {/* Charts */}
            {!loading && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    {charts.map(({ key, label, unit, color }) => (
                        <div key={key} className="card">
                            <div className="card-label" style={{ marginBottom: 16 }}>
                                {label} <span style={{ color: "#6B7280" }}>({unit})</span>
                            </div>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={history}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1E2D40" />
                                    <XAxis
                                        dataKey="time"
                                        tick={{ fill: "#6B7280", fontSize: 10 }}
                                        interval="preserveStartEnd"
                                    />
                                    <YAxis
                                        tick={{ fill: "#6B7280", fontSize: 10 }}
                                        width={40}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background: "#111827",
                                            border: "1px solid #1E2D40",
                                            borderRadius: 6,
                                            color: "#E5E7EB",
                                            fontSize: 12,
                                            fontFamily: "monospace",
                                        }}
                                        formatter={(value) => [`${value} ${unit}`, label]}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey={key}
                                        stroke={color}
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 4, fill: color }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ))}
                </div>
            )}

            {/* Production Count */}
            {!loading && (
                <div className="card" style={{ marginTop: 16 }}>
                    <div className="card-label" style={{ marginBottom: 16 }}>
                        Production Count <span style={{ color: "#6B7280" }}>(units)</span>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={history}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1E2D40" />
                            <XAxis
                                dataKey="time"
                                tick={{ fill: "#6B7280", fontSize: 10 }}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                tick={{ fill: "#6B7280", fontSize: 10 }}
                                width={40}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: "#111827",
                                    border: "1px solid #1E2D40",
                                    borderRadius: 6,
                                    color: "#E5E7EB",
                                    fontSize: 12,
                                    fontFamily: "monospace",
                                }}
                                formatter={(value) => [`${value} units`, "Production"]}
                            />
                            <Line
                                type="monotone"
                                dataKey="productionCount"
                                stroke="#22C55E"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4, fill: "#22C55E" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default HistoricalPage;