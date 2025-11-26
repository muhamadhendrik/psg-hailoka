import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { UserController } from "./interfaces/user.controller";
import { AuthController } from "./interfaces/auth.controller.old";
// import { GoogleAuthService } from "./app/use-cases/auth/googleAuth";
import { OrganizationController } from "./interfaces/organization.controller";
import { authMiddleware, authMiddlewareBearer } from "./interfaces/middlewares/auth.middleware";
import { StaffController } from "./interfaces/staff.controller";
import { ExtensionController } from "./interfaces/extension.controller";
import cookieParser from "cookie-parser";
import { ExtensionRuleController } from "./interfaces/extensionRule.controller";
import { QrOrganizationController } from "./interfaces/qrOrganization.controller";
import { CallController } from "./interfaces/call.controller";
import { TmpController } from "./interfaces/tmp.controller";
import { RoleController } from "./interfaces/role.controller";
import { SuperAdminController } from "./interfaces/superAdmin.controller";
import { DashboardController } from "./interfaces/dashboard.controller";
import { superAdminMiddleware } from "./interfaces/middlewares/superadmin.middleware";

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

// app.use(cors({
//   origin: "https://localhost:5173", // or "*" for all origins
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true
// }));

const allowedOrigins = [
  "https://localhost:5173",
  "http://localhost:5173",
  "http://116.90.182.149:5173",
  "https://116.90.182.149:5173",             
  "https://hailoka-stag.pasifiksgroup.com:8443",
  "https://10.249.62.29:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed for this origin: " + origin));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Routes
app.post("/users/registration", AuthController.register);
app.post("/users/login", AuthController.login);
app.post("/users/logout", AuthController.logout);

app.post("/test-email", UserController.testEmail);

app.post("/forgot-password", AuthController.forgotPassword);
app.post("/reset-password", AuthController.resetPassword);

app.post("/guest/register", AuthController.registerGuest);

app.post("/auth/google", AuthController.googleLogin); 

app.get("/users/me", authMiddleware, UserController.me);
app.put("/users/me/password", authMiddleware, AuthController.changePassword);
app.put("/users/me/profile", authMiddleware, AuthController.updateProfile);
// app.get("/users/me", authMiddlewareBearer, UserController.me);

app.post("/organizations", authMiddleware, OrganizationController.create);
app.get("/organizations", authMiddleware, OrganizationController.getAll);
app.get("/organizations/:organizationId", authMiddleware, OrganizationController.getById);
app.get("/organizations/:organizationId/settings", authMiddleware, OrganizationController.getSettings);
app.put("/organizations/:organizationId/settings", authMiddleware, OrganizationController.updateSettings);
app.put("/organizations/:organizationId/status", authMiddleware, OrganizationController.updateStatus);
app.get("/organizations/:organizationId/change-logs", authMiddleware, OrganizationController.getChangeLogs);
app.get("/organizations/:organizationId/user-logs/:userId", authMiddleware, OrganizationController.getUserLogs);
app.get("/organizations/:organizationId/user-logs", authMiddleware, OrganizationController.getUserLogs);

app.post("/staff", authMiddleware, StaffController.create);
app.put("/staff", authMiddleware, StaffController.edit);
app.get("/organizations/:organizationId/staffs", authMiddleware, StaffController.getStaffsByOrganization);
app.get("/organizations/:organizationId/staffs-selection", authMiddleware, StaffController.getStaffsSelection);
app.get("/organizations/:organizationId/staffs/:userId", authMiddleware, StaffController.getStaffsByOrganizationByUserId);
app.delete("/staff/:userId", authMiddleware, StaffController.delete);

app.post("/extensions", authMiddleware, ExtensionController.insert);
app.put("/extensions/:extId", authMiddleware, ExtensionController.update);
app.get("/extensions/:organizationId", authMiddleware, ExtensionController.getByOrgId);
app.get("/extensions/:organizationId/select", authMiddleware, ExtensionController.getSelectByOrgId);
app.get("/extensionsById/:extId", authMiddleware, ExtensionController.getByExtId);
app.delete("/extensions/:extId", authMiddleware, ExtensionController.delete);

// Extension Configuration Routes
app.get("/organizations/:organizationId/extension-configuration", authMiddleware, ExtensionController.getExtensionConfiguration);
app.put("/organizations/:organizationId/extension-configuration", authMiddleware, ExtensionController.updateExtensionConfiguration);

// Extension Rules Routes
app.post("/extensions-rule", authMiddleware, ExtensionRuleController.insert);
app.get("/extensions-rule/:orgId", authMiddleware, ExtensionRuleController.getAll);
app.get("/extensions-rule/:id/detail", authMiddleware, ExtensionRuleController.getById);
app.put("/extensions-rule/:id", authMiddleware, ExtensionRuleController.update);
app.delete("/extensions-rule/:id", authMiddleware, ExtensionRuleController.delete);

app.get("/qr/org/:organizationId", authMiddleware, QrOrganizationController.getByOrgId);
app.post("/qr/generate", authMiddleware, QrOrganizationController.generateQr);
app.get("/qr/url/:qrUrl", QrOrganizationController.getByQrUrl);

app.get("/qr/org/:organizationId/image", QrOrganizationController.generateQrImage);


app.post("/call", CallController.insert);
app.post("/call/participant", CallController.addParticipant);
app.post("/call/event", CallController.addEvent);
app.post("/call/feedback", CallController.createFeedback);
app.get("/organizations/:organizationId/call-feedbacks", authMiddleware, CallController.getFeedbacks);
app.get("/organizations/:organizationId/call-feedbacks/:callId", authMiddleware, CallController.getFeedbacks);
app.get("/tmp/:organizationId", TmpController.PostTmp);

// Role Management Routes
app.post("/roles", authMiddleware, RoleController.create);
app.get("/roles", authMiddleware, RoleController.getAll);
app.get("/roles/:id", authMiddleware, RoleController.getById);
app.put("/roles/:id", authMiddleware, RoleController.update);
app.delete("/roles/:id", authMiddleware, RoleController.delete);

// Super Admin Routes
app.get("/super-admin/dashboard", authMiddleware, superAdminMiddleware, SuperAdminController.getDashboard);
app.get("/super-admin/users", authMiddleware, superAdminMiddleware, SuperAdminController.getAllUsers);
app.get("/super-admin/users/:id", authMiddleware, superAdminMiddleware, SuperAdminController.getUserById);
app.put("/super-admin/users/:id/suspend", authMiddleware, superAdminMiddleware, SuperAdminController.suspendUser);
app.put("/super-admin/users/:id/activate", authMiddleware, superAdminMiddleware, SuperAdminController.activateUser);
app.put("/super-admin/organizations/:id/approve", authMiddleware, superAdminMiddleware, SuperAdminController.approveOrganization);
app.put("/super-admin/organizations/:id/reject", authMiddleware, superAdminMiddleware, SuperAdminController.rejectOrganization);
app.put("/super-admin/organizations/:id/suspend", authMiddleware, superAdminMiddleware, SuperAdminController.suspendOrganization);
app.put("/super-admin/organizations/:id/activate", authMiddleware, superAdminMiddleware, SuperAdminController.activateOrganization);

// Dashboard Routes (Owner/Staff)
app.get("/dashboard/:organizationId/incoming-calls", authMiddleware, DashboardController.getIncomingCalls);



// Sync DB
// sequelize.sync().then(() => {
//   console.log("Database synced");
// });
// console.log("skipped database sync");


export default app;