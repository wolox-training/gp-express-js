const userController = require('./controllers/user');
const signUpValidations = require('./middlewares/signUpValidations');

exports.init = app => {
  app.post('/users', [signUpValidations.validate], userController.signUp);
};
