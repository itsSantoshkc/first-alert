import { useEffect, useState } from "react";
import Map from "../components/Map";
import { socket } from "../lib/socket";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { useFetchClient } from "@/utilities/useFetchClient";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

const alertType = z.enum(["Medic", "FireFighter", "Police"]);
const acceptAlertSchema = z.object({
  user: z.object({
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string("Phone number should 10 digits long").length(10),
  }),
  alertType: alertType,
  socketId: z.string(),
  latitude: z
    .number({ error: "Latitude must be a number" })
    .min(-90, "Latitude must be ≥ -90")
    .max(90, "Latitude must be ≤ 90"),
  longitude: z
    .number({ error: "Longitude must be a number" })
    .min(-180, "Longitude must be ≥ -180")
    .max(180, "Longitude must be ≤ 180"),
});

type AcceptAlertData = z.infer<typeof acceptAlertSchema>;
type AlertType = z.infer<typeof alertType>;

const Homepage = () => {
  const { protectedFetch } = useFetchClient();
  const { user } = useAuth();
  const { role, userId } = user!;

  const [position, setPosition] = useState<[number, number]>([
    27.5878, 85.3213,
  ]);
  const [isActivelyResponding, setIsActivelyRespoding] =
    useState<boolean>(false);

  const { mutate } = useMutation({
    mutationFn: async (data: AcceptAlertData) => {
      setIsActivelyRespoding(true);
      const res = await protectedFetch(
        "http://localhost:3000/alert/accept-alert",
        {
          method: "PATCH",
          body: JSON.stringify(data),
        },
      );
      if (!res.ok) {
        setIsActivelyRespoding(false);
        throw new Error("Failed to fetch user profile");
      }

      return res.json();
    },
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (err) => {
      console.error(err.message);
    },
  });

  const { mutate: updateLocation } = useMutation({
    mutationFn: async (userLocation: {
      latitude: number;
      longitude: number;
    }) => {
      const res = await protectedFetch(
        "http://localhost:3000/location/live-location",
        {
          method: "PATCH",
          body: JSON.stringify({
            responderType: role,
            ...userLocation,
          }),
        },
      );
      if (!res.ok) throw new Error("Failed to update location");
      return res.json();
    },
    onError: (err) => console.error("Location update failed:", err),
  });

  useEffect(() => {
    if (isActivelyResponding) {
      const interval = setInterval(() => {
        socket.emit("location:update", { userId, position });
      }, 5000);
      return () => clearInterval(interval);
    } else {
      const interval = setInterval(() => {
        updateLocation({ latitude: position[0], longitude: position[1] });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isActivelyResponding, position]);

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      socket.emit("join:activeAlert", { alertId: socket.id }); // join room after connect
    });
    socket.on("disconnect", () => console.log("disconnected"));
    if (!isActivelyResponding) {
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
                  Emergency Alert
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
              <button
                onClick={() => acceptAlert(data)}
                className="flex-1 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
              >
                Accept
              </button>
              <button
                onClick={() => rejectAlert(data.alertId)}
                className="flex-1 rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-300 transition-colors"
              >
                Reject
              </button>
            </div>
          </div>,
        ),
      );
    }

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off(`alert:${role}`);
      socket.disconnect();
    };
  }, []);

  const acceptAlert = async (data: AcceptAlertData) => {
    toast.dismiss();
    const alertData = {
      user: user,
      latitude: position[0],
      longitude: position[1],
      alertType: data.alertType,
      socketId: data.socketId,
    };

    const result = acceptAlertSchema.safeParse(alertData);

    if (result.success) {
      return mutate(result.data);
    }

    return console.log(result.error);
  };

  const rejectAlert = (alertId: string) => {
    socket.emit("alert:reject", { alertId, userId });
    toast.dismiss();
  };

  return (
    <div>
      <div className="absolute inset-0 z-0">
        <Map position={position} setPosition={setPosition} />
      </div>
    </div>
  );
};

export default Homepage;
