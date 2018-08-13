const chai = require('chai'),
  dictum = require('dictum.js'),
  expect = chai.expect,
  server = require('./../app'),
  should = chai.should();

describe('user', () => {
  describe('/users/sessions POST', () => {
    it('Should successfully POST login', done => {
      // Given
      const user = {
        firstName: 'FirstName',
        lastName: 'LastName',
        email: 'test@wolox.com.ar',
        password: 'passwordTest1'
      };
      const login = {
        email: 'test@wolox.com.ar',
        password: 'passwordTest1'
      };
      // When
      chai
        .request(server)
        .post('/users')
        .send(user)
        .then(() => {
          chai
            .request(server)
            .post('/users/sessions')
            .send(login)
            .then(res => {
              // Expect
              res.should.have.status(200);
              done();
            });
        });
    });
  });
});

chai;
