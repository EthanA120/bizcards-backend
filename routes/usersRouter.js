import express from "express";
import {
  registerUser, loginUser, getUsers, getUser, editUser, editIsBusiness, deleteUser
} from "../controllers/userController.js";
import { auth, isOwner, isAdmin, isOwnerOrAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 1. POST /users
router.post("/", registerUser);

// 2. POST /users/login
router.post("/login", loginUser);

// 3. GET /users Restricted to Admin
router.get("/", auth, isAdmin, getUsers);

// 4. GET /users/:id Restricted to Admin or Owner
router.get("/:id", auth, isOwnerOrAdmin, getUser);

// 5. PUT /users/:id Restricted to Owner
router.put("/:id", auth, isOwner, editUser);

// 6. PATCH /users/:id Restricted to Owner
router.patch("/:id", auth, isOwner, editIsBusiness);

// 6. DELETE /users/:id Restricted to Admin or Owner
router.delete("/:id", auth, isOwnerOrAdmin, deleteUser);


export default router;