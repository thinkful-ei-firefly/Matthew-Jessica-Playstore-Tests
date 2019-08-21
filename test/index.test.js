/* eslint-disable strict */
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../index');

describe('GET /apps', () => {

  it('should return an array of apps', () => {
    return request(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => expect(res.body).to.be.an('array'));
  });

  it('should send 400 status on invalid genre', () => {
    return request(app)
      .get('/apps')
      .query({ genres: 'gobb' })
      .expect(400)
      .expect('Content-Type', /json/);
  });

  it('should send 400 status on invalid sort', () => {
    return request(app)
      .get('/apps')
      .query({ sort: 'gobb' })
      .expect(400)
      .expect('Content-Type', /json/);
  });

  it('should send fliter properly on valid query', () => {
    const queryParam = 'action';
    return request(app)
      .get('/apps')
      .query({ genres: queryParam })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        const valid = res.body.filter(data =>
          data.Genres.toLowerCase().includes(queryParam.toLowerCase())
        );
        expect(valid).to.have.length(res.body.length);
      });
  });

  it('should sort properly by rating, high to low', () => {
    return request(app)
      .get('/apps')
      .query({ sort : 'Rating' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then( res => {
        expect(res.body).to.be.an('array');
        let i = 0;
        let sorted = true;

        while (sorted && i < res.body.length -1 ) {
          sorted = sorted && res.body[i].Rating >= res.body[i+1].Rating;
          i++;
        }
        expect(sorted).to.be.true;
      });
  });

  it('should sort alphabetically', () => {
    return request(app)
      .get('/apps')
      .query({ sort : 'App' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then( res => {
        expect(res.body).to.be.an('array');
        let i = 0;
        let sorted = true;

        while (sorted && i < res.body.length -1 ) {
          sorted = sorted && res.body[i].App.toUpperCase() <= res.body[i+1].App.toUpperCase();
          i++;
        }
        expect(sorted).to.be.true;
      });
  });

});
