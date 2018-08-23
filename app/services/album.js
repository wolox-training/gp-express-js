const request = require('request-promise'),
  config = require('../../config'),
  albumList = `${config.common.urlRequests.base}${config.common.urlRequests.albumList}`;

exports.allAlums = () => request(albumList);

exports.findOneById = id => request(`${albumList}/${id}`);

exports.findPhotosByAlbumId = id => request(`${config.common.urlRequests.base}/photos/?albumId=${id}`);
