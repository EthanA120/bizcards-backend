import mongoose from "mongoose";

const israeliPhoneRegex = /^(?:(?:\+|972)?[\s-]?)(?:0?([23489]|5[0-8]|7[1-9]))[\s-]?(\d{3})[\s-]?(\d{4})$/;

const nameSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true }
}, { _id: false }); // _id: false prevents Mongoose from creating an _id field for the name subdocument

const imageSchema = new mongoose.Schema({
  url: { type: String },
  altText: { type: String }
}, { _id: false });

const addressSchema = new mongoose.Schema({
  state: { type: String, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  street: { type: String, required: true },
  houseNumber: { type: Number, required: true },
  zipCode: { type: Number, required: true },
}, { _id: false });


const userSchema = new mongoose.Schema({
  name: { type: nameSchema, required: true },
  phone: { type: String, required: true, match: israeliPhoneRegex },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: imageSchema, required: true },
  address: { type: addressSchema, required: true },
  isBusiness: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model("User", userSchema);