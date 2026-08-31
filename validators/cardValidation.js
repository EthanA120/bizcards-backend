import Joi from "joi";

const israeliPhoneRegex = /^(?:(?:\+|972)?[\s-]?)(?:0?([23489]|5[0-8]|7[1-9]))[\s-]?(\d{3})[\s-]?(\d{4})$/;
const phoneMessage = 'card "phone" must be a valid Israeli phone number';

const image = Joi.object({
  url: Joi.string().uri().allow("").optional(),
  alt: Joi.string().max(256).allow("").optional()
});

const address = Joi.object({
  state: Joi.string().allow("").optional(),
  country: Joi.string().required(),
  city: Joi.string().required(),
  street: Joi.string().required(),
  houseNumber: Joi.number().min(1).required(),
  zip: Joi.number().required()
});

// Create Card Validation
export const cardValidation = Joi.object({
  title: Joi.string().min(2).max(256).required(),
  subtitle: Joi.string().min(2).max(256).required(),
  description: Joi.string().min(2).max(1024).required(),
  phone: Joi.string().ruleset.regex(israeliPhoneRegex).rule({ message: phoneMessage }).required(),
  email: Joi.string().email().required(),
  web: Joi.string().uri().allow("").optional(),
  image: image.optional(),
  address: address.required()
});

// Edit Card Validation
export const cardEditValidation = Joi.object({
  title: Joi.string().min(2).max(256).required(),
  subtitle: Joi.string().min(2).max(256).required(),
  description: Joi.string().min(2).max(1024).required(),
  phone: Joi.string().ruleset.regex(israeliPhoneRegex).rule({ message: phoneMessage }).required(),
  email: Joi.string().email().required(),
  web: Joi.string().uri().allow("").optional(),
  image: image.optional(),
  address: address.required()
});

// Admin BizNumber Patch Validation
export const changeBizNumberValidation = Joi.object({
  bizNumber: Joi.number().required()
});