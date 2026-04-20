import { useEffect } from "react";
import Map from "../components/Map";
import { socket } from "../lib/socket";

const Homepage = () => {
  useEffect(() => {
    socket.connect(); // <-- missing

    socket.on("connect", () => console.log("connected:", socket.id));
    socket.on("disconnect", () => console.log("disconnected"));
    socket.on("newAlert", (data) => console.log("alert:", data));

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
