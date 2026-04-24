import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useFetchClient } from "@/utilities/useFetchClient";

const alertType = z.enum(["Medic", "FireFighter", "Police"]);
const alertSchema = z.object({
  user: z.object({
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string("Phone number should 10 digits long").length(10),
  }),
  alertType: alertType,
  latitude: z
    .number({ error: "Latitude must be a number" })
    .min(-90, "Latitude must be ≥ -90")
    .max(90, "Latitude must be ≤ 90"),
  longitude: z
    .number({ error: "Longitude must be a number" })
    .min(-180, "Longitude must be ≥ -180")
    .max(180, "Longitude must be ≤ 180"),
});

type SendAlertData = z.infer<typeof alertSchema>;
type AlertType = z.infer<typeof alertType>;
type EmergencyAlertProps = {
  setAlertId: (alertId: string) => void;
  setIsAvailable: (isAvailable: boolean) => void;
};

const EmergencyAlert = ({
  setAlertId,
  setIsAvailable,
}: EmergencyAlertProps) => {
  const { protectedFetch } = useFetchClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const sendAlerts = async (alertType: AlertType) => {
    const data = {
      user: user,
      latitude: 27.5878,
      longitude: 85.3213,
      alertType: alertType,
    };
    const result = alertSchema.safeParse(data);

    if (result.success) {
      return mutate(result.data);
    }
    return console.log(result.error);
  };

  const sendAlertToServer = async (data: SendAlertData) => {
    const res = await protectedFetch("http://localhost:3000/alert/send-alert", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error("Failed to fetch user profile");
    }

    return res.json();
  };

  const { mutate } = useMutation({
    mutationFn: sendAlertToServer,
    onSuccess: (data) => {
      setIsAvailable(false);
      setAlertId(data.alertId);
    },
    onError: (err) => {
      setIsAvailable(true);
      console.error(err.message);
    },
  });
  return (
    <>
      {/* --- FLOATING ALERT PILL --- */}
      <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white shadow-[0_0_40px_rgba(220,38,38,0.5)] rounded-full px-8 py-4 font-extrabold text-lg flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95"
        >
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
          </span>
          EMERGENCY ALERT
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          {/* Modal Container */}
          <div className="bg-white rounded-4xl w-full max-w-4xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="text-center p-8 pb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                Request Emergency Assistance
              </h2>
              <p className="text-gray-500 font-medium">
                Select the primary service you require immediately at your
                location.
              </p>
            </div>

            <div className="p-8 pt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => sendAlerts("Police")}
                className="group relative flex flex-col items-center p-8 bg-slate-50 hover:bg-blue-600 rounded-3xl border-2 border-slate-100 hover:border-blue-600 transition-all duration-300 shadow-sm hover:shadow-xl text-center"
              >
                <div className="w-20 h-20 bg-blue-100 group-hover:bg-white rounded-full flex items-center justify-center mb-6 transition-colors">
                  {/* Badge Icon */}
                  <svg
                    className="w-10 h-10 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-white mb-2">
                  Police
                </h3>
                <p className="text-sm text-gray-500 group-hover:text-blue-100 font-medium">
                  Security, crime, or immediate threat.
                </p>
              </button>

              <button
                onClick={() => sendAlerts("FireFighter")}
                className="group relative flex flex-col items-center p-8 bg-orange-50 hover:bg-orange-600 rounded-3xl border-2 border-orange-100 hover:border-orange-600 transition-all duration-300 shadow-sm hover:shadow-xl text-center"
              >
                <div className="w-20 h-20 bg-orange-100 group-hover:bg-white rounded-full flex items-center justify-center mb-6 transition-colors">
                  <svg
                    className="w-10 h-10 text-orange-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.66 11.2c-.23-.3-.51-.56-.77-.82-.67-.6-1.43-1.03-2.07-1.66C13.33 7.26 13 4.85 13.95 3c-.95.23-1.78.75-2.49 1.32-2.59 2.08-3.61 5.75-2.39 8.9.04.1.08.2.08.33 0 .22-.15.42-.35.5-.22.1-.46.04-.56-.16h-.01c-.13-.26-.18-.54-.18-.82 0-.25.04-.49.1-.73-.55.67-.93 1.54-1.07 2.44-.13.88.04 1.77.45 2.54.43.8 1.05 1.48 1.78 2.01.07.06.15.11.22.18.23.2.49.38.75.54.66.42 1.42.66 2.21.66 2.37 0 4.29-1.92 4.29-4.29 0-1.74-1-3.32-2.47-4.13l-.04-.03-.02-.02c-.1-.08-.2-.16-.3-.24z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-white mb-2">
                  Fire
                </h3>
                <p className="text-sm text-gray-500 group-hover:text-orange-100 font-medium">
                  Fires, rescues, or hazardous materials.
                </p>
              </button>

              <button
                onClick={() => sendAlerts("Medic")}
                className="group relative flex flex-col items-center p-8 bg-red-50 hover:bg-red-600 rounded-3xl border-2 border-red-100 hover:border-red-600 transition-all duration-300 shadow-sm hover:shadow-xl text-center"
              >
                <div className="w-20 h-20 bg-red-100 group-hover:bg-white rounded-full flex items-center justify-center mb-6 transition-colors">
                  <svg
                    className="w-10 h-10 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-white mb-2">
                  Medic
                </h3>
                <p className="text-sm text-gray-500 group-hover:text-red-100 font-medium">
                  Medical emergencies or injuries.
                </p>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmergencyAlert;
