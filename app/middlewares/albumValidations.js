const jwt = require('jsonwebtoken'),
  config = require('../../config'),
  albumInteractor = require('../interactors/album'),
  logger = require('../logger');

exports.verifyBuy = (req, res, next) => {
  const tokenString = req.headers.authorization.replace('Bearer ', '');
  const token = jwt.decode(tokenString, config.common.session.secret);
  albumInteractor
    .findOneById(req.params.id)
    .then(album => {
      if (!album || (album && album.userId !== token.id)) {
        next();
      } else {
        res.status(401).send('You already bought the album');
      }
    })
    .catch(error => {
      logger.error('Database error');
      res.status(500).send(error);
    });
};
