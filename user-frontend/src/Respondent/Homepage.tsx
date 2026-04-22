import { useEffect } from "react";
import Map from "../components/Map";
import { socket } from "../lib/socket";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

const Homepage = () => {
  const { user } = useAuth();
  const { role } = user!;
  useEffect(() => {
    socket.connect(); // <-- missing

    socket.on("connect", () => console.log("connected:", socket.id));
    socket.on("disconnect", () => console.log("disconnected"));
    socket.on(`alert:${role}`, (data) =>
      toast(
        <div className="w-full max-w-sm rounded-lg border border-red-500 bg-red-50 shadow-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-red-600 text-white font-bold">
              {data.alertFrom.firstName?.[0]}
              {data.alertFrom.lastName?.[0]}
            </div>

            <div className="flex-1">
              <p className="text-red-700 font-bold text-sm uppercase tracking-wide">
                🚨 Emergency Alert
              </p>
              <p className="font-semibold text-gray-900">
                {data.alertFrom.firstName} {data.alertFrom.lastName}
              </p>
              <p className="text-xs text-gray-600">{data.alertFrom.phone}</p>
            </div>
          </div>

          <div className="mb-4 text-sm text-gray-800">
            Needs immediate assistance. Please respond quickly.
          </div>

          <div className="flex gap-2">
            <button className="flex-1 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors">
              Accept
            </button>
            <button className="flex-1 rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-300 transition-colors">
              Reject
            </button>
          </div>
        </div>,
      ),
    );
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off(`alert:${role}`);
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
