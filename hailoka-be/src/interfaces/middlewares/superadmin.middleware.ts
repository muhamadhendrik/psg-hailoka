import { Request, Response, NextFunction } from "express";

/**
 * Middleware to check if the authenticated user is a super admin
 */
export const superAdminMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userType = res.locals.user_type;

    if (userType !== "superadmin") {
        return res.status(403).json({ error: "Forbidden: Super admin access required" });
    }

    next();
};

