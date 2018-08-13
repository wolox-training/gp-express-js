const bcrypt = require('bcryptjs'),
  User = require('../models').User,
  logger = require('../logger');

exports.signUp = (req, res, next) => {
  const user = req.body
    ? {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        email: req.body.email
      }
    : {};
  bcrypt
    .hash(user.password, 10)
    .then(hash => {
      logger.info('Starting user creation');
      user.password = hash;
      User.create(user)
        .then(u => {
          logger.info(`User ${user.firstName} was created successfully`);
          res.status(200);
          res.end();
        })
        .catch(err => {
          logger.error('Database error, the user could not be created');
        });
    })
    .catch(err => {
      res.status(500).send(err);
    });
};
