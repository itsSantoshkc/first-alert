import Map from "@/components/Map";
import EmergencyAlert from "../components/EmergencyAlert";
import { socket } from "@/lib/socket";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import type { AlertType } from "../types";

const Homepage = () => {
  const { user } = useAuth();
  console.log(import.meta.env.VITE_SERVER_ADDRESS);
  const [position, setPosition] = useState<[number, number]>([
    27.5878, 85.3213,
  ]);
  const [responderPosition, setResponderPosition] = useState<
    [number, number] | null
  >(null);

  const [alertId, setAlertId] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<AlertType | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);

  const userId = user?.userId;

  useEffect(() => {
    if (!userId) return;

    socket.connect();

    const handleConnect = () => {
      if (alertId) {
        socket.emit("join:activeAlert", { alertId });
      }
    };

    const handleLocationUpdate = (data: any) => {
      if (!data) return;
      setResponderPosition([data.latitude, data.longitude]);
    };

    socket.on("connect", handleConnect);
    socket.on("location:update", handleLocationUpdate);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("location:update", handleLocationUpdate);
      socket.disconnect();
    };
  }, [userId, alertId]);

  if (!userId) return null;

  return (
    <>
      <div className="absolute inset-0 z-0">
        <Map
          position={position}
          setPosition={setPosition}
          respondendPosition={responderPosition}
          alertType={alertType}
        />
      </div>
      {isAvailable && (
        <EmergencyAlert
          position={position}
          setAlertType={setAlertType}
          setAlertId={setAlertId}
          setIsAvailable={setIsAvailable}
        />
      )}
    </>
  );
};

export default Homepage;
