import jwt from "jsonwebtoken";

// Protects routes by verifying the JWT sent in the Authorization header
export function authMiddleware(req, res, next) {

    // Protects routes by verifying the JWT sent in the Authorization header
    const authHeader = req.headers.authorization;


  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // after decoding get me the infos
    req.user = decoded;

    next(); 
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired, please log in again" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
}