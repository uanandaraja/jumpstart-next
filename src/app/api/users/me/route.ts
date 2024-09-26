import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { lucia } from "@/lib/auth/lucia";
import { db } from "@/db";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { User } from "@/types";

export async function GET() {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value;

  if (!sessionId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { user, session } = await lucia.validateSession(sessionId);

    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user data from the database
    const users = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, user.id))
      .execute();

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the first (and only) user from the result
    const userData: User = users[0];

    // Return the user data
    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error retrieving user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
