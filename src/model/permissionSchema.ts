import mongoose, { Document } from "mongoose";

interface IPermission extends Document {
  permissions: [string];
  moduleId: mongoose.Types.ObjectId[];
}

const permissionSchema: mongoose.Schema<IPermission> = new mongoose.Schema({
  permissions: {
    type: [String],
    enum: ["Create", "FindAll", "FindOne", "Update", "Delete"],
    default: [],
  },
  moduleId: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Module", default: [] },
  ],
});

export default mongoose.model<IPermission>("Permission", permissionSchema);
