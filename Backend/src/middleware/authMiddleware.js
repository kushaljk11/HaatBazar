import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// yo middleware le request ko header bata token lai verify garxa ra user ko information lai request object ma attach garxa, jasle garda protected routes ma access control implement garna sakinchha.
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized, Please Login or Register" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (err) {
    return res
      .status(401)
      .json({ error: err.message, message: "Invalid token or expired" });
  }
};

// admin lai matra dine
export const adminonly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required. Please Login or include a valid Bearer token.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Forbidden: Admin access required for this endpoint.",
    });
  }

  next();
};

// admin lai kita afulai matra access dina milxa vaney
export const adminOrSelf = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required. Please Login or include a valid Bearer token.",
    });
  }

  const userId = req.params.userId || req.params.id;
  if (req.user.role !== "admin" && req.user.id !== userId) {
    return res.status(403).json({
      message: "Forbidden: Only admins or the owner of this resource can access it.",
    });
  }

  next();
};
