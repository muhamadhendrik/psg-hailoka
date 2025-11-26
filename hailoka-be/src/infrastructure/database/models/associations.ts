// import { Extension } from "./extension.model";
// import { ExtensionOperationalHour } from "./extensionOperationalHour.model";
// import { ExtensionAssignedStaff } from "./extensionAssignedStaff.model";
// import { UserModel } from "./user.model";

// const models = {
//   Extension,
//   ExtensionOperationalHour,
//   ExtensionAssignedStaff,
//   UserModel,
// };

// // invoke per-model associate if provided
// [Extension, ExtensionOperationalHour, ExtensionAssignedStaff, UserModel].forEach(
//   (m: any) => {
//     if (typeof m.associate === "function") {
//       m.associate(models);
//     }
//   }
// );

// /**
//  * Extension <-> ExtensionOperationalHour
//  * - Extension hasMany OperationalHour (foreignKey: extension_id)
//  * - OperationalHour belongsTo Extension
//  */
// Extension.hasMany(ExtensionOperationalHour, {
//   foreignKey: "extension_id",
//   as: "operational_hours",
// });
// ExtensionOperationalHour.belongsTo(Extension, {
//   foreignKey: "extension_id",
//   as: "extension",
// });

// /**
//  * Extension <-> ExtensionAssignedStaff (1:N)
//  * - Extension hasMany ExtensionAssignedStaff
//  * - ExtensionAssignedStaff belongsTo Extension
//  */
// Extension.hasMany(ExtensionAssignedStaff, {
//   foreignKey: "extension_id",
//   as: "assigned_staff",
// });
// ExtensionAssignedStaff.belongsTo(Extension, {
//   foreignKey: "extension_id",
//   as: "extension",
// });

// /**
//  * UserModel <-> ExtensionAssignedStaff (1:N)
//  * - UserModel hasMany ExtensionAssignedStaff
//  * - ExtensionAssignedStaff belongsTo UserModel
//  */
// UserModel.hasMany(ExtensionAssignedStaff, {
//   foreignKey: "user_id",
//   as: "extension_assignments",
// });
// ExtensionAssignedStaff.belongsTo(UserModel, {
//   foreignKey: "user_id",
//   as: "user",
// });

// /**
//  * Optional convenience many-to-many
//  * - Extension belongsToMany UserModel through ExtensionAssignedStaff (as 'staff')
//  * - UserModel belongsToMany Extension through ExtensionAssignedStaff (as 'extensions')
//  */
// Extension.belongsToMany(UserModel, {
//   through: ExtensionAssignedStaff,
//   foreignKey: "extension_id",
//   otherKey: "user_id",
//   as: "staff",
// });
// UserModel.belongsToMany(Extension, {
//   through: ExtensionAssignedStaff,
//   foreignKey: "user_id",
//   otherKey: "extension_id",
//   as: "extensions",
// });