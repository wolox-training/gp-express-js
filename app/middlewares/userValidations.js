const User = require('../models').User,
  jwt = require('jsonwebtoken'),
  config = require('../../config'),
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

exports.verifyAuthentication = (req, res, next) => {
  if (req.headers.authorization) {
    const tokenString = req.headers.authorization.replace('Bearer ', '');
    const token = jwt.decode(tokenString, config.common.session.secret);
    User.findOne({
      where: { email: token.email }
    }).then(anUser => {
      if (anUser && token) {
        next();
      } else {
        res.status(401).send('Incorrect token');
      }
    });
  } else {
    res.status(401).send('You are not logged in');
  }
};

exports.checkAdmin = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.replace('Bearer ', '');
    jwt.verify(token, config.common.session.secret) ? next() : res.status(401).send('Incorrect token');
  } else {
    res.status(401).send('You are not logged in');
  }
};
