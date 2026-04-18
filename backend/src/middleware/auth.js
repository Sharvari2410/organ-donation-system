const ALLOWED_ROLES = ["Admin", "Donor", "Recipient"];

function requireRole(roles = []) {
  return (req, res, next) => {
    const role = String(req.header("x-user-role") || "").trim();

    if (!role || !ALLOWED_ROLES.includes(role)) {
      return res.status(401).json({ message: "Unauthorized: missing valid role header" });
    }

    if (roles.length > 0 && !roles.includes(role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }

    req.userRole = role;
    req.userName = String(req.header("x-user-name") || "Unknown").trim();
    return next();
  };
}

module.exports = { requireRole };
