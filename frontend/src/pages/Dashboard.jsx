import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import usePLCData from "../hooks/usePLCData";

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { machines, sensorData, alarms, unackedAlarms, setAlarms } = usePLCData();

    // Figure out which page is active from the URL
    const activePage = location.pathname.split("/dashboard/")[1] || "dashboard";

    return (
        <div className="main-layout">
            <Sidebar
                activePage={activePage}
                onNavigate={(page) => navigate(page === "dashboard" ? "/dashboard" : `/dashboard/${page}`)}
                alarmCount={unackedAlarms}
            />
            <div className="main-content">
                <Topbar machines={machines} />
                <div className="page-content">
                    {/* Outlet renders the matched child route, pass data via context */}
                    <Outlet context={{ machines, sensorData, alarms, setAlarms }} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;