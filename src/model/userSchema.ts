import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";

interface Iuser extends Document {
  userName: string;
  password: string;
  role: "admin" | "user";
  group: mongoose.Types.ObjectId[];
  permission: mongoose.Types.ObjectId[];
}

const userSchema: mongoose.Schema<Iuser> = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  group: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group", default: [] }],
  permission: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GroupPermission",
      default: [],
    },
  ],
});

userSchema.pre<Iuser>("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

export default mongoose.model<Iuser>("User", userSchema);
