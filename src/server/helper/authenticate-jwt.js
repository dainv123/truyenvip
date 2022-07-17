import { KEYS } from '../constants'
import jwt from 'jsonwebtoken'

export const AuthenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, KEYS.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.json({
          responseCode: 401,
          errors: ["Unauthorized"]
        })
      }

      req.user = user;

      next();
    });
  } else {
    return res.json({
      responseCode: 401,
      errors: ["Unauthorized"]
    })
  }
};