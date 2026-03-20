import "dotenv/config";
import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const checkAuth = async (req, res) => {
  try {
    const user = req.cookies['token']
      ? jwt.verify(req.cookies['token'], process.env.JWT_SEC)
      : null
    if (!user) throw new Error("Not authenticated");
    res.status(200).json({ success: true, user });
  }
  catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
}

export const register = async (req, res) => {

  const { name, email, password, confirm, phone, address } = req.body;
  if (!name || !email || !password || !confirm || !phone || !address) return res.status(400).json({ success: false, message: "Missing required fields." });

  try {
    let user = await User.findOne({ name }, { email });
    if (user) throw new Error("This user already exists");
    if (password !== confirm) throw new Error("Passwords don't match");

    user = new User({ name, email, password, phone, address });
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    console.log("Success!")
    res.status(200).json({ success: true, message: "User registered successfully." });
  }
  catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: "Missing required fields." });

  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid email or password.");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid email or password.");

    const jwtToken = jwt.sign({ email, role: user?.role }, process.env.JWT_SEC);

    res.cookie("token", jwtToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week lifespan
    });
    res.status(200).json({ 
      success: true, 
      message: "Login successful!", 
      user: {
        id: user?._id,
        email: user?.email,
        role: user?.role || "user"
      }});
  }
  catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export const logout = async (req, res) => {
  try {
    const hasToken = Boolean(req.cookies?.token);

    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: hasToken ? "Logged out successfully." : "Already logged out.",
    });
  }
  catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}