export interface User {
  id: string; // use string since it's UUID
  name: string;
  email?: string | null;
  picturePath?: string | null;
  isVerifiedEmail: boolean;
  hashedPassword?: string;
  createdAt: Date;
  updatedAt: Date;
  suspendedAt?: Date | null;
  deletedAt?: Date | null;
  userType: "guest" | "superadmin" | "user";
}