const { check } = require('express-validator/check');
const User = require('../models').User;

exports.validate = (req, res, next) => {
  const isWoloxValidEmail = req.body.email.endsWith('@wolox.com.ar');
  const isPasswordValid = req.body.password.length <= 8;
  const email = req.body.email;
  User.findOne({ email }).then(oldUser => {
    if (oldUser && oldUser.email === req.body.email) {
      res.status(401).send('ES EL MISMO MAIL!!!');
    }
    if (isWoloxValidEmail && isPasswordValid) {
      next();
    } else {
      res.status(401).send('invalid params');
    }
  });
};
