const albumService = require('../services/album'),
  albumInteractor = require('../interactors/album'),
  jwt = require('jsonwebtoken'),
  config = require('../../config'),
  logger = require('../logger');

exports.list = (req, res, next) => {
  logger.info('Getting all albums');
  albumService
    .allAlums()
    .then(albums => {
      logger.info('Get albums successfully');
      return res.status(200).send(JSON.parse(albums));
    })
    .catch(error => {
      logger.error(error);
      return res.status(500).send(error);
    });
};

exports.buy = (req, res, next) => {
  logger.info('Starting buy album');
  const tokenString = req.headers.authorization.replace('Bearer ', '');
  const token = jwt.decode(tokenString, config.common.session.secret);
  albumService
    .findOneById(req.params.id)
    .then(albumToBuy => {
      const albumToBuyJSON = JSON.parse(albumToBuy);
      const newBuy = {
        id: albumToBuyJSON.id,
        userId: token.id,
        title: albumToBuyJSON.title
      };
      const x = 1;
      albumInteractor
        .create(newBuy)
        .then(() => {
          logger.info('Purchase made successfully');
          res.status(200);
          res.end();
        })
        .catch(error => {
          logger.error('The purchase could not be made');
          res.status(500).send(error);
        });
    })
    .catch(error => {
      logger.error('Service error');
      res.status(500).send(error);
    });
};
