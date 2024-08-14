import mongoose, { Document } from "mongoose";

interface IGroup extends Document {
  groupName: string;
  members: mongoose.Types.ObjectId[];
  permissions: mongoose.Types.ObjectId[];
}

const groupSchema: mongoose.Schema<IGroup> = new mongoose.Schema({
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

export default mongoose.model<IGroup>("Group", groupSchema);
