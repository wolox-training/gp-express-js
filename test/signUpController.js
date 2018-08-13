const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  should = chai.should();

describe('user', () => {
  describe('/user POST', () => {
    it('Should successfully POST given an user', done => {
      // Given
      const newUser = {
        firstName: 'FirstName',
        lastName: 'LastName',
        email: 'test@wolox.com.ar',
        password: 'passwordTest1'
      };
      // When
      chai
        .request(server)
        .post('/users')
        .send(newUser)
        .then(res => {
          // Expect
          res.should.have.status(200);
          done();
        });
    });
    it('Should throw an error when sending to POST an user with empty fields', done => {
      // Given
      const anUserWithoutEmailAndPassword = {
        firstName: 'FirstName',
        lastName: 'LastName'
      };
      // When
      chai
        .request(server)
        .post('/users')
        .send(anUserWithoutEmailAndPassword)
        .then(() => done())
        .catch(err => {
          // Expect
          err.should.have.status(401);
          done();
        });
    });
    it("Should throw an error when sending to POST when the user's email already exists", done => {
      // Given
      const anUserWithAnExistingEmail = {
        firstName: 'FirstName',
        lastName: 'LastName',
        email: 'test@wolox.com.ar',
        password: 'passwordTest1'
      };
      // When
      chai
        .request(server)
        .post('/users')
        .send(anUserWithAnExistingEmail)
        .then(() => {
          chai
            .request(server)
            .post('/users')
            .send(anUserWithAnExistingEmail)
            .catch(err => {
              // Expect
              err.should.have.status(401);
              done();
            });
        });
    });
    it("Should throw an error when sending to POST when the user's password is invalid", done => {
      // Given
      const anUserWithAnInvalidPassword = {
        firstName: 'FirstName',
        lastName: 'LastName',
        email: 'test@wolox.com.ar',
        password: 'invalid'
      };
      // When
      chai
        .request(server)
        .post('/users')
        .send(anUserWithAnInvalidPassword)
        .catch(err => {
          // Expect
          err.should.have.status(401);
          done();
        });
    });
    it("Should throw an error when sending to POST when the user's email doesn't belong to wolox domain", done => {
      // Given
      const anUserWithAnInvalidEmail = {
        firstName: 'FirstName',
        lastName: 'LastName',
        email: 'test@invalid.com.ar',
        password: 'passwordTest1'
      };
      // When
      chai
        .request(server)
        .post('/users')
        .send(anUserWithAnInvalidEmail)
        .catch(err => {
          // Expect
          err.should.have.status(401);
          done();
        });
    });
  });
});

chai;
