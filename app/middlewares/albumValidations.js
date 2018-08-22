const jwt = require('jsonwebtoken'),
  config = require('../../config'),
  albumInteractor = require('../interactors/album'),
  logger = require('../logger');

const decodeToken = auth => jwt.decode(auth.replace('Bearer ', ''), config.common.session.secret);

exports.verifyBuy = (req, res, next) => {
  const token = decodeToken(req.headers.authorization);
  req.headers.user = token;
  albumInteractor
    .findOneByIdAndUserId(req.params.id, token.id)
    .then(album => {
      album ? res.status(401).send('You already bought the album') : next();
    })
    .catch(error => {
      logger.error('Database error');
      res.status(500).send(error);
    });
};

exports.verifyAuthGetAlbums = (req, res, next) => {
  const token = decodeToken(req.headers.authorization);
  token.admin || parseInt(req.params.user_id) === token.id
    ? next()
    : res.status(401).send("You do not have permission to view the user's albums");
};

exports.verifyAuthGetPhotos = (req, res, next) => {
  const token = decodeToken(req.headers.authorization);
  albumInteractor
    .findOneByIdAndUserId(req.params.id, token.id)
    .then(album => {
      album ? next() : res.status(401).send('You have not bought this album');
    })
    .catch(error => {
      logger.error('Database error');
      res.status(500).send(error);
    });
};
