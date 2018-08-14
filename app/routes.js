const userController = require('./controllers/user'),
  signUpValidations = require('./middlewares/userValidations');

exports.init = app => {
  app.post('/users', [signUpValidations.validate], userController.signUp);
  app.post('/users/sessions', [signUpValidations.validateLogin], userController.signIn);
};
