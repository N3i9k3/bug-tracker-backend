import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // store users as ObjectId references
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // creator
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
