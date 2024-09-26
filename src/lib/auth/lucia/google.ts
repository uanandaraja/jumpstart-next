import { Google } from "arctic";

const baseUrl = process.env.BASE_URL || "http://localhost:3000";

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  `${baseUrl}/api/auth/google/callback`,
);
