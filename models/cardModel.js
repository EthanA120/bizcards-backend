import mongoose, { Schema } from "mongoose";

const israeliPhoneRegex = /^(?:(?:\+|972)?[\s-]?)(?:0?([23489]|5[0-8]|7[1-9]))[\s-]?(\d{3})[\s-]?(\d{4})$/;

const imageSchema = new Schema({
  url: { 
    type: String, 
    default: "https://i.pinimg.com/736x/43/05/a8/4305a817df78d7b9ca883a2a9c51610c.jpg" 
  },
  alt: { 
    type: String, 
    default: "business card image" 
  }
});

const addressSchema = new Schema({
  state: { type: String, default: "not defined" },
  country: { type: String, required: true },
  city: { type: String, required: true },
  street: { type: String, required: true },
  houseNumber: { type: Number, required: true },
  zip: { type: Number, default: 0 }
});

const cardSchema = new Schema({
  title: { type: String, required: true, trim: true },
  subtitle: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  phone: { type: String, required: true, match: israeliPhoneRegex },
  email: { type: String, required: true, trim: true },
  web: { type: String, default: "" },
  image: { type: imageSchema, default: () => ({}) },
  address: { type: addressSchema, required: true },
  bizNumber: { type: Number, required: true, unique: true },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Card = mongoose.model("Card", cardSchema);