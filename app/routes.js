const userController = require('./controllers/user'),
  signUpValidations = require('./middlewares/signUpValidations');

exports.init = app => {
  app.post('/users', [signUpValidations.validate], userController.signUp);
  app.post('/users/sessions', [], userController.signIn);
};
