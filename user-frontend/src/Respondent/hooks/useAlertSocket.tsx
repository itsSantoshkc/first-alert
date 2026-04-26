import { AlertToast } from "../components/AlertToast";
import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { toast } from "sonner";

type Props = {
  role: string;
  userId: string;
  isActivelyResponding: boolean;
  onAccept: (data: any) => void;
  onReject: () => void;
};

export const useAlertSocket = (props: Props) => {
  const { role, isActivelyResponding, onAccept, onReject } = props;
  useEffect(() => {
    if (socket.connected) socket.disconnect(); // clean previous

    socket.connect();

    socket.on("connect", () => console.log("connected:", socket.id));
    socket.on("disconnect", () => console.log("disconnected"));

    if (!isActivelyResponding) {
      socket.on(`alert:${role}`, (data) =>
        toast(
          <AlertToast data={data} onAccept={onAccept} onReject={onReject} />,
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
  ``;
};
