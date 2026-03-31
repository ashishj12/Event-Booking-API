import { validationResult } from "express-validator";

// Runs after your validation chains, sends 422 if anything failed
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }
  next();
};
