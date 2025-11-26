// database/models/index.ts
import { Extension } from "./extension.model";
import { ExtensionOperationalHour } from "./extensionOperationalHour.model";
import { ExtensionAssignedStaff } from "./extensionAssignedStaff.model";
import { UserModel } from "./user.model";
import { ExtensionRule } from "./extensionRule.model";

import { Call } from "./call.model";
import { CallParticipant } from "./callParticipant.model";
import { CallEvent } from "./callEvent.model";
import { CallStaffAvailability } from "./callStaffAvailability";
import { Organization } from "./organization.model";
import { OrganizationChangeLog } from "./organizationChangeLog.model";
import { OrganizationUserLog } from "./organizationUserLog.model";
import { CallFeedback } from "./callFeedback.model";

// ✅ Define associations here
Extension.hasMany(ExtensionOperationalHour, {
  foreignKey: "extension_id",
  as: "operational",
});

ExtensionOperationalHour.belongsTo(Extension, {
  foreignKey: "extension_id",
});

Extension.hasMany(ExtensionAssignedStaff, {
  foreignKey: "extension_id",
  as: "assignedStaff",
});

ExtensionAssignedStaff.belongsTo(Extension, {
  foreignKey: "extension_id",
});

ExtensionAssignedStaff.belongsTo(UserModel, {
  foreignKey: "user_id",
});

UserModel.hasMany(ExtensionAssignedStaff, {
  foreignKey: "user_id",
});

// An Extension can have many rules (where it's the source)
Extension.hasMany(ExtensionRule, {
  foreignKey: "extension_id",
  as: "rules",
});

// Each rule belongs to an Extension (source)
ExtensionRule.belongsTo(Extension, {
  foreignKey: "extension_id",
  as: "extension",
});

// Each rule also belongs to another Extension (destination)
ExtensionRule.belongsTo(Extension, {
  foreignKey: "extension_destination",
  as: "destination",
});

// Call <-> CallParticipant
Call.hasMany(CallParticipant, {
  foreignKey: "call_id",
  as: "participants",
});
CallParticipant.belongsTo(Call, {
  foreignKey: "call_id",
  as: "call",
});

// Call <-> CallEvent
Call.hasMany(CallEvent, {
  foreignKey: "call_id",
  as: "events",
});
CallEvent.belongsTo(Call, {
  foreignKey: "call_id",
  as: "call",
});

// CallParticipant <-> CallEvent
CallParticipant.hasMany(CallEvent, {
  foreignKey: "call_participant_id",
  as: "events",
});
CallEvent.belongsTo(CallParticipant, {
  foreignKey: "call_participant_id",
  as: "participant",
});

// User -> CallParticipant (only where ref_type = 'user')
UserModel.hasMany(CallParticipant, {
  foreignKey: "ref_id",
  as: "callParticipants",
  scope: { kind: "user" },
  constraints: false,
});

CallParticipant.belongsTo(UserModel, {
  foreignKey: "ref_id",
  as: "user",
  constraints: false,

});

// Extension -> CallParticipant (only where ref_type = 'extension')
Extension.hasMany(CallParticipant, {
  foreignKey: "ref_id",
  as: "callParticipants",
  scope: { kind: "extension" },
  constraints: false,
});

CallParticipant.belongsTo(Extension, {
  foreignKey: "ref_id",
  as: "extension",
  constraints: false,
});

UserModel.hasMany(CallStaffAvailability, {
  foreignKey: "user_id",
  as: "staffAvailability",
});

CallStaffAvailability.belongsTo(UserModel, {
  foreignKey: "user_id",
  as: "user",
});

Extension.hasMany(CallStaffAvailability, {
  foreignKey: "extension_id",
  as: "extensionAvailability",
});

CallStaffAvailability.belongsTo(Extension, {
  foreignKey: "extension_id",
  as: "extension",
});


Call.belongsTo(Extension, {
  foreignKey: "extension_id",
  as: "extension",
});

// (optional) Extension → Calls
Extension.hasMany(Call, {
  foreignKey: "extension_id",
  as: "calls",
});

// Call.belongsTo(Extension, {
//   foreignKey: "extension_id",
//   as: "extension",
// });

// Organization <-> OrganizationChangeLog
Organization.hasMany(OrganizationChangeLog, {
  foreignKey: "organization_id",
  as: "changeLogs",
});
OrganizationChangeLog.belongsTo(Organization, {
  foreignKey: "organization_id",
  as: "organization",
});

// User <-> OrganizationChangeLog
UserModel.hasMany(OrganizationChangeLog, {
  foreignKey: "user_id",
  as: "organizationChangeLogs",
});
OrganizationChangeLog.belongsTo(UserModel, {
  foreignKey: "user_id",
  as: "user",
});

// Extension <-> OrganizationUserLog
Extension.hasMany(OrganizationUserLog, {
  foreignKey: "extension_id",
  as: "userLogs",
});
OrganizationUserLog.belongsTo(Extension, {
  foreignKey: "extension_id",
  as: "extension",
});

// User <-> OrganizationUserLog (user being logged)
UserModel.hasMany(OrganizationUserLog, {
  foreignKey: "user_id",
  as: "organizationUserLogs",
});
OrganizationUserLog.belongsTo(UserModel, {
  foreignKey: "user_id",
  as: "user",
});

// User <-> OrganizationUserLog (created_by)
UserModel.hasMany(OrganizationUserLog, {
  foreignKey: "created_by",
  as: "createdOrganizationUserLogs",
});
OrganizationUserLog.belongsTo(UserModel, {
  foreignKey: "created_by",
  as: "createdByUser",
});

// Call <-> CallFeedback
Call.hasMany(CallFeedback, {
  foreignKey: "call_id",
  as: "feedbacks",
});
CallFeedback.belongsTo(Call, {
  foreignKey: "call_id",
  as: "call",
});

// User <-> CallFeedback (ref_id for USER kind)
UserModel.hasMany(CallFeedback, {
  foreignKey: "ref_id",
  as: "callFeedbacks",
  scope: { kind: "USER" },
  constraints: false,
});
CallFeedback.belongsTo(UserModel, {
  foreignKey: "ref_id",
  as: "user",
  constraints: false,
});

export {
  Extension,
  ExtensionOperationalHour,
  ExtensionAssignedStaff,
  UserModel,
  ExtensionRule,
  Call,
  CallParticipant,
  CallEvent,
  CallStaffAvailability,
  OrganizationChangeLog,
  OrganizationUserLog,
  CallFeedback
};
