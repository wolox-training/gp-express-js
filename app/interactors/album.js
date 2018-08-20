const Album = require('../models').Album;

exports.findOneById = id =>
  Album.findOne({
    where: { id }
  });

exports.findOneByIdAndUserId = (id, userId) =>
  Album.findOne({
    where: {
      id,
      userId
    }
  });

exports.create = album => Album.create(album);

exports.findAllAlumsByUserId = userId =>
  Album.findAll({
    where: { userId }
  });
