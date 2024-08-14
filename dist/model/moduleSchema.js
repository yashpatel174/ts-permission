import mongoose from "mongoose";
const moduleSchema = new mongoose.Schema({
    moduleName: { type: String, required: true },
    moduleNumber: { type: Number, required: true },
});
export default mongoose.model("Module", moduleSchema);
