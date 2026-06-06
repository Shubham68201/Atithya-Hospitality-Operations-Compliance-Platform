export const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, message: "Not authenticated." });
  if (!roles.includes(req.user.role))
    return res.status(403).json({ success: false, message: `Role '${req.user.role}' is not authorized.` });
  next();
};

export const isAdmin      = authorize("super_admin","admin");
export const isSuperAdmin = authorize("super_admin");
export const isOperations = authorize("super_admin","admin","operations_manager");
export const isCompliance = authorize("super_admin","admin","compliance_manager");
