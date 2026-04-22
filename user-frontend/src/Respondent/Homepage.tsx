import { useEffect } from "react";
import Map from "../components/Map";
import { socket } from "../lib/socket";
import { useAuth } from "../contexts/AuthContext";

const Homepage = () => {
  const { user } = useAuth();
  const { role } = user!;
  useEffect(() => {
    socket.connect(); // <-- missing

    socket.on("connect", () => console.log("connected:", socket.id));
    socket.on("disconnect", () => console.log("disconnected"));
    socket.on(`alert:${role}`, (data) => console.log("alert:", data));

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("newAlert"); // <-- was "getAlerts"
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <div className="absolute inset-0 z-0">
        <Map />
      </div>
    </div>
  );
};

export default Homepage;
