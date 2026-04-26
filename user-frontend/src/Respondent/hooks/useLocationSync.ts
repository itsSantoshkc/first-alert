import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { useMutation } from "@tanstack/react-query";
import { useFetchClient } from "@/utilities/useFetchClient";

type Props = {
  userId: string;
  role: string;
  position: [number, number];
  isActivelyResponding: boolean;
};

export const useLocationSync = ({
  userId,
  role,
  position,
  isActivelyResponding,
}: Props) => {
  const { protectedFetch } = useFetchClient();

  const { mutate: updateLocation } = useMutation({
    mutationFn: async (coords: { latitude: number; longitude: number }) => {
      const res = await protectedFetch(
        "http://localhost:3000/location/live-location",
        {
          method: "PATCH",
          body: JSON.stringify({ responderType: role, ...coords }),
        },
      );
      if (!res.ok) throw new Error("Failed to update location");
      return res.json();
    },
    onError: (err) => console.error("Location update failed:", err),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      updateLocation({ latitude: position[0], longitude: position[1] });

      if (isActivelyResponding) {
        socket.emit("location:update", { userId, position });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isActivelyResponding, position]);
};
