const request = require('request-promise'),
  config = require('../../config'),
  albumList = `${config.common.urlRequests.base}${config.common.urlRequests.albumList}`;

exports.allAlums = () => request(albumList);

exports.findOneById = id => request(`${albumList}/${id}`);
