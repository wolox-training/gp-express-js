const bcrypt = require('bcryptjs'),
  User = require('../models').User,
  jwt = require('jsonwebtoken'),
  config = require('../../config'),
  logger = require('../logger');

exports.signUp = (req, res, next) => {
  const user = req.body
    ? {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        email: req.body.email,
        admin: false
      }
    : {};
  logger.info('Starting user creation');
  User.create(user)
    .then(() => {
      logger.info(`User ${user.firstName} was created successfully`);
      res.status(200);
      res.end();
    })
    .catch(err => {
      logger.error('Database error, the user could not be created');
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
  User.findOne({
    where: { email: login.email }
  })
    .then(userLogged => {
      bcrypt.compare(login.password, userLogged.password).then(samePassword => {
        if (samePassword) {
          logger.info(`${login.email} logged in correctly`);
          const token = jwt.sign({ email: login.email }, config.common.session.secret);
          res.status(200).send({
            user: {
              firstName: userLogged.firstName,
              lastName: userLogged.lastName,
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
      const databaseError = 'Database error, wrong user';
      logger.error(databaseError);
      res.status(401).send(databaseError);
    });
};

exports.list = (req, res, next) => {
  User.findAll({
    attributes: ['firstName', 'lastName', 'email'],
    offset: req.query.offset,
    limit: req.query.limit
  })
    .then(users => {
      res.status(200).send({ users });
      res.end();
    })
    .catch(() => {
      const databaseError = 'Database error';
      logger.error(databaseError);
      res.status(401).send(databaseError);
    });
};

exports.signUpAdmin = (req, res, next) => {};
