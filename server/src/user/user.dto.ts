import * as Joi from 'joi';

export const registerSchema = Joi.object({
  product: Joi.string().max(100).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(5).max(100).required(),
  fullName: Joi.string().min(3).max(100).required(),
  country: Joi.string().min(1).max(100).required(),
}).unknown(true);

export const loginSchema = Joi.object({
  product: Joi.string().max(100).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(5).max(100).required(),
}).unknown(true);
