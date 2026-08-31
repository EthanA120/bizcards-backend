import { Card } from "../models/cardModel.js";
import {
  cardValidation, cardEditValidation, changeBizNumberValidation
} from "../validators/cardValidation.js";
import handleServerError from "../utils/errorHandler.js"


// 1. Get All Cards
export const getCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).send(cards);
  } catch (err) {
    handleServerError(res, err);
  }
};


// 2. Get all current user cards (The user only / Protected route)
export const getMyCards = async (req, res) => {
  try {
    const user = req.user; // Get the authenticated user from the request
    const card = await Card.find({ user_id: user._id }); // Find cards that belong to the authenticated user

    if (!card || card.length === 0) {
      return res.status(404).send("No cards have been found.");
    }

    res.status(200).send(card);
  } catch (err) {
    handleServerError(res, err);
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
    handleServerError(res, err);
  }
};


// 4. Create Card
export const createCard = async (req, res) => {
  try {
    // Joi Validation (verifies payload sent from client)
    const { error } = cardValidation.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let randomBizNumber = 0;
    let existingCard = true;
    while (existingCard) {
      console.log(`Generating random bizNumber: ${randomBizNumber}`);
      randomBizNumber = Math.floor(1000000 + Math.random() * 9000000); // 7 digits
      existingCard = await Card.findOne({ bizNumber: randomBizNumber });
    }

    const cardData = { ...req.body };
    // Handle empty image url fallback
    if (cardData.image && !cardData.image.url) {
      delete cardData.image.url;
    }

    // Attach user_id from token and initialize likes array
    const card = new Card({
      ...cardData,
      bizNumber: randomBizNumber,
      user_id: req.user._id, // Set automatically from auth middleware
      likes: []              // Starts empty
    });

    await card.save();
    res.status(201).send(card);
  } catch (err) {
    handleServerError(res, err);
  }
};


// 5. PUT Edit Card (The user only / Protected route)
export const editCard = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate using standard card validation (without bizNumber)
    const { error } = cardEditValidation.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const updateData = { ...req.body };
    delete updateData.bizNumber;
    delete updateData.user_id;

    const updatedCard = await Card.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCard) return res.status(404).send("Card not found.");

    res.status(200).send(updatedCard);
  } catch (err) {
    handleServerError(res, err);
  }
};


// 6. PATCH Change bizNumber (Admin only)
export const changeBizNumber = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = changeBizNumberValidation.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { bizNumber } = req.body;

    // Check if the new bizNumber is already in use by another card
    const existingCard = await Card.findOne({ bizNumber });
    if (existingCard) {
      return res.status(400).send("Business number already in use by another card.");
    }

    const updatedCard = await Card.findByIdAndUpdate(
      id,
      { bizNumber },
      { new: true, runValidators: true }
    );

    if (!updatedCard) {
      return res.status(404).send("Card not found.");
    }

    res.status(200).send(updatedCard);
  } catch (err) {
    handleServerError(res, err);
  }
};


// 7. PATCH Toggle Like/Unlike on a card
export const likeCard = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id; // Extracted from Auth middleware

    // Find the card by ID
    const card = await Card.findById(id);
    if (!card) {
      return res.status(404).send("Card not found.");
    }

    // Check if the user already liked this card
    const userIndex = card.likes.findIndex(
      (id) => id.toString() === userId.toString()
    );

    // If user has not liked the card yet
    if (userIndex === -1) {
      // ADD user ID to likes array
      card.likes.push(userId);
    } else {
      // REMOVE user ID from likes array
      card.likes.splice(userIndex, 1);
    }

    // Save updated card to DB
    await card.save();

    res.status(200).send(card);
  } catch (err) {
    handleServerError(res, err);
  }
};


// 8. DELETE Card (The user or Admin only / Protected route)
export const deleteCard = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCard = await Card.findByIdAndDelete(id);

    if (!deletedCard) {
      return res.status(404).send("Card not found.");
    }

    res.status(200).send(deletedCard);
  } catch (err) {
    handleServerError(res, err);
  }
};