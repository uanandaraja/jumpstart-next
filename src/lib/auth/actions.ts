"use server";

import { lucia } from "@/lib/auth/lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value;
  if (!sessionId) return;

  await lucia.invalidateSession(sessionId);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  redirect("/");
}
