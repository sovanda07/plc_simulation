import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import api from "../api/axios";

const Dashboard = () => {
    const [activePage, setActivePage] = useState("dashboard");
    const [machines, setMachines] = useState([]);
    const [alarmCount, setAlarmCount] = useState(0);

    useEffect(() => {
        const fetchMachines = async () => {
            try {
                const res = await api.get("/api/machines");
                setMachines(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchAlarms = async () => {
            try {
                const res = await api.get("/api/alarms");
                const unacked = res.data.filter(a => !a.acknowledged).length;
                setAlarmCount(unacked);
            } catch (err) {
                console.error(err);
            }
        };

        fetchMachines();
        fetchAlarms();
    }, []);

    return (
        <div className="main-layout">
            <Sidebar
                activePage={activePage}
                onNavigate={setActivePage}
                alarmCount={alarmCount}
            />

            <div className="main-content">
                <Topbar machines={machines} />

                <div className="page-content">
                    <div className="page-title">Plant Overview</div>
                    <div className="page-subtitle">Live data · updates every second</div>

                    {/* Pages will go here */}
                    <div style={{ color: "#6B7280", fontFamily: "monospace" }}>
                        Active page: {activePage}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;