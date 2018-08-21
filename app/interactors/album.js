const Album = require('../models').Album;

exports.findOneById = id => {
  return Album.findOne({
    where: { id }
  });
};

exports.findOneByIdAndUserId = (id, userId) => {
  return Album.findOne({
    where: {
      id,
      userId
    }
  });
};

exports.create = album => {
  return Album.create(album);
};
