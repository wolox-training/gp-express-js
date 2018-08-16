const chai = require('chai'),
  User = require('../app/models').User,
  dictum = require('dictum.js'),
  server = require('./../app'),
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

describe('album', () => {
  describe('/album GET', () => {
    it('Should successfully GET list of albums', done => {
      User.create(user).then(() => {
        chai
          .request(server)
          .post('/users/sessions')
          .send(login)
          .then(resToken => {
            chai
              .request(server)
              .get('/albums')
              .set('authorization', `Bearer ${resToken.body.token}`)
              .then(res => {
                res.should.have.status(200);
                res.body.should.be.an('array');
                res.body.length.should.be.eq(100);
                dictum.chai(res);
                done();
              });
          });
      });
    });
    it('Should throw an error when sending to GET an user not logged', done => {
      chai
        .request(server)
        .get('/albums')
        .catch(err => {
          err.should.have.status(401);
          done();
        });
    });
  });
});

chai;
