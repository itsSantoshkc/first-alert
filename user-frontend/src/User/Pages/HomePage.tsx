import Map from "@/components/Map";
import { useEffect, useState } from "react";
import EmergencyAlert from "../components/EmergencyAlert";
import { socket } from "@/lib/socket";

const Homepage = () => {
  const [position, setPosition] = useState<[number, number]>([
    27.5878, 85.3213,
  ]);

  const [alertId, setAlertId] = useState<string | null>(null);

  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => console.log("connected:", socket.id));
    socket.on("disconnect", () => console.log("disconnected"));
    console.log(alertId);
    if (isAvailable) {
      setIsAvailable(false);
      socket.on(`activeAlert:${alertId}`, (data) => {
        console.log(data);
      }); // );
    }

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, [alertId]);
  return (
    <>
      <div className="absolute inset-0 z-0">
        <Map position={position} setPosition={setPosition} />
      </div>
      <EmergencyAlert setAlertId={setAlertId} />
    </>
  );
};

export default Homepage;
