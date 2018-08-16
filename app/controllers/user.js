const bcrypt = require('bcryptjs'),
  User = require('../models').User,
  jwt = require('jsonwebtoken'),
  config = require('../../config'),
  logger = require('../logger');

const createUser = (res, user, admin) => {
  const newUser = user
    ? {
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password,
        email: user.email,
        admin
      }
    : {};
  User.create(newUser)
    .then(() => {
      logger.info(`User ${newUser.firstName} was created successfully`);
      res.status(200);
      res.end();
    })
    .catch(err => {
      logger.error('Database error, the user could not be created');
      res.status(500).send(err);
    });
};

exports.signUp = (req, res, next) => {
  logger.info('Starting user creation');
  createUser(res, req.body, false);
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

const createAdmin = (res, user) => {
  logger.info('Starting user admin creation');
  createUser(res, user, true);
};

const updateUserAdmin = (res, user) => {
  logger.info('Starting user admin updating');
  if (user.admin) {
    const youAreAlreadyAdministratorMessage = 'You are already administrator';
    logger.info(youAreAlreadyAdministratorMessage);
    res.status(200).send(youAreAlreadyAdministratorMessage);
    res.end();
  } else {
    const toAdmin = {
      admin: true
    };
    user
      .update(toAdmin)
      .then(() => {
        logger.info(`User ${user.firstName} was updated successfully`);
        res.status(200);
        res.end();
      })
      .catch(err => {
        logger.error('Database error, the user could not be created');
        res.status(500).send(err);
      });
  }
};

exports.signUpAdmin = (req, res, next) => {
  logger.info('Starting user admin creation');
  User.findOne({
    where: { email: req.body.email }
  })
    .then(userLogged => {
      if (userLogged) {
        updateUserAdmin(res, userLogged);
      } else {
        createAdmin(res, req.body);
      }
    })
    .catch(err => {
      logger.error('Database error');
      res.status(500).send(err);
    });
};
