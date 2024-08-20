import mongoose from "mongoose";
const userPermission = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
    },
    groupPermissionId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GroupPermission",
            default: [],
        },
    ],
});
export default mongoose.model("UserPermission", userPermission);
