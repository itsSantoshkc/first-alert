import z from "zod";

export const alertType = z.enum(["Medic", "FireFighter", "Police"]);

export type AlertType = z.infer<typeof alertType>;

export const alertSchema = z.object({
  user: z.object({
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string().length(10, "Phone number should be 10 digits long"),
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

export const acceptAlertSchema = alertSchema.extend({
  socketId: z.string(),
});

export const serverAddress =
  import.meta.env.VITE_SERVER_ADDRESS || "http://localhost:3000";
