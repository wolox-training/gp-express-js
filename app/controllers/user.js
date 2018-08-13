const bcrypt = require('bcryptjs'),
  User = require('../models').User,
  jwt = require('jwt-simple'),
  config = require('../../config'),
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

exports.signIn = (req, res, next) => {
  const login = req.body
    ? {
        email: req.body.email,
        password: req.body.password
      }
    : {};
  if (!login.email || !login.password) {
    res.status(401).send('Empty fields');
  }
  User.findOne({
    where: { email: login.email }
  })
    .then(userLogged => {
      if (!userLogged) res.status(401).send('Wrong Email');
      bcrypt.compare(login.password, userLogged.password).then(samePassword => {
        if (samePassword) {
          logger.info(`${login.email} logged in correctly`);
          const token = jwt.encode({ email: login.email }, 'a');
          res.status(200).send({
            user: {
              email: login.email
            },
            token
          });
          res.end();
        } else {
          res.status(401).send('Incorrect password');
        }
      });
    })
    .catch(() => {
      res.status(401).send('Non-existent user');
    });
};
