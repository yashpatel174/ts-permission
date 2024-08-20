import mongoose from "mongoose";
const groupPermission = new mongoose.Schema({
    groupId: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Group",
            default: [],
        },
    ],
    permissions: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Permission",
            default: [],
        },
    ],
});
export default mongoose.model("GroupPermission", groupPermission);
