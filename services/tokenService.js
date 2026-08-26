import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

export function generateAuthToken(req, res, next) {
  
}

export function verifyToken(req, res, next) {
  jwt.verify(req.headers.authorization || req.query.token, JWT_SECRET, (err, data) => {
    if (err) {
      res.status(401).send({ message: "User is not authorized" });
    } else {
      next();
    }
  });
}