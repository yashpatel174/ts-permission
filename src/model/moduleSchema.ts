import mongoose, { Document } from "mongoose";

interface Imodule extends Document {
  moduleName: string;
  moduleNumber: number;
}

const moduleSchema: mongoose.Schema<Imodule> = new mongoose.Schema({
  moduleName: { type: String, required: true },
  moduleNumber: { type: Number, required: true },
});

export default mongoose.model<Imodule>("Module", moduleSchema);
