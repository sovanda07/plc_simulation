import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import usePLCData from "../hooks/usePLCData";

import DashboardPage from "./DashboardPage";
import MonitorPage from "./MonitorPage";
import AlarmsPage from "./AlarmsPage";
import HistoricalPage from "./HistoricalPage";
import UsersPage from "./UsersPage";

const Dashboard = () => {
    const [activePage, setActivePage] = useState("dashboard");
    const { machines, sensorData, alarms, unackedAlarms, setAlarms } = usePLCData(); 

    const renderPage = () => {
        switch (activePage) {
            case "dashboard": return <DashboardPage machines={machines} sensorData={sensorData} />;
            case "monitor": return <MonitorPage machines={machines} sensorData={sensorData} />;
            case "alarms": return <AlarmsPage alarms={alarms} setAlarms={setAlarms} />; 
            case "historical": return <HistoricalPage machines={machines} />;
            case "users": return <UsersPage />;
            default: return <DashboardPage machines={machines} sensorData={sensorData} />;
        }
    };

    return (
        <div className="main-layout">
            <Sidebar
                activePage={activePage}
                onNavigate={setActivePage}
                alarmCount={unackedAlarms}
            />
            <div className="main-content">
                <Topbar machines={machines} />
                <div className="page-content">
                    {renderPage()}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;