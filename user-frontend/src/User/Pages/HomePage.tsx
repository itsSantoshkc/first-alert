import Map from "@/components/Map";
import { useEffect, useState } from "react";
import EmergencyAlert from "../components/EmergencyAlert";
import { socket } from "@/lib/socket";

const Homepage = () => {
  const [position, setPosition] = useState<[number, number]>([
    27.5878, 85.3213,
  ]);
  const [respondendPosition, setRespondendPosition] = useState<
    [number, number] | null
  >(null);
  const [alertId, setAlertId] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      socket.emit("join:activeAlert", { alertId }); // join room after connect
    });

    socket.on("location:update", (data) => {
      if (data) {
        setRespondendPosition([data.latitude, data.longitude]);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("location:update");
      socket.disconnect();
    };
  }, [alertId]);
  return (
    <>
      <div className="absolute inset-0 z-0">
        <Map
          position={position}
          setPosition={setPosition}
          respondendPosition={respondendPosition}
        />
      </div>
      <EmergencyAlert setAlertId={setAlertId} setIsAvailable={setIsAvailable} />
    </>
  );
};

export default Homepage;
