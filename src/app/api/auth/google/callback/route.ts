import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { google } from "@/lib/auth/lucia/google";
import { lucia } from "@/lib/auth/lucia";
import { userTable } from "@/db/schema";

interface GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}

async function validateOAuthRequest(request: Request): Promise<{
  code: string;
  codeVerifier: string;
  returnTo: string | null;
} | null> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("google_oauth_state")?.value ?? null;
  const codeVerifier = cookies().get("code_verifier")?.value ?? null;
  const returnTo = cookies().get("return_to")?.value ?? null;

  console.log(`Code: ${code}, State: ${state}, Stored State: ${storedState}`);

  if (
    !code ||
    !state ||
    !storedState ||
    state !== storedState ||
    !codeVerifier
  ) {
    console.log("Invalid code, state, or stored state");
    return null;
  }

  return { code, codeVerifier, returnTo };
}

async function getGoogleUserData(accessToken: string): Promise<GoogleUser> {
  const response = await fetch(
    "https://openidconnect.googleapis.com/v1/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return await response.json();
}

async function findOrCreateUser(googleUser: GoogleUser): Promise<string> {
  const existingUser = await db
    .select()
    .from(userTable)
    .where(eq(userTable.googleId, googleUser.sub))
    .limit(1)
    .execute();

  if (existingUser.length > 0) {
    return existingUser[0].id;
  }

  const userId = generateId(15);
  await db
    .insert(userTable)
    .values({
      id: userId,
      googleId: googleUser.sub,
      email: googleUser.email,
      emailVerified: googleUser.email_verified,
      name: googleUser.name,
      givenName: googleUser.given_name,
      familyName: googleUser.family_name,
      profileImageUrl: googleUser.picture,
    })
    .execute();
  return userId;
}

async function createSessionAndSetCookie(userId: string): Promise<void> {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
}

export async function GET(request: Request): Promise<Response> {
  const validationResult = await validateOAuthRequest(request);
  if (!validationResult) {
    return new Response(null, { status: 400 });
  }

  const { code, codeVerifier } = validationResult;

  try {
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);

    const googleUser = await getGoogleUserData(tokens.accessToken);

    const userId = await findOrCreateUser(googleUser);
    await createSessionAndSetCookie(userId);

    return Response.redirect(new URL("/dashboard", request.url));
  } catch (e) {
    console.error("Error occurred:", e);
    if (
      e instanceof OAuth2RequestError &&
      e.message === "bad_verification_code"
    ) {
      console.log("Bad verification code error");
      return new Response(null, { status: 400 });
    }
    console.log("Unknown error, returning 500");
    return new Response(null, { status: 500 });
  }
}
