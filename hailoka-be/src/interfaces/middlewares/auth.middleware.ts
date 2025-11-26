import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // const auth = req.headers.authorization;
    // if (!auth?.startsWith("Bearer ")) {
    //   return res.status(401).json({ error: "Missing token" });
    // }
    // const token = auth.split(" ")[1]!;

    const token = req.cookies?.token;

    // const token = req.cookies?.token ||
    //   (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1]: null);

    if (!token) {
        return res.status(401).json({ error: "Missing authentication token" });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
            user_id: string;
            email?: string;
            userType?: string;
        };

        res.locals.user_id = payload.user_id;
        res.locals.user_email = payload.email;
        res.locals.user_type = payload.userType;

        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

export const authMiddlewareBearer = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader =
            req.headers.authorization || req.headers.Authorization;

        if (!authHeader || typeof authHeader !== "string") {
            return res
                .status(401)
                .json({ error: "Missing authorization header" });
        }

        // Format harus: Bearer <token>
        const [scheme = "", token = ""] = authHeader.split(" ");

        if (scheme.toLowerCase() !== "bearer" || !token) {
            return res
                .status(401)
                .json({ error: "Invalid authorization format" });
        }

        // Verifikasi JWT
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
            user_id: string;
            email?: string;
            userType?: string | null;
        };

        // Simpan ke res.locals (mengikuti standar project kamu)
        res.locals.user_id = payload.user_id;
        res.locals.user_email = payload.email || null;
        res.locals.user_type = payload.userType || null;

        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};
