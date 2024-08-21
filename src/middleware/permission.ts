import { Request, Response, NextFunction, RequestHandler } from "express";
import moduleSchema from "../model/moduleSchema.js";
import permissionSchema from "../model/permissionSchema.js";
import groupPermission from "../model/groupPermission.js";
import groupSchema from "../model/groupSchema.js";
import userPermission from "../model/userPermission.js";

// interface UserPermission extends Request {
//   user: {
//     _id: string;
//     role: string;
//     group: string;
//   };
// }

// interface Permission {
//   requiredPermission: string[];
//   getModuleName: (req: Request) => string;
// }

// const checkPermission =
//   (requiredPermission: string[], getModuleName: (req: Request) => string) =>
//   async (
//     req: UserPermission,
//     res: Response,
//     next: NextFunction
//   ): Promise<Response | void> => {
//     if (req.user?.role === "admin") {
//       return next();
//     }

//     if (!req.user) {
//       return res.status(401).send({ message: "User not authenticated" });
//     }

//     const user = req.user;
//     const userGroup = user.group;
//     const userId = user._id;
//     const moduleName = getModuleName(req);

//     try {
//       const module = await moduleSchema.findOne({ moduleName });
//       if (!module) return res.send({ message: "Mot not found to verify." });

//       const permission = await permissionSchema
//         .findOne({
//           permissions: { $in: requiredPermission },
//           moduleId: module._id,
//         })
//         .populate({ path: "module", strictPopulate: false });
//       if (!permission)
//         return res.send({
//           message: "This permission is not provided to this module.",
//         });

//       let prmsn = [];

//       const gPermission = await groupSchema.findOne({
//         groupId: userGroup,
//         permissions: permission._id,
//       });
//       console.log(gPermission, "000000000000000");
//       if (!gPermission)
//         return res.send({
//           message: "Permission is not provided to this group",
//         });

//       const uPermission = await userPermission.findOne({
//         userId,
//         groupPermissionId: gPermission._id,
//       });
//       if (!uPermission)
//         return res.send({
//           message: "Permission is not provided to this user.",
//         });

//       prmsn.push(gPermission);

//       if (prmsn.length < 1) {
//         return res.send({
//           message:
//             "Permission does not match or the member does not belong to this group",
//         });
//       }

//       next();
//     } catch (error) {
//       return res.status(500).send({
//         success: false,
//         message: "Error while checking permission",
//         error: (error as Error).message,
//       });
//     }
//   };

interface CustomRequest extends Request {
  user?: {
    _id: string;
    role: string;
    group: string;
  };
}

type GetModuleName = (req: Request) => string;

const checkPermission =
  (requiredPermission: string, getModuleName: GetModuleName) =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.user?.role === "admin") {
      return next();
    }

    const user = req.user;
    const userGroup = user?.group;
    const userId = user?._id;
    const moduleName = getModuleName(req);

    try {
      const module = await moduleSchema.findOne({ moduleName });
      if (!module) {
        return res.status(403).send({
          message: "You do not have the permission for this module.",
        });
      }

      const permission = await permissionSchema
        .findOne({
          permissions: { $in: [requiredPermission] },
          moduleId: module._id,
        })
        .populate({ path: "module", strictPopulate: false });

      if (!permission) {
        return res.status(403).send({
          message: "This permission is not provided to this module.",
        });
      }

      // Debugging: Log the values being used in the query
      console.log("User Group:", userGroup);
      console.log("Permission ID:", permission._id);

      const gPermission = await groupPermission.findOne({
        groupId: userGroup,
        permission: permission._id,
      });

      console.log(gPermission, "000000000000");

      // Debugging: Check if gPermission is null and log details
      if (!gPermission) {
        console.log(
          "No groupPermission found for the given groupId and permission._id"
        );
        return res.status(403).send({
          message: "Permission is not provided to this group.",
        });
      }

      const uPermission = await userPermission.findOne({
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
