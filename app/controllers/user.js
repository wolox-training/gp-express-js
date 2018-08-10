const bcrypt = require('bcryptjs');
const User = require('../models').User;

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
      user.password = hash;
      User.create(user)
        .then(u => {
          console.log(user.firstName);
          res.status(200);
          res.end();
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
};
