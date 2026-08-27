import { Card } from "../models/cardModel.js";
import {
  registerValidation, loginValidation, editCardValidation, IsBusinessValidation
} from "../validators/cardValidation.js";
import { getJoiErrorMessage } from "../services/joiService.js";
import { generateHash, compareHash } from "../services/bcryptService.js";
import { generateAuthToken } from "../services/tokenService.js";

// 1. Get All Cards
export const getCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).send(cards);
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
};

// 2. Get all current user cards (The user only / Protected route)
export const getMyCards = async (req, res) => {
  try {
    const { id } = req.params;
    const card = await Card.find();
    
    if (!card) {
      return res.status(404).send("No cards have been found.");
    }

    res.status(200).send(user);
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
};

// 3. Get Card By ID
export const getCard = async (req, res) => {
  try {
    const { id } = req.params;
    const card = await Card.findById(id);
    
    if (!card) {
      return res.status(404).send("No cards have been found.");
    }

    res.status(200).send(card);
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
};



// 4. Create Card
export const createCard = async (req, res) => {
  try {
    // 1. Joi Validation (verifies payload sent from client)
    const { error } = cardValidation.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // 2. Attach user_id from token and initialize likes array
    const card = new Card({
      ...req.body,
      user_id: req.user._id, // Set automatically from auth middleware
      likes: []              // Starts empty
    });

    await card.save();
    res.status(201).send(card);
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
};

// editCard, likeCard, deleteCard

// 5. PUT Edit User (The user only / Protected route)
export const editCard = async (req, res) => {
  try {
    const { id } = req.params;

    const error = getJoiErrorMessage(editCardValidation.validate(req.body));
    if (error) return res.status(400).send(error);

    const updateData = { ...req.body };

    const updatedCard = await Card.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCard) {
      return res.status(404).send("Card not found.");
    }

    res.status(200).send(updatedCard);
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
};

// 6. Patch Edit isBusiness (The user only / Protected route)
export const editIsBusiness = async (req, res) => {
  try {
    const { id } = req.params;

    const error = getJoiErrorMessage(IsBusinessValidation.validate(req.body));
    if (error) return res.status(400).send(error);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isBusiness: req.body.isBusiness },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).send("User not found.");
    }

    res.status(200).send(updatedUser);
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
};

// 7. DELETE User (The user or Admin only / Protected route)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return res.status(404).send("User not found.");
    }
    
    const userResponse = deletedUser.toObject();
    delete userResponse.password;

    res.status(200).send(userResponse);
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
};