import moduleSchema from "../model/moduleSchema.js";
import groupSchema from "../model/groupSchema.js";
import permissionSchema from "../model/permissionSchema.js";
import groupPermission from "../model/groupPermission.js";
import userPermission from "../model/userPermission.js";
const checkPermission = (requiredPermissions, getModuleName) => async (req, res, next) => {
    if (req.user?.role === "admin") {
        return next();
    }
    const user = req.user;
    const userGroup = user?.group;
    const userId = user?._id;
    const moduleName = getModuleName(req);
    if (!moduleName &&
        (requiredPermissions.includes("Create") ||
            requiredPermissions.includes("FindAll"))) {
        return next();
    }
    try {
        const module = await moduleSchema.findOne({ moduleName });
        if (!module) {
            return res.status(403).send({
                message: "You do not have the permission for this module.",
            });
        }
        const group = await groupSchema.findOne({ _id: userGroup });
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
        }));
        if (!permission) {
            return res.status(403).send({
                message: "Invalid Permission",
            });
        }
        const gPermission = await groupPermission.findOne({
            groupId: group._id.toString(),
            permission: permission._id,
        });
        console.log(typeof group._id, "00000000000000");
        console.log(permission._id, "1111111111111");
        if (!gPermission) {
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
    }
    catch (error) {
        console.error("Error while checking permissions:", error);
        res.status(500).send({
            success: false,
            message: "Error while checking permissions",
            error: error.message,
        });
    }
};
export default checkPermission;
