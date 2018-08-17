const Album = require('../models').Album;

exports.findOneById = id => {
  return Album.findOne({
    where: { id }
  });
};

exports.create = album => {
  return Album.create(album);
};
