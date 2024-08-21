import moduleSchema from "../model/moduleSchema.js";
import permissionSchema from "../model/permissionSchema.js";
import groupPermission from "../model/groupPermission.js";
import userPermission from "../model/userPermission.js";
const checkPermission = (requiredPermission, getModuleName) => async (req, res, next) => {
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
            console.log("No groupPermission found for the given groupId and permission._id");
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
