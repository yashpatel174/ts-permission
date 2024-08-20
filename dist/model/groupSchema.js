import mongoose from "mongoose";
const groupSchema = new mongoose.Schema({
    groupName: { type: String, unique: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    permissions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GroupPermission",
            default: [],
        },
    ],
});
export default mongoose.model("Group", groupSchema);
