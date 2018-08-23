const jwt = require('jsonwebtoken'),
  config = require('../../config'),
  userInteractor = require('../interactors/user'),
  moment = require('moment'),
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
  userInteractor.findOneByEmail(req.body.email).then(oldUser => {
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
  userInteractor.findOneByEmail(req.body.email).then(oldUser => {
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
    userInteractor.findOneByEmail(token.email).then(anUser => {
      if (anUser && token) {
        req.headers.user = anUser;
        const invalidationTime = moment(token.lastSignInDate);
        invalidationTime.add(config.common.session.invalidationTimeInMinutes, 'minutes');
        invalidationTime > moment() &&
        (!anUser.invalidationDate || moment(token.lastSignInDate) > anUser.invalidationDate)
          ? next()
          : res.status(401).send('The session expired');
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
    const tokenString = req.headers.authorization.replace('Bearer ', '');
    const token = jwt.decode(tokenString, config.common.session.secret);
    userInteractor.findOneByEmail(token.email).then(anUser => {
      anUser && anUser.admin && token ? next() : res.status(401).send('Denied Permission');
    });
  } else {
    res.status(401).send('You are not logged in');
  }
};

exports.validateAdmin = (req, res, next) => {
  const validations = baseValidation(req.body.email, req.body.password);
  validations.isWoloxValidEmail && validations.isPasswordValid
    ? next()
    : res.status(401).send(validations.errors);
};
