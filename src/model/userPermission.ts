import mongoose, { Document } from "mongoose";

interface IUserPermission extends Document {
  userId: mongoose.Types.ObjectId;
  groupPermissionId: mongoose.Types.ObjectId[];
}

const userPermission: mongoose.Schema<IUserPermission> = new mongoose.Schema({
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
