import { verifyToken } from "../services/tokenService.js";

/**
 * Middleware to check if the user is authenticated
 */
export function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  const decodedPayload = verifyToken(token);
  if (!decodedPayload) return res.status(400).send("Invalid token.");

  // Attach payload to request object
  req.user = decodedPayload;
  next();
}

/**
 * Middleware to check if the user has Admin privileges
 */
export const isAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).send("Access denied. Admin privileges required.");
  }

  next();
};

/**
 * Middleware to check if the user is the owner
 */
export const isOwner = (req, res, next) => {
  if (req.user?._id?.toString() !== req.params.id) {
    return res.status(403).send("Access denied. This action is only available to its owner.");
  }

  next();
};

/**
 * Middleware to check if the user is the owner
 */
export const isBusiness = (req, res, next) => {
  if (!req.user?.isBusiness) {
    return res.status(403).send("Access denied. Business account or Admin required.");
  }

  next();
};

/**
 * Middleware to check if the user is an Admin OR the Owner of the resource
 */
export const isOwnerOrAdmin = (req, res, next) => {
  const isAdmin = req.user?.isAdmin;
  const isOwner = req.user?._id?.toString() === req.params.id;

  if (!isAdmin && !isOwner) {
    return res.status(403).send("Access denied. Admin or owner privileges required.");
  }

  next();
};

/**
 * Middleware to check if the user is a Business account or Admin
 */
export const isBusinessOrAdmin = (req, res, next) => {
  if (!req.user?.isBusiness && !req.user?.isAdmin) {
    return res.status(403).send("Access denied. Business account or Admin required.");
  }

  next();
};