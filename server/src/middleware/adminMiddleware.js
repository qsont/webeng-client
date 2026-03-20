import jwt from "jsonwebtoken";

export const requireAdmin = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SEC);
    if (decoded?.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access only." });
    }

    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};
