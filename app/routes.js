const userController = require('./controllers/user'),
  albumController = require('./controllers/album'),
  albumValidations = require('./middlewares/albumValidations'),
  userValidations = require('./middlewares/userValidations');

exports.init = app => {
  app.post('/users', [userValidations.validate], userController.signUp);
  app.post('/users/sessions', [userValidations.validateLogin], userController.signIn);
  app.get('/users', userValidations.verifyAuthentication, userController.list);
  app.post(
    '/admin/users',
    [userValidations.validateAdmin, userValidations.checkAdmin],
    userController.signUpAdmin
  );
  app.get('/albums', userValidations.verifyAuthentication, albumController.list);
  app.post(
    '/albums/:id',
    [userValidations.verifyAuthentication, albumValidations.verifyBuy],
    albumController.buy
  );
  app.get(
    '/users/:user_id/albums',
    [userValidations.verifyAuthentication, albumValidations.verifyAuthGetAlbums],
    albumController.albumsList
  );
  app.get(
    '/users/albums/:id/photos',
    [userValidations.verifyAuthentication, albumValidations.verifyAuthGetPhotos],
    albumController.photos
  );
  app.post(
    '/users/sessions/invalidate_all',
    userValidations.verifyAuthentication,
    userController.invalidateSessions
  );
};
