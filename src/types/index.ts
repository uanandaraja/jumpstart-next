export interface User {
  id: string | null;
  googleId: string | null;
  email: string | null;
  emailVerified: boolean;
  name: string | null;
  givenName: string | null;
  familyName: string | null;
  profileImageUrl: string | null;
}
