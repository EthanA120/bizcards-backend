import mongoose from "mongoose";

const israeliPhoneRegex = /^(?:(?:\+|972)?[\s-]?)(?:0?([23489]|5[0-8]|7[1-9]))[\s-]?(\d{3})[\s-]?(\d{4})$/;

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  altText: { type: String }
}, { _id: false });

const addressSchema = new mongoose.Schema({
  state: { type: String, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  street: { type: String, required: true },
  houseNumber: { type: String, required: true },
  zipCode: { type: String, required: true },
}, { _id: false });


const cardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  phone: { type: String, required: true, match: israeliPhoneRegex },
  email: { type: String, required: true, unique: true },
  web: { type: String, required: true },
  image: { type: imageSchema, required: true },
  address: { type: addressSchema, required: true },
  bizNumber: { type: Number, required: true, unique: true },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  user_id: { type: Schema.Types.ObjectId, ref: "User" }
});

export const Card = mongoose.model("Card", cardSchema);