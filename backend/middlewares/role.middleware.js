// Must run AFTER authMiddleware, since it relies on req.user being set
export function requireRole(role) {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ error: `Only ${role}s can perform this action` });
    }
    next();
  };
}