import mongoose from "mongoose";

const israeliPhoneRegex = /^(?:(?:\+|972)?[\s-]?)(?:0?([23489]|5[0-8]|7[1-9]))[\s-]?(\d{3})[\s-]?(\d{4})$/;

const nameSchema = new mongoose.Schema({
  first: { type: String, required: true },
  middle: { type: String },
  last: { type: String, required: true }
});

const imageSchema = new mongoose.Schema({
  url: { 
    type: String, 
    default: "https://cdn.pixabay.com/photo/2016/04/01/10/11/avatar-1299805_960_720.png" 
  },
  alt: { 
    type: String, 
    default: "user avatar" 
  }
});

const addressSchema = new mongoose.Schema({
  state: { type: String, default: "not defined" },
  country: { type: String, required: true },
  city: { type: String, required: true },
  street: { type: String, required: true },
  houseNumber: { type: Number, required: true },
  zip: { type: Number, default: 0 },
});


const userSchema = new mongoose.Schema({
  name: { type: nameSchema, required: true },
  phone: { type: String, required: true, match: israeliPhoneRegex },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: imageSchema, default: () => ({}) },
  address: { type: addressSchema, required: true },
  isBusiness: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },

  // Bonus 4: Block user after failed login attempts
  loginAttempts: { type: Number, default: 0 },
  blockUntil: { type: Date, default: null },

  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model("User", userSchema);