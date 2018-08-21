const chai = require('chai'),
  userInteractor = require('../app/interactors/user'),
  albumInteractor = require('../app/interactors/album'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  nock = require('nock'),
  config = require('../config'),
  should = chai.should();

const user = {
  id: 1,
  firstName: 'FirstName',
  lastName: 'LastName',
  email: 'test@wolox.com.ar',
  password: 'passwordTest1'
};

const login = {
  email: 'test@wolox.com.ar',
  password: 'passwordTest1'
};

const albumOne = {
  id: 1,
  userId: 1,
  title: 'quidem molestiae enim'
};

const albumTwo = {
  id: 2,
  userId: 1,
  title: 'quidem molestiae enim2'
};

const albumId = 1;

describe('album', () => {
  describe('/albums GET', () => {
    it('Should successfully GET list of albums', done => {
      // Given
      const albums = [
        {
          userId: 1,
          id: 1,
          title: 'quidem molestiae enim'
        },
        {
          userId: 1,
          id: 2,
          title: 'sunt qui excepturi placeat culpa'
        },
        {
          userId: 1,
          id: 3,
          title: 'omnis laborum odio'
        }
      ];
      nock(config.common.urlRequests.base)
        .get(config.common.urlRequests.albumList)
        .reply(200, albums);
      // When
      userInteractor.create(user).then(() => {
        chai
          .request(server)
          .post('/users/sessions')
          .send(login)
          .then(resToken => {
            chai
              .request(server)
              .get(config.common.urlRequests.albumList)
              .set('authorization', `Bearer ${resToken.body.token}`)
              .then(res => {
                // Expect
                res.should.have.status(200);
                res.body.should.be.an('array');
                res.body.length.should.be.eq(3);
                dictum.chai(res);
                done();
              });
          });
      });
    });
    it('Should throw an error when sending to GET an user not logged', done => {
      // When
      chai
        .request(server)
        .get(config.common.urlRequests.albumList)
        .catch(err => {
          // Expect
          err.should.have.status(401);
          done();
        });
    });
  });
  describe('/albums/:id POST', () => {
    beforeEach(() => {
      nock(`${config.common.urlRequests.base}${config.common.urlRequests.albumList}`)
        .get(`/${albumId}`)
        .reply(200, albumOne);
    });
    it('Should successfully POST when an user buys an album', done => {
      // When
      userInteractor.create(user).then(() => {
        chai
          .request(server)
          .post('/users/sessions')
          .send(login)
          .then(resToken => {
            chai
              .request(server)
              .post(`${config.common.urlRequests.albumList}/${albumId}`)
              .set('authorization', `Bearer ${resToken.body.token}`)
              .send({})
              .then(res => {
                // Expect
                albumInteractor.findOneById(albumId).then(resAlbum => {
                  res.should.have.status(200);
                  resAlbum.id.should.be.eq(albumId);
                  resAlbum.userId.should.be.eq(1);
                  dictum.chai(res);
                  done();
                });
              });
          });
      });
    });
    it('Should throw an error when sending to POST /albums/1 when an user not logged', done => {
      // When
      chai
        .request(server)
        .post(`${config.common.urlRequests.albumList}/${albumId}`)
        .send({})
        .catch(err => {
          // Expect
          err.should.have.status(401);
          done();
        });
    });
    it('Should throw an error when sending to POST when a user has already bought an album', done => {
      // When
      userInteractor.create(user).then(() => {
        chai
          .request(server)
          .post('/users/sessions')
          .send(login)
          .then(resToken => {
            chai
              .request(server)
              .post(`${config.common.urlRequests.albumList}/${albumId}`)
              .set('authorization', `Bearer ${resToken.body.token}`)
              .send({})
              .then(res => {
                chai
                  .request(server)
                  .post(`${config.common.urlRequests.albumList}/${albumId}`)
                  .set('authorization', `Bearer ${resToken.body.token}`)
                  .send({})
                  .catch(err => {
                    // Expect
                    err.should.have.status(401);
                    done();
                  });
              });
          });
      });
    });
    it('Should throw an error when sending to POST when an album does not exist', done => {
      // When
      userInteractor.create(user).then(() => {
        chai
          .request(server)
          .post('/users/sessions')
          .send(login)
          .then(resToken => {
            chai
              .request(server)
              .post(`${config.common.urlRequests.albumList}/albunDoesNotExist`)
              .set('authorization', `Bearer ${resToken.body.token}`)
              .send({})
              .catch(err => {
                // Expect
                err.should.have.status(500);
                done();
              });
          });
      });
    });
  });
  describe('/users/:user_id/albums GET', () => {
    it('Should successfully get albums purchased by the same user', done => {
      // When
      userInteractor.create(user).then(() => {
        albumInteractor.create(albumOne).then(() => {
          albumInteractor.create(albumTwo).then(() => {
            chai
              .request(server)
              .post('/users/sessions')
              .send(login)
              .then(resToken => {
                chai
                  .request(server)
                  .get(`/users/${user.id}/albums`)
                  .set('authorization', `Bearer ${resToken.body.token}`)
                  .then(res => {
                    // Expect
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    res.body.length.should.be.eq(2);
                    res.body[0].userId.should.be.eq(user.id);
                    res.body[1].userId.should.be.eq(user.id);
                    dictum.chai(res);
                    done();
                  });
              });
          });
        });
      });
    });
    it('An admin should successfully get albums purchased by another user', done => {
      // Given
      const adminUser = {
        firstName: 'admin',
        lastName: 'admin',
        email: 'admin@wolox.com.ar',
        password: 'passwordAdmin1',
        admin: true
      };
      const loginAdmin = {
        email: 'admin@wolox.com.ar',
        password: 'passwordAdmin1'
      };
      // When
      userInteractor.create(adminUser).then(() => {
        albumInteractor.create(albumOne).then(() => {
          albumInteractor.create(albumTwo).then(() => {
            chai
              .request(server)
              .post('/users/sessions')
              .send(loginAdmin)
              .then(resToken => {
                chai
                  .request(server)
                  .get(`/users/${user.id}/albums`)
                  .set('authorization', `Bearer ${resToken.body.token}`)
                  .then(res => {
                    // Expect
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    res.body.length.should.be.eq(2);
                    res.body[0].userId.should.be.eq(user.id);
                    res.body[1].userId.should.be.eq(user.id);
                    dictum.chai(res);
                    done();
                  });
              });
          });
        });
      });
    });
    it('Should throw an error when sending to GET albums purchased by another user if the user is not admin', done => {
      // Given
      const anotherUser = {
        id: 2,
        firstName: 'FirstName2',
        lastName: 'LastName2',
        email: 'test2@wolox.com.ar',
        password: 'passwordTest2'
      };
      const loginAnotherUser = {
        email: 'test2@wolox.com.ar',
        password: 'passwordTest2'
      };
      // When
      userInteractor.create(anotherUser).then(() => {
        chai
          .request(server)
          .post('/users/sessions')
          .send(loginAnotherUser)
          .then(resToken => {
            chai
              .request(server)
              .get(`/users/${user.id}/albums`)
              .set('authorization', `Bearer ${resToken.body.token}`)
              .catch(error => {
                // Expect
                error.should.have.status(401);
                done();
              });
          });
      });
    });
    it('Should throw an error when sending to GET albums purchased by a userId if the user is not logged', done => {
      // When
      chai
        .request(server)
        .get(`/users/${user.id}/albums`)
        .catch(error => {
          // Expect
          error.should.have.status(401);
          done();
        });
    });
  });
});
