const userController = require('./controllers/user'),
  albumController = require('./controllers/album'),
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
};
