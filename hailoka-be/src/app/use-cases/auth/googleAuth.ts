import { OAuth2Client } from "google-auth-library";
import { UserRepository } from "../../../infrastructure/repositories/user.repository";
import { UserAuthMethodsRepository } from "../../../infrastructure/repositories/user-auth.repository";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class GoogleAuthService {

  constructor(
    private userRepo: UserRepository,
    private userAuthRepo: UserAuthMethodsRepository
  ) {}

async loginOrRegisterGoogle(idToken: string) {

    // 1. Verify Google ID Token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID || "",
    });

    const payload = ticket.getPayload();

    if (!payload) throw new Error("Invalid Google token");

    const { sub, email, name, picture } = payload;

    if (!email) throw new Error("Google account has no email");

    // 2. Check if user_auth_methods already exists for google_login
    const existingGoogleAuth = await this.userAuthRepo.findByProviderId(
      "google_login",
      sub
    );

    if (existingGoogleAuth) {
      // User already registered with Google
      const user = await this.userRepo.findById(existingGoogleAuth.userId);
      return { user, isNew: false };
    }

    // 3. Check if user exists by email in users table
    const existingUser = await this.userRepo.findByEmail(email);

    if (existingUser) {

      // User exists but maybe only with "password" login
      const existingPasswordAuth = await this.userAuthRepo.findByUserIdAndProvider(
        existingUser.id,
        "password"
      );

      if (existingPasswordAuth) {

        // Attach google_login method to this existing user
        await this.userAuthRepo.create({
          userId: existingUser.id,
          provider: "google_login",
          providerUserId: sub,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return { user: existingUser, isNew: false };
        
      }
    }

    // 4. If no user with this email, create new user and auth method
    const newUser = await this.userRepo.create({
      name: name ?? "Unknown",
      email,
      picturePath: picture ?? null,
      isVerifiedEmail: true,
      userType: "user",
    });

    await this.userAuthRepo.create({
      userId: newUser.id,
      provider: "google_login",
      providerUserId: sub,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { user: newUser, isNew: true };
  }
}