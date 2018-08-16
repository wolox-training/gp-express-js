const User = require('../models').User;

exports.findOneByEmail = email => {
  return User.findOne({
    where: { email }
  });
};

exports.userList = (offset, limit) => {
  return User.findAll({
    attributes: ['firstName', 'lastName', 'email'],
    offset,
    limit
  });
};

exports.create = user => {
  return User.create(user);
};

exports.update = (user, params) => {
  return user.update(params);
};
