import mongoose, { Document } from "mongoose";

interface IGroupPermission extends Document {
  groupId: mongoose.Types.ObjectId[];
  permissions: mongoose.Types.ObjectId[];
}

const groupPermission: mongoose.Schema<IGroupPermission> = new mongoose.Schema({
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

export default mongoose.model<IGroupPermission>(
  "GroupPermission",
  groupPermission
);
