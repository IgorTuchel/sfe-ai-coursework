import mongoose from "mongoose";
import RefreshToken from "./refreshTokenModel.js";

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

userSchema.pre("deleteOne", { query: true }, async function (next) {
  const userID = this.getQuery()["_id"];
  await RefreshToken.deleteMany({ userID: userID });
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
