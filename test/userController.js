const chai = require('chai'),
  userInteractor = require('../app/interactors/user'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  should = chai.should();

const user = {
  firstName: 'FirstName',
  lastName: 'LastName',
  email: 'test@wolox.com.ar',
  password: 'passwordTest1'
};

describe('user', () => {
  describe('/user POST', () => {
    it('Should successfully POST given an user', done => {
      // When
      chai
        .request(server)
        .post('/users')
        .send(user)
        .then(res => {
          // Expect
          res.should.have.status(200);
          dictum.chai(res);
        })
        .then(() => done());
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
      // When
      chai
        .request(server)
        .post('/users')
        .send(user)
        .then(() => {
          chai
            .request(server)
            .post('/users')
            .send(user)
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
              dictum.chai(res);
              done();
            });
        });
    });
    describe('/users GET', () => {
      const otherUser = {
        firstName: 'FirstName2',
        lastName: 'LastName2',
        email: 'test2@wolox.com.ar',
        password: 'passwordTest2'
      };
      beforeEach(() => {
        userInteractor.create(otherUser);
      });
      it('Should successfully GET users', done => {
        // Given
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
              .then(resToken => {
                const token = resToken.body.token;
                chai
                  .request(server)
                  .get('/users')
                  .set('authorization', `Bearer ${token}`)
                  .then(res => {
                    // Expect
                    res.should.have.status(200);
                    res.body.users.should.be.an('array');
                    res.body.users.length.should.be.eq(2);
                    dictum.chai(res);
                    done();
                  });
              });
          });
      });
      it('Should throw an error when sending to GET without token', done => {
        // Given
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
              .then(() => {
                chai
                  .request(server)
                  .get('/users')
                  .catch(err => {
                    // Expect
                    err.should.have.status(401);
                    done();
                  });
              });
          });
      });
      it('Should successfully GET users, returning only the last user', done => {
        // Given
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
              .then(resToken => {
                const token = resToken.body.token;
                chai
                  .request(server)
                  .get('/users?offset=1&limit=1')
                  .set('authorization', `Bearer ${token}`)
                  .then(res => {
                    // Expect
                    res.should.have.status(200);
                    res.body.users.should.be.an('array');
                    res.body.users.length.should.be.eq(1);
                    dictum.chai(res);
                    done();
                  });
              });
          });
      });
    });
  });
  describe('/admin/users POST', () => {
    const adminUser = {
      firstName: 'admin',
      lastName: 'admin',
      email: 'admin@wolox.com.ar',
      password: 'passwordAdmin1',
      admin: true
    };
    const newAdmin = {
      firstName: 'newAdmin',
      lastName: 'newAdmin',
      email: 'newAdmin@wolox.com.ar',
      password: 'passwordNewAdmin1'
    };
    const login = {
      email: 'admin@wolox.com.ar',
      password: 'passwordAdmin1'
    };
    it('Should successfully POST when an adminUser registers a new admin', done => {
      // When
      userInteractor.create(adminUser).then(() => {
        chai
          .request(server)
          .post('/users/sessions')
          .send(login)
          .then(resToken => {
            const token = resToken.body.token;
            chai
              .request(server)
              .post('/admin/users')
              .send(newAdmin)
              .set('authorization', `Bearer ${token}`)
              .then(res => {
                // Expect
                userInteractor.findOneByEmail(newAdmin.email).then(resNewAdmin => {
                  res.should.have.status(200);
                  resNewAdmin.email.should.be.eq(newAdmin.email);
                  resNewAdmin.admin.should.be.eq(!newAdmin.admin);
                  dictum.chai(res);
                  done();
                });
              });
          });
      });
    });
    it('Should successfully POST when an adminUser registers an user how admin', done => {
      // When
      userInteractor.create(adminUser).then(() => {
        chai
          .request(server)
          .post('/users')
          .send(newAdmin)
          .then(() => {
            chai
              .request(server)
              .post('/users/sessions')
              .send(login)
              .then(resToken => {
                const token = resToken.body.token;
                chai
                  .request(server)
                  .post('/admin/users')
                  .send(newAdmin)
                  .set('authorization', `Bearer ${token}`)
                  .then(res => {
                    // Expect
                    userInteractor.findOneByEmail(newAdmin.email).then(resNewAdmin => {
                      res.should.have.status(200);
                      resNewAdmin.email.should.be.eq(newAdmin.email);
                      resNewAdmin.admin.should.be.eq(!newAdmin.admin);
                      dictum.chai(res);
                      done();
                    });
                  });
              });
          });
      });
    });
    it('Should throw an error when sending to POST when a normal user registers an user how admin', done => {
      // Given
      const regularUser = {
        firstName: 'admin',
        lastName: 'admin',
        email: 'admin@wolox.com.ar',
        password: 'passwordAdmin1'
      };
      // When
      userInteractor.create(regularUser).then(() => {
        chai
          .request(server)
          .post('/users')
          .send(newAdmin)
          .then(() => {
            chai
              .request(server)
              .post('/users/sessions')
              .send(login)
              .then(resToken => {
                const token = resToken.body.token;
                chai
                  .request(server)
                  .post('/admin/users')
                  .send(newAdmin)
                  .set('authorization', `Bearer ${token}`)
                  .catch(err => {
                    // Expect
                    userInteractor.findOneByEmail(newAdmin.email).then(resNewAdmin => {
                      err.should.have.status(401);
                      resNewAdmin.email.should.be.eq(newAdmin.email);
                      resNewAdmin.admin.should.be.eq(false);
                      done();
                    });
                  });
              });
          });
      });
    });
    it('Should throw an error when sending to POST when an admin is not logged registers an user how admin', done => {
      // When
      chai
        .request(server)
        .post('/admin/users')
        .send(newAdmin)
        .catch(err => {
          // Expect
          err.should.have.status(401);
          done();
        });
    });
    it('Should throw an error when sending to POST when an admin with incorrect mail', done => {
      const adminWithIncorrectMail = {
        firstName: 'newAdmin',
        lastName: 'newAdmin',
        email: 'newAdmin2@wrong.com.ar',
        password: 'passwordNewAdmin2'
      };
      // When
      chai
        .request(server)
        .post('/admin/users')
        .send(adminWithIncorrectMail)
        .catch(err => {
          // Expect
          err.should.have.status(401);
          err.response.body.should.be.an('array');
          err.response.body.length.should.be.eq(1);
          err.response.body.should.include('Invalid Mail');
          done();
        });
    });
    it('Should throw an error when sending to POST when an admin with the invalid password', done => {
      const adminWithIvalidPassword = {
        firstName: 'newAdmin',
        lastName: 'newAdmin',
        email: 'newAdmin2@wolox.com.ar',
        password: 'invalid'
      };
      // When
      chai
        .request(server)
        .post('/admin/users')
        .send(adminWithIvalidPassword)
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
});

chai;
