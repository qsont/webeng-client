import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

  name: {type: String},
  email: {type: String, unique: true},
  password: {type: String},
  phone: {type: String},
  address: {type: String},

  role: { type: String, enum: ["user", "admin"], default: "user" }
});

const User = mongoose.model("User", UserSchema);
export default User;