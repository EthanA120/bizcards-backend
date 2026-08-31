import { User } from "../models/userModel.js";
import {
  registerValidation, loginValidation, userEditValidation, IsBusinessValidation
} from "../validators/userValidation.js";
import { getJoiErrorMessage } from "../services/joiService.js";
import { generateHash, compareHash } from "../services/bcryptService.js";
import { generateAuthToken } from "../services/tokenService.js";

// 1. Register User
export const registerUser = async (req, res) => {
  try {
    const error = getJoiErrorMessage(registerValidation.validate(req.body));
    if (error) return res.status(400).send(error);

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) return res.status(400).send("User already registered.");

    const hashedPassword = await generateHash(req.body.password);
    const user = new User({ ...req.body, password: hashedPassword });
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).send(userResponse);
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
};

// 2. Login User
export const loginUser = async (req, res) => {
  try {
    const error = getJoiErrorMessage(loginValidation.validate(req.body));
    if (error) return res.status(400).send(error);

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password.");

    const validPassword = await compareHash(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("Invalid email or password.");

    const token = generateAuthToken(user);
    res.status(200).send({ token });
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
};

// 3. Get all Users (Admin only / Protected route)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
};

// 4. Get User (The user or Admin only / Protected route)
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    
    // Check if user exists
    if (!user) {
      return res.status(404).send("User not found.");
    }

    res.status(200).send(user);
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
};

// 5. PUT Edit User (The user only / Protected route)
export const editUser = async (req, res) => {
  try {
    const { id } = req.params;

    const error = getJoiErrorMessage(userEditValidation.validate(req.body));
    if (error) return res.status(400).send(error);

    const updateData = { ...req.body };

    if (updateData.password) {
      updateData.password = await generateHash(updateData.password);
    } else {
      delete updateData.password;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
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