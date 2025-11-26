export interface UserAuthMethods {
  userId: string; // use string since it's UUID
  provider: "guest_token" | "password" | "google_login";
  providerUserId: string;
  password_hash?: string | null; // 👈 change to allow null
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}