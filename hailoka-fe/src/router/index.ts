// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";

// ✅ IMPORT PINIA STORE AUTH
import { useAuthStore } from "../stores/auth";

// Owner/Staff
import Home from "../views/Home.vue";
import Registration from "../views/admin/Registration.vue";
import SignIn from "../views/admin/SignIn.vue";
import ForgotPasswordForm from "../views/admin/ForgotPasswordForm.vue";
import ResetPassword from "../views/admin/ResetPassword.vue";
import ListOrganizationUser from "../views/user/organization/List.vue";
import FormSubmitOrganization from "../views/user/organization/Form.vue";
import ListStaffs from "../views/user/staffs/List.vue";
import FormAddStaff from "../views/user/staffs/Form.vue";
import FormEditStaff from "../views/user/staffs/Edit.vue";
import ListExtension from "../views/user/extension/List.vue";
import FormAddExtension from "../views/user/extension/FormAdd.vue";
import FormEditExtension from "../views/user/extension/Edit.vue";
import ListRulesExtension from "../views/user/rules/List.vue";
import AddRulesExtension from "../views/user/rules/Form.vue";
import EditRulesExtension from "../views/user/rules/Edit.vue";
import DashboardUser from "../views/user/home/Dashboard.vue";

// Guest
import SignInGuest from "../views/guest/SignIn.vue";
import GuestForm from "../views/guest/GuestForm.vue";
import ScanBarcode from "../views/guest/ScanBarcode.vue";
import GuestGate from "../views/guest/GuestGate.vue";
import GuestHome from "../views/guest/GuestHome.vue";
import CallExtension from "../views/guest/CallExtension.vue";
import CallQueue from "../views/guest/CallQueue.vue";

// Super Admin
import SuperAdminSignIn from "../views/super-admin/SignIn.vue";
import SuperAdminRegistration from "../views/super-admin/Registration.vue";

import DetailOrganization from "../views/admin/organization/DetailOrganization.vue";
import User from "../views/admin/user/User.vue";
import HomeDashboard from "../views/admin/HomeDashboard.vue";
import DetailUser from "../views/admin/user/DetailUser.vue";
import Organizations from "../views/admin/organization/Organizations.vue";
import Setting from "../views/user/setting/Setting.vue";
import OrganizationDetail from "../views/user/setting/OrganizationDetail.vue";
import UpdateProfile from "../views/user/UpdateProfile.vue";
import ExtentionConfiguration from "../views/user/setting/ExtentionConfiguration.vue";
import RoleManagement from "../views/user/roles/List.vue";
import FormAddRole from "../views/user/roles/Form.vue";
import FormEditRole from "../views/user/roles/Edit.vue";
import Report from "../views/user/report/Report.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
    },

    // Guest routes (tanpa auth)
    {
        path: "/guest/signin",
        name: "GuestForm",
        component: GuestForm,
    },
    {
        path: "/guest/gate",
        name: "GuestGate",
        component: GuestGate,
    },
    {
        path: "/guest/scan",
        name: "ScanBarcode",
        component: ScanBarcode,
    },
    {
        path: "/guest/home",
        name: "GuestHome",
        component: GuestHome,
    },
    {
        path: "/guest/call",
        name: "CallExtension",
        component: CallExtension,
    },
    {
        path: "/guest/call/queue",
        name: "CallQueue",
        component: CallQueue,
    },

    // Auth admin/superadmin pages (login/registration) -> tidak butuh auth
    {
        path: "/signin",
        name: "SignInGuest",
        component: SignInGuest,
    },
    {
        path: "/admin/registration",
        name: "Registration",
        component: Registration,
    },
    {
        path: "/admin/signin",
        name: "SignIn",
        component: SignIn,
    },
    {
        path: "/admin/forgot-password",
        name: "ForgotPasswordForm",
        component: ForgotPasswordForm,
    },
    {
        path: "/reset-password",
        name: "ResetPassword",
        component: ResetPassword,
    },
    {
        path: "/super-admin/signin",
        name: "SuperAdminSignIn",
        component: SuperAdminSignIn,
    },
    {
        path: "/super-admin/registration",
        name: "SuperAdminRegistration",
        component: SuperAdminRegistration,
    },

    // Protected Admin / Owner / Staff routes
    {
        path: "/admin/",
        name: "HomeDashboard",
        component: HomeDashboard,
        meta: { requiresAuth: true },
    },
    {
        path: "/admin/organizations/detail/:id",
        name: "DetailOrganization",
        component: DetailOrganization,
        meta: { requiresAuth: true },
    },
    {
        path: "/admin/organizations/:id",
        name: "DetailOrganizationInStatus",
        component: DetailOrganization,
        meta: { requiresAuth: true },
    },
    {
        path: "/admin/user",
        name: "User",
        component: User,
        meta: { requiresAuth: true },
    },
    {
        path: "/admin/user/:id",
        name: "DetailUser",
        component: DetailUser,
        meta: { requiresAuth: true },
    },
    {
        path: "/admin/organizations",
        name: "Organizations",
        component: Organizations,
        meta: { requiresAuth: true },
    },

    {
        path: "/user-organizations",
        name: "ListOrganizationUser",
        component: ListOrganizationUser,
        meta: { requiresAuth: true },
    },
    {
        path: "/user-organizations/create",
        name: "FormSubmitOrganization",
        component: FormSubmitOrganization,
        meta: { requiresAuth: true },
    },
    {
        path: "/admin/:organizationId",
        name: "DashboardUser",
        component: DashboardUser,
        meta: { requiresAuth: true },
    },
    {
        path: "/admin/:organizationId/staffs",
        name: "ListStaffs",
        component: ListStaffs,
        meta: { requiresAuth: true },
    },
    {
        path: "/admin/:organizationId/staffs/add",
        name: "FormAddStaff",
        component: FormAddStaff,
        meta: { requiresAuth: true },
    },
    {
        path: "/admin/:organizationId/staffs/:userId/edit",
        name: "FormEditStaff",
        component: FormEditStaff,
        meta: { requiresAuth: true },
    },
    {
        path: "/admin/:organizationId/extenstions",
        name: "ListExtension",
        component: ListExtension,
        meta: { requiresAuth: true },
    },
    {
        path: "/admin/:organizationId/extenstions/add",
        name: "FormAddExtension",
        component: FormAddExtension,
        meta: { requiresAuth: true },
    },
    {
        path: "/admin/:organizationId/extenstions/edit/:extId",
        name: "FormEditExtension",
        component: FormEditExtension,
        meta: { requiresAuth: true },
    },
    {
        path: "/admin/:organizationId/rules",
        name: "ListRulesExtension",
        component: ListRulesExtension,
        meta: { requiresAuth: true },
    },
    {
        path: "/admin/:organizationId/rules/add",
        name: "AddRulesExtension",
        component: AddRulesExtension,
        meta: { requiresAuth: true },
    },
    {
        path: "/admin/:organizationId/rules/edit/:extRuleId",
        name: "EditRulesExtension",
        component: EditRulesExtension,
        meta: { requiresAuth: true },
    },
    {
        path: "/admin/:organizationId/settings",
        name: "SettingsOrganization",
        component: Setting,
        meta: { requiresAuth: true },
    },
    {
        path: "/admin/:organizationId/settings/detail",
        name: "SettingsOrganizationDetail",
        component: OrganizationDetail,
        meta: { requiresAuth: true },
    },
    {
        path: "/admin/:organizationId/update-profile",
        name: "updateProfile",
        component: UpdateProfile,
        meta: { requiresAuth: true },
    },
    {
        path: "/admin/:organizationId/settings/extension-configuration",
        name: "SettingsExtensionConfiguration",
        component: ExtentionConfiguration,
        meta: { requiresAuth: true },
    },
    {
        path: "/admin/:organizationId/settings/role-management",
        name: "RoleManagement",
        component: RoleManagement,
        meta: { requiresAuth: true },
    },
    {
        path: "/admin/:organizationId/settings/role-management/add",
        name: "FormAddRole",
        component: FormAddRole,
        meta: { requiresAuth: true },
    },
    {
        path: "/admin/:organizationId/settings/role-management/:roleId/edit",
        name: "FormEditRole",
        component: FormEditRole,
        meta: { requiresAuth: true },
    },
    {
        path: "/admin/:organizationId/reports",
        name: "Report",
        component: Report,
        meta: { requiresAuth: true },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, _from, next) => {
    const authStore = useAuthStore();

    // 1️⃣ Pastikan sudah cek user sekali
    if (!authStore.initialized) {
        try {
            await authStore.fetchMe();
        } catch (e) {
            console.error("Failed to fetch current user:", e);
        }
    }

    const user = authStore.user;

    // 2️⃣ Kalau route butuh login dan user belum login -> redirect ke SignIn
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return next({ name: "SignIn" });
    }

    // 3️⃣ Kalau user SUDAH login dan mau ke halaman auth lagi,
    //    arahkan ke dashboard sesuai role
    const authPages = [
        "SignIn",
        "Registration",
        "SuperAdminSignIn",
        "SuperAdminRegistration",
        "SignInGuest",
    ];

    console.log("user?.user_type >>>> ", user?.user_type);

    if (authStore.isAuthenticated && authPages.includes(String(to.name))) {
        if (user?.user_type === "user") {
            // user biasa → ke ListOrganizationUser
            return next({ name: "ListOrganizationUser" });
        }

        // selain "user" anggap admin/superadmin → ke HomeDashboard
        return next({ name: "HomeDashboard" });
    }

    // 4️⃣ Kalau tidak ada kondisi khusus lain, lanjutkan
    return next();
});

export default router;