import Joi from "joi";

const israeliPhoneRegex = /^(?:(?:\+|972)?[\s-]?)(?:0?([23489]|5[0-8]|7[1-9]))[\s-]?(\d{3})[\s-]?(\d{4})$/;
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{9,}$/;

const name = Joi.object({
  firstName: Joi.string().min(2).max(256).required(),
  middleName: Joi.string().max(256).allow("").optional(),
  lastName: Joi.string().min(2).max(256).required(),
});

const image = Joi.object({
  url: Joi.string().uri().allow("").optional(),
  altText: Joi.string().max(256).allow("").optional()
});

const address = Joi.object({
  state: Joi.string().allow("").optional(),
  country: Joi.string().required(),
  city: Joi.string().required(),
  street: Joi.string().required(),
  houseNumber: Joi.number().min(1).required(),
  zipCode: Joi.number().optional()
});

export const registerValidation = Joi.object({
  name: name.required(),
  phone: Joi.string().ruleset.regex(israeliPhoneRegex).rule({ message: 'user "phone" must be a valid Israeli phone number' }).required(),
  email: Joi.string().email().required(),
  password: Joi.string().ruleset.regex(strongPasswordRegex)
  .rule({ 
    message: 'Password must be at least 9 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character' 
  }).required(),
  image: image.optional(),
  address: address.required(),
  isBusiness: Joi.boolean().required()
});

export const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(7).max(20).required()
});