import { ApiError } from "../utils/ApiError.js";

const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Admin access required");
  }
  next();
};

const verifyRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new ApiError(403, "Access denied");
  }
  next();
};

export { verifyAdmin, verifyRoles };
