const User = require('../models').User,
  error = require('../services/errors');

const baseValidation = (email, password) => {
  const errors = [];
  const isWoloxValidEmail = email && email.endsWith('@wolox.com.ar');
  const isPasswordValid = password && password.length >= 8;
  if (!isWoloxValidEmail) errors.push(error.invalidMail.message);
  if (!isPasswordValid) errors.push(error.invalidPassword.message);
  return { errors, isWoloxValidEmail, isPasswordValid };
};

exports.validate = (req, res, next) => {
  const validations = baseValidation(req.body.email, req.body.password);
  User.findOne({
    where: { email: req.body.email }
  }).then(oldUser => {
    if (!oldUser && validations.isWoloxValidEmail && validations.isPasswordValid) {
      next();
    } else {
      if (oldUser) validations.errors.push(error.sameMail.message);
      res.status(401).send(validations.errors);
    }
  });
};

exports.validateLogin = (req, res, next) => {
  const validations = baseValidation(req.body.email, req.body.password);
  User.findOne({
    where: { email: req.body.email }
  }).then(oldUser => {
    if (oldUser && validations.isWoloxValidEmail && validations.isPasswordValid) {
      next();
    } else {
      if (!oldUser) validations.errors.push(error.nonExistentMail.message);
      res.status(401).send(validations.errors);
    }
  });
};
