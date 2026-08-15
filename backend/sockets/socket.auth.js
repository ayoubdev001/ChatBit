import jwt from "jsonwebtoken";

export function socketAuth(socket, next) {
  try {
    const raw = socket.handshake.auth?.token;

    if (!raw) {
      return next(new Error("AUTH_MISSING: no token provided"));
    }

    // Accept both "Bearer <token>" and plain "<token>"
    const token = raw.startsWith("Bearer ") ? raw.slice(7) : raw;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach to socket — handlers trust this, never the client
    socket.user = { userId: decoded.userId, role: decoded.role };

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new Error("AUTH_EXPIRED: token has expired"));
    }
    return next(new Error("AUTH_INVALID: token is invalid"));
  }
}