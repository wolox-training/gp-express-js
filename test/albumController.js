const chai = require('chai'),
  User = require('../app/models').User,
  dictum = require('dictum.js'),
  server = require('./../app'),
  nock = require('nock'),
  config = require('../config'),
  should = chai.should();

describe('album', () => {
  describe('/album GET', () => {
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
});
