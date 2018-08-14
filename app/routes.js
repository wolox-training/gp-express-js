const userController = require('./controllers/user'),
  userList = require('./middlewares/userList');
  userValidations = require('./middlewares/userValidations');

exports.init = app => {
  app.post('/users', [userValidations.validate], userController.signUp);
  app.post('/users/sessions', [userValidations.validateLogin], userController.signIn);
  app.get('/users', userList.verifyAuthentication, userController.list);
};
