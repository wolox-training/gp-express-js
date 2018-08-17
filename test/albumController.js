const chai = require('chai'),
  User = require('../app/models').User,
  albumInteractor = require('../app/interactors/album'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  nock = require('nock'),
  config = require('../config'),
  should = chai.should();

const user = {
  firstName: 'FirstName',
  lastName: 'LastName',
  email: 'test@wolox.com.ar',
  password: 'passwordTest1',
  admin: false
};

const login = {
  email: 'test@wolox.com.ar',
  password: 'passwordTest1'
};

const albumOne = {
  userId: 10,
  id: 1,
  title: 'quidem molestiae enim'
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
      User.create(user).then(() => {
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
    it('Should successfully POST when an user buys an album', done => {
      // Given
      nock(config.common.urlRequests.base)
        .get(`${config.common.urlRequests.albumList}/${albumId}`)
        .reply(200, albumOne);
      // When
      User.create(user).then(() => {
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
      // Given
      nock(config.common.urlRequests.base)
        .post(`${config.common.urlRequests.albumList}/${albumId}`)
        .reply(200, albumOne);
      nock(config.common.urlRequests.base)
        .post(`${config.common.urlRequests.albumList}/${albumId}`)
        .reply(401, 'You already bought the album');
      // When
      User.create(user).then(() => {
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
      // Given
      nock(config.common.urlRequests.base)
        .get(`${config.common.urlRequests.albumList}/${albumId}`)
        .reply(200, albumOne);
      nock(config.common.urlRequests.base)
        .post(`${config.common.urlRequests.albumList}/${albumId}`)
        .reply(401, 'Nonexistent album');
      // When
      User.create(user).then(() => {
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
              .then(() => {
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
  });
});
