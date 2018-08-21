const jwt = require('jsonwebtoken'),
  config = require('../../config'),
  albumInteractor = require('../interactors/album'),
  logger = require('../logger');

exports.verifyBuy = (req, res, next) => {
  const tokenString = req.headers.authorization.replace('Bearer ', '');
  const token = jwt.decode(tokenString, config.common.session.secret);
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
