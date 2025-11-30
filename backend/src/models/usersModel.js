import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: false },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    mfaEnabled: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
