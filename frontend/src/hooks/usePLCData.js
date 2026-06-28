import { useEffect, useState } from "react";
import socket from "../socket/socket";
import api from "../api/axios";

const usePLCData = () => {
    const [machines, setMachines] = useState([]);
    const [sensorData, setSensorData] = useState({});
    const [alarms, setAlarms] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return; // ← wait until token exists

                const [machinesRes, alarmsRes] = await Promise.all([
                    api.get("/api/machines"),
                    api.get("/api/alarms"),
                ]);
                setMachines(machinesRes.data);
                setAlarms(alarmsRes.data);
            } catch (err) {
                console.error(err);
            }
        };

        // Small delay to ensure token is saved first
        const timeout = setTimeout(fetchData, 500);

        socket.on("sensor_update", (data) => {
            setSensorData(prev => ({
                ...prev,
                [data.machineId]: data,
            }));
        });

        socket.on("new_alarm", (alarm) => {
            setAlarms(prev => [alarm, ...prev]);
        });

        return () => {
            clearTimeout(timeout);
            socket.off("sensor_update");
            socket.off("new_alarm");
        };
    }, []);

    const unackedAlarms = alarms.filter(a => !a.acknowledged).length;

    return { machines, sensorData, alarms, unackedAlarms, setAlarms };
};

export default usePLCData;