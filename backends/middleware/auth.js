import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.json({ success: false, message: "Not Authorized. Login again" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.body.userId = decoded.id;
    next();
  } catch (e) {
    console.log("Auth error:", e);
    res.json({ success: false, message: "Invalid token" });
  }
};

export default authMiddleware;




