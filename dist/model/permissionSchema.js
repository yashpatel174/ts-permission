import mongoose from "mongoose";
const permissionSchema = new mongoose.Schema({
    permissions: {
        type: [String],
        enum: ["Create", "FindAll", "FindOne", "Update", "Delete"],
        default: [],
    },
    moduleId: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Module", default: [] },
    ],
});
export default mongoose.model("Permission", permissionSchema);
