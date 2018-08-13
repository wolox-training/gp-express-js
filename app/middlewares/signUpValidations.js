const User = require('../models').User,
  error = require('../services/errors');

exports.validate = (req, res, next) => {
  const errors = [];
  const isWoloxValidEmail = req.body.email && req.body.email.endsWith('@wolox.com.ar');
  const isPasswordValid = req.body.password && req.body.password.length >= 8;
  if (!isWoloxValidEmail) errors.push(error.invalidMail.message);
  if (!isPasswordValid) errors.push(error.invalidPassword.message);
  User.findOne({
    where: { email: req.body.email }
  }).then(oldUser => {
    if (!oldUser && isWoloxValidEmail && isPasswordValid) {
      next();
    } else {
      if (oldUser) errors.push(error.sameMail.message);
      res.status(401).send(errors);
    }
  });
};
