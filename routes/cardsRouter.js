import express from "express";
import {
  getCards, getMyCards, getCard, createCard, editCard, likeCard, deleteCard
} from "../controllers/cardController.js";
import { auth, isOwner, isAdmin, isOwnerOrAdmin, isBusiness } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 1. GET /cards
router.get("/", getCards);

// 2. GET /cards/my-cards Restricted to Owner
router.get("/my-cards", isOwner, getMyCards);

// 3. GET /cards/:id
router.get("/:id", getCard);

// 4. POST /cards Restricted to any Business User
router.post("/", auth, isBusiness, createCard);

// 5. PUT /cards/:id Restricted to Owner
router.put("/:id", auth, isOwner, editCard);

// 6. Patch /cards/:id Restricted to any Registered User
router.patch("/:id", auth, likeCard);

// 6. DELETE /cards/:id Restricted to Admin or Owner
router.delete("/:id", auth, isOwnerOrAdmin, deleteCard);


export default router;