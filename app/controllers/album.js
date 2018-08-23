const albumService = require('../services/album'),
  albumInteractor = require('../interactors/album'),
  logger = require('../logger');

exports.list = (req, res, next) => {
  logger.info('Getting all albums');
  albumService
    .allAlums()
    .then(albums => {
      logger.info('Get albums successfully');
      res.status(200).send(JSON.parse(albums));
    })
    .catch(error => {
      logger.error(error);
      res.status(500).send(error);
    });
};

exports.buy = (req, res, next) => {
  logger.info('Starting buy album');
  albumService
    .findOneById(req.params.id)
    .then(albumToBuy => {
      const albumToBuyJSON = JSON.parse(albumToBuy);
      const newBuy = {
        id: albumToBuyJSON.id,
        userId: req.headers.user.id,
        title: albumToBuyJSON.title
      };
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

exports.albumsList = (req, res, next) => {
  logger.info('Getting albums');
  albumInteractor
    .findAllAlumsByUserId(req.params.user_id)
    .then(albums => {
      logger.info('Get albums by userId successfully');
      res.status(200).send(albums);
    })
    .catch(error => {
      logger.error('Service error');
      res.status(500).send(error);
    });
};

exports.photos = (req, res, next) => {
  logger.info('Getting photos');
  albumService
    .findPhotosByAlbumId(req.params.id)
    .then(photos => {
      logger.info('Get photos successfully');
      res.status(200).send(JSON.parse(photos));
    })
    .catch(error => {
      logger.error('Service error');
      res.status(500).send(error);
    });
};
