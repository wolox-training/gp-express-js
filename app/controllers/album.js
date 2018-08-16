const config = require('../../config'),
  albumService = require('../services/album'),
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
      return res.status(502).send(error);
    });
};
