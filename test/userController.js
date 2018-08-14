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
          err.response.body.should.be.an('array');
          err.response.body.length.should.be.eq(2);
          err.response.body.should.include('Invalid Password');
          err.response.body.should.include('Invalid Mail');
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
              err.response.body.should.be.an('array');
              err.response.body.length.should.be.eq(1);
              err.response.body.should.include('The same email already exists');
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
          err.response.body.should.be.an('array');
          err.response.body.length.should.be.eq(1);
          err.response.body.should.include('Invalid Password');
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
          err.response.body.should.be.an('array');
          err.response.body.length.should.be.eq(1);
          err.response.body.should.include('Invalid Mail');
          done();
        });
    });
  });

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
              res.body.should.have.property('token');
              res.body.user.email.should.be.eq(user.email);
              done();
            });
        });
    });
    it('Should throw an error when sending to POST a login with empty fields', done => {
      // Given
      const user = {
        firstName: 'FirstName',
        lastName: 'LastName',
        email: 'test@wolox.com.ar',
        password: 'passwordTest1'
      };
      const emptyLogin = {};
      // When
      chai
        .request(server)
        .post('/users')
        .send(user)
        .then(() => {
          chai
            .request(server)
            .post('/users/sessions')
            .send(emptyLogin)
            .then(() => done())
            .catch(err => {
              // Expect
              err.should.have.status(401);
              err.response.body.should.be.an('array');
              err.response.body.length.should.be.eq(3);
              err.response.body.should.include('Invalid Mail');
              err.response.body.should.include('Invalid Password');
              err.response.body.should.include('Non existent mail');
              done();
            });
        });
    });
    it('Should throw an error when sending to POST a login with an incorect password', done => {
      // Given
      const user = {
        firstName: 'FirstName',
        lastName: 'LastName',
        email: 'test@wolox.com.ar',
        password: 'passwordTest1'
      };
      const loginWithAnIncorrectPassword = {
        email: 'test@wolox.com.ar',
        password: 'incorrectPassword'
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
            .send(loginWithAnIncorrectPassword)
            .then(() => done())
            .catch(err => {
              // Expect
              err.should.have.status(401);
              done();
            });
        });
    });
    it('Should throw an error when sending to POST a login with an invalid password', done => {
      // Given
      const user = {
        firstName: 'FirstName',
        lastName: 'LastName',
        email: 'test@wolox.com.ar',
        password: 'passwordTest1'
      };
      const loginWithAnInvalidPassword = {
        email: 'test@wolox.com.ar',
        password: 'invalid'
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
            .send(loginWithAnInvalidPassword)
            .then(() => done())
            .catch(err => {
              // Expect
              err.should.have.status(401);
              err.response.body.should.be.an('array');
              err.response.body.length.should.be.eq(1);
              err.response.body.should.include('Invalid Password');
              done();
            });
        });
    });
    it('Should throw an error when sending to POST a login with an incorect email', done => {
      // Given
      const user = {
        firstName: 'FirstName',
        lastName: 'LastName',
        email: 'test@wolox.com.ar',
        password: 'passwordTest1'
      };
      const loginWithAnIncorrectMail = {
        email: 'incorrect@wolox.com.ar',
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
            .send(loginWithAnIncorrectMail)
            .then(() => done())
            .catch(err => {
              // Expect
              err.should.have.status(401);
              err.response.body.should.be.an('array');
              err.response.body.length.should.be.eq(1);
              err.response.body.should.include('Non existent mail');
              done();
            });
        });
    });
    it('Should throw an error when sending to POST a login with an invalid email', done => {
      // Given
      const user = {
        firstName: 'FirstName',
        lastName: 'LastName',
        email: 'test@wolox.com.ar',
        password: 'passwordTest1'
      };
      const loginWithAnInvalidMail = {
        email: 'test@invalid.com.ar',
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
            .send(loginWithAnInvalidMail)
            .then(() => done())
            .catch(err => {
              // Expect
              err.should.have.status(401);
              err.response.body.should.be.an('array');
              err.response.body.length.should.be.eq(2);
              err.response.body.should.include('Invalid Mail');
              err.response.body.should.include('Non existent mail');
              done();
            });
        });
    });
  });
});

chai;
