import { verifyToken } from "../services/tokenService.js";
import { Card } from "../models/cardModel.js";
import handleServerError from "../utils/errorHandler.js"


/**
 * Checks the identity of the user against the requested resource
 * @param {Object} user - The user object from the request
 * @param {Object} params - The request parameters
 * @returns {Object} - An object containing boolean values for isCardOwner, isOwnUser, and isAdmin
 */
const checkIdentity = async (req, res, err) => {
  try {
    const UserId = req.user?._id?.toString();
    const resourceId = req.params.id;

    // Check if it's a Card and the User is the owner of it
    const cardUserId = await Card.findById(resourceId).select("user_id").lean();
    const cardOwnerId = cardUserId ? cardUserId.user_id.toString() : null;

    const isCardOwner = UserId === cardOwnerId;
    const isOwnUser = UserId === resourceId;
    const isAdmin = req.user.isAdmin;

    return { isCardOwner, isOwnUser, isAdmin }
  } catch (error) {
    handleServerError(res, err);
  }
}

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
export const isBusiness = (req, res, next) => {
  if (!req.user?.isBusiness) {
    return res.status(403).send("Access denied. Business account or Admin required.");
  }

  next();
};


/**
 * Middleware to check if the user is the owner
 */
export const isOwner = async (req, res, next) => {
  const { isOwnUser, isCardOwner, isAdmin } = await checkIdentity(req.user, req.params);

  // Check if the user is the Owner of the resource (own or a card)
  if (isOwnUser || isCardOwner) {
    next();
  } else {
    return res.status(403).send("Access denied. This action is only available to its owner.");
  }
};


/**
 * Middleware to check if the user is an Admin OR the Owner of the resource
 */
export const isOwnerOrAdmin = async (req, res, next) => {
  const { isOwnUser, isCardOwner, isAdmin } = await checkIdentity(req.user, req.params);

  // Check if the user is the Owner of the resource or Admin
  if (isOwnUser || isCardOwner || isAdmin) {
    next();
  } else {
    return res.status(403).send("Access denied. This action is only available to its owner.");
  }
};