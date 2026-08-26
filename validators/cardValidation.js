import Joi from "joi";

const israeliPhoneRegex = /^(?:(?:\+|972)?[\s-]?)(?:0?([23489]|5[0-8]|7[1-9]))[\s-]?(\d{3})[\s-]?(\d{4})$/;

const image = Joi.object({
  url: Joi.string().uri().required(),
  altText: Joi.string().max(256).allow("").optional()
});

const address = Joi.object({
  state: Joi.string().required(),
  country: Joi.string().required(),
  city: Joi.string().required(),
  street: Joi.string().required(),
  houseNumber: Joi.number().min(1).required(),
  zipCode: Joi.number().required()
});

export const cardValidation = Joi.object({
  title: Joi.string().min(2).max(256).required(),
  subtitle: Joi.string().min(2).max(256).required(),
  description: Joi.string().min(2).max(1024).required(),
  phone: Joi.string().ruleset.regex(israeliPhoneRegex).rule({ message: 'card "phone" must be a valid Israeli phone number' }).required(),
  email: Joi.string().email().required(),
  web: Joi.string().uri().required(),
  image: image.required(),
  address: address.required()
});