import { useEffect, useMemo, useState } from "react";
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
    phone: z.string().length(10, "Phone number should 10 digits long"),
  }),
  alertType,
  socketId: z.string(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

type AcceptAlertData = z.infer<typeof acceptAlertSchema>;

const DEFAULT_POSITION: [number, number] = [27.5878, 85.3213];

const Homepage = () => {
  const { protectedFetch } = useFetchClient();
  const { user } = useAuth();

  const userId = user?.userId;
  const role = user?.role;

  const [position, setPosition] = useState<[number, number]>(DEFAULT_POSITION);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(
    null,
  );
  const [isActivelyResponding, setIsActivelyResponding] = useState(false);

  const { mutate: acceptAlertMutate } = useMutation({
    mutationFn: async (data: AcceptAlertData) => {
      setIsActivelyResponding(true);

      const res = await protectedFetch(
        "http://localhost:3000/alert/accept-alert",
        {
          method: "PATCH",
          body: JSON.stringify(data),
        },
      );

      if (!res.ok) {
        setIsActivelyResponding(false);
        throw new Error("Failed to accept alert");
      }

      return res.json();
    },
    onSuccess: (data) => {
      console.log("Alert accepted:", data);
      toast.dismiss();
    },
    onError: (err) => {
      setIsActivelyResponding(false);
      console.error(err.message);
    },
  });

  const { mutate: updateLocation } = useMutation({
    mutationFn: async (coords: { latitude: number; longitude: number }) => {
      const res = await protectedFetch(
        "http://localhost:3000/location/live-location",
        {
          method: "PATCH",
          body: JSON.stringify({ ...coords, responderType: role }),
        },
      );

      if (!res.ok) throw new Error("Failed to update location");

      return res.json();
    },
    onError: (err) => console.error("Location update failed:", err.message),
  });

  const acceptAlert = (data: any) => {
    if (!user) return;

    toast.dismiss();

    const alertData = {
      user,
      latitude: position[0],
      longitude: position[1],
      alertType: data.alertType,
      socketId: data.socketId,
    };

    const result = acceptAlertSchema.safeParse(alertData);

    if (!result.success) {
      console.error(result.error);
      return;
    }

    acceptAlertMutate(result.data);
  };

  const rejectAlert = (alertId: string) => {
    if (!userId) return;

    socket.emit("alert:reject", { alertId, userId });
    toast.dismiss();
  };

  // Connect socket only once
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  // Join room after connect
  useEffect(() => {
    const handleConnect = () => {
      socket.emit("join:activeAlert", { alertId: socket.id });
    };

    socket.on("connect", handleConnect);

    return () => {
      socket.off("connect", handleConnect);
    };
  }, []);

  // Listen for location updates
  useEffect(() => {
    const handleLocationUpdate = (data: any) => {
      if (!data) return;
      setUserPosition([data.latitude, data.longitude]);
    };

    socket.on("location:update", handleLocationUpdate);

    return () => {
      socket.off("location:update", handleLocationUpdate);
    };
  }, []);

  // Listen for alerts
  useEffect(() => {
    if (!role) return;

    const handleAlert = (data: any) => {
      console.log(data);
      if (isActivelyResponding) return;

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
      );
    };

    socket.on(`alert:${role}`, handleAlert);

    return () => {
      socket.off(`alert:${role}`, handleAlert);
    };
  }, [role, isActivelyResponding]);

  // Send live location every 5 seconds ONLY if responding
  // useEffect(() => {
  //   if (!userId || !role || !isActivelyResponding) return;

  //   const interval = setInterval(() => {
  //     socket.emit("location:update", { userId, position });

  //     updateLocation({
  //       latitude: position[0],
  //       longitude: position[1],
  //     });
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, [userId, role, isActivelyResponding, position, updateLocation]);

  if (!userId || !role) return null;

  return (
    <div className="absolute inset-0 z-0">
      <Map
        position={position}
        setPosition={setPosition}
        respondendPosition={userPosition}
      />
    </div>
  );
};

export default Homepage;
