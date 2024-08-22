import { Request, Response, NextFunction } from "express";
import moduleSchema from "../model/moduleSchema.js";
import groupSchema from "../model/groupSchema.js";
import permissionSchema from "../model/permissionSchema.js";
import groupPermission from "../model/groupPermission.js";
import userPermission from "../model/userPermission.js";

// interface ModuleParams {
//   moduleName?: string;
// }

// // Custom request interface extending Express's Request
// interface CustomRequest extends Request<ModuleParams> {
//   user?: {
//     _id: string;
//     role: string;
//     group: string;
//   };
// }

// interface Group {
//   _id: string;
//   groupName: string;
//   members: string[];
//   groupId: string; // Ensure groupId is a string
// }

// type GetModuleName = (req: CustomRequest) => string;

// const checkPermission =
//   (requiredPermissions: string[], getModuleName: GetModuleName) =>
//   async (req: CustomRequest, res: Response, next: NextFunction) => {
//     if (req.user?.role === "admin") {
//       return next();
//     }

//     const user = req.user;
//     const userGroup = user?.group;
//     const userId = user?._id;
//     const moduleName = getModuleName(req);

//     if (!moduleName &&
//       (requiredPermissions.includes("Create") ||
//         requiredPermissions.includes("FindAll"))
//     ) {
//       return next();
//     }

//     try {
//       const module = await moduleSchema.findOne({ moduleName });
//       if (!module) {
//         return res.status(403).send({
//           message: "You do not have the permission for this module.",
//         });
//       }

//       const group = (await groupSchema.findOne({ _id: userGroup })) as string;
//       console.log(group, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

//       const permission = await permissionSchema
//         .findOne({
//           permissions: { $in: requiredPermissions },
//           moduleId: module._id,
//         })
//         .populate({ path: "module", strictPopulate: false });

//       if (!permission) {
//         return res.status(403).send({
//           message: "Invalid Permission",
//         });
//       }

//       const gPermission = await groupPermission.find({
//         groupId: group,
//         permission: permission.id,
//       });

//       console.log(typeof group, "000000000000000");
//       console.log(permission.id), "11111111111111";
//       console.log(gPermission, "222222222222222222");

//       if (!gPermission) {
//         return res.status(403).send({
//           message: "Permission is not provided to this group.",
//         });
//       }

//       const uPermission = await userPermission.findOne({
//         userId: userId,
//         groupPermissionId: gPermission._id,
//       });

//       if (!uPermission) {
//         return res.status(403).send({
//           message: "Permission is not provided to this user.",
//         });
//       }

//       next();
//     } catch (error) {
//       console.error("Error while checking permissions:", error);
//       res.status(500).send({
//         success: false,
//         message: "Error while checking permissions",
//         error: (error as Error).message,
//       });
//     }
//   };

// const checkPermission =
//   (requiredPermissions: string[], getModuleName: GetModuleName) =>
//   async (req: CustomRequest, res: Response, next: NextFunction) => {
//     if (req.user?.role === "admin") {
//       return next();
//     }

//     const user = req.user;
//     const userGroup = user?.group;
//     const userId = user?._id;
//     const moduleName = getModuleName(req);

//     if (
//       !moduleName &&
//       (requiredPermissions.includes("Create") ||
//         requiredPermissions.includes("FindAll"))
//     ) {
//       return next();
//     }

//     try {
//       const module = await moduleSchema.findOne({ moduleName });
//       if (!module) {
//         return res.status(403).send({
//           message: "You do not have the permission for this module.",
//         });
//       }

//       const group = await groupSchema.findOne({ _id: userGroup });
//       if (!group) {
//         return res.status(403).send({
//           message: "Group not found.",
//         });
//       }

//       const permission = await permissionSchema
//         .findOne({
//           permissions: { $in: requiredPermissions },
//           moduleId: module._id,
//         })
//         .populate({ path: "module", strictPopulate: false });

//       if (!permission) {
//         return res.status(403).send({
//           message: "Invalid Permission",
//         });
//       }

//       // Ensure groupId is treated as a string
//       const gPermission = await groupPermission.findOne({
//         groupId: group.id.toString(), // Convert ObjectId to string if necessary
//         permission: permission.id,
//       });

//       console.log(group.id, "000000000000000");
//       console.log(permission.id), "11111111111111";
//       console.log(gPermission, "222222222222222222");

//       if (!gPermission) {
//         return res.status(403).send({
//           message: "Permission is not provided to this group.",
//         });
//       }

//       const uPermission = await userPermission.findOne({
//         userId: userId,
//         groupPermissionId: gPermission._id,
//       });

//       if (!uPermission) {
//         return res.status(403).send({
//           message: "Permission is not provided to this user.",
//         });
//       }

//       next();
//     } catch (error) {
//       console.error("Error while checking permissions:", error);
//       res.status(500).send({
//         success: false,
//         message: "Error while checking permissions",
//         error: (error as Error).message,
//       });
//     }
//   };

// **************************************************************************************************************

interface ModuleParams {
  moduleName?: string;
}

interface User {
  _id: string;
  role: string;
  group: string;
}

interface CustomRequest extends Request<ModuleParams> {
  user?: User; // Optional in case no user is authenticated
}

interface Module {
  _id: string;
  moduleName: string;
  // other fields related to the module
}

interface Group {
  _id: string; // This is the group identifier, typically stored as an ObjectId
  groupName: string;
  members: string[];
}

interface Permission extends Document {
  _id: string;
  permissions: string[];
  moduleId: string;
  // other permission-related fields
}

interface GroupPermission {
  _id: string;
  groupId: string;
  permission: string;
}

interface UserPermission {
  _id: string;
  userId: string;
  groupPermissionId: string;
}

type GetModuleName = (req: CustomRequest) => string;

const checkPermission =
  (requiredPermissions: string[], getModuleName: GetModuleName) =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.user?.role === "admin") {
      return next();
    }

    const user = req.user;
    const userGroup = user?.group;
    const userId = user?._id;
    const moduleName = getModuleName(req);

    if (
      !moduleName &&
      (requiredPermissions.includes("Create") ||
        requiredPermissions.includes("FindAll"))
    ) {
      return next();
    }

    try {
      const module: Module | null = await moduleSchema.findOne({ moduleName });
      if (!module) {
        return res.status(403).send({
          message: "You do not have the permission for this module.",
        });
      }

      const group: Group | null = await groupSchema.findOne({ _id: userGroup });
      if (!group) {
        return res.status(403).send({
          message: "Group not found.",
        });
      }

      const permission = (await permissionSchema
        .findOne({
          permissions: { $in: requiredPermissions },
          moduleId: module._id,
        })
        .populate({
          path: "module",
          strictPopulate: false,
        })) as Permission | null;

      if (!permission) {
        return res.status(403).send({
          message: "Invalid Permission",
        });
      }

      const gPermission: GroupPermission | null = await groupPermission.findOne(
        {
          groupId: group._id.toString(),
          permission: permission._id,
        }
      );

      console.log(typeof group._id, "00000000000000");
      console.log(permission._id, "1111111111111");

      if (!gPermission) {
        return res.status(403).send({
          message: "Permission is not provided to this group.",
        });
      }

      const uPermission: UserPermission | null = await userPermission.findOne({
        userId: userId,
        groupPermissionId: gPermission._id,
      });

      if (!uPermission) {
        return res.status(403).send({
          message: "Permission is not provided to this user.",
        });
      }

      next();
    } catch (error) {
      console.error("Error while checking permissions:", error);
      res.status(500).send({
        success: false,
        message: "Error while checking permissions",
        error: (error as Error).message,
      });
    }
  };

export default checkPermission;
