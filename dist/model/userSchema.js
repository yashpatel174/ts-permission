import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
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
userSchema.pre("save", async function (next) {
    if (this.isModified("password") || this.isNew) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});
export default mongoose.model("User", userSchema);
