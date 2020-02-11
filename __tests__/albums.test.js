const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Artist = require('../src/models/artist');
const Album = require('../src/models/album');

describe('/albums', () => {
  let artist;

  beforeAll(done => {
    const url = process.env.DATABASE_CONN;
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    done();
  });

  beforeEach(done => {
    Artist.create(
      {
        name: 'Tame Impala',
        genre: 'Rock',
      },
      (_, document) => {
        artist = document;
        done();
      },
    );
  });

  afterEach(done => {
    Artist.deleteMany({}, () => {
      Album.deleteMany({}, () => {
        done();
      });
    });
  });

  afterAll(done => {
    mongoose.connection.db.dropDatabase();
    mongoose.connection.close();
    done();
  });

  describe('POST /artists/:artistId/albums', () => {
    it('creates a new album for a given artist', done => {
      request(app)
        .post(`/artists/${artist._id}/albums`)
        .send({
          name: 'InnerSpeaker',
          year: 2010,
        })
        .then(res => {
          expect(res.status).toBe(201);

          Album.findById(res.body._id, (err, album) => {
            expect(err).toBe(null);
            expect(album.name).toBe('InnerSpeaker');
            expect(album.year).toBe(2010);
            expect(album.artist).toEqual(artist._id);
            done();
          });
        });
    });

    it('returns a 404 and does not create an album if the artist does not exist', done => {
      request(app)
        .post('/artists/1234/albums')
        .send({
          name: 'InnerSpeaker',
          year: 2010,
        })
        .then(res => {
          expect(res.status).toBe(404);
          expect(res.body.error).toBe('The artist could not be found.');

          Album.find({}, (err, albums) => {
            expect(err).toBe(null);
            expect(albums.length).toBe(0);
            done();
          });
        });
    });
  });
  describe('with albums in the database', () => {
    let albums;
    beforeEach(done => {
      Promise.all([
        Album.create({
          name: 'Rumours',
          year: 1978,
        }),
        Album.create({
          name: 'Highway To Hell',
          year: 1979,
        }),
      ]).then(documents => {
        albums = documents;
        done();
      });
    });

    describe('GET /albums', () => {
      it('gets all the albums', done => {
        request(app)
          .get('/albums')
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);

            res.body.forEach(album => {
              const expected = albums.find(a => a.id.toString() === album._id);
              expect(album.name).toBe(expected.name);
              expect(album.year).toBe(expected.year);
            });
            done();
          });
      });
      it('finds one album', done => {
        const album = albums[0];
        request(app)
          .get(`/albums/${album._id}`)
          .then(res => {
            expect(res.status).toBe(201);
            expect(res.body.name).toBe(album.name);
            done();
          });
      });
    });

    describe('PATCH /albums', () => {
      it('can alter year of album', done => {
        const album = albums[0];
        request(app)
          .patch(`/albums/${album._id}`)
          .send({ year: 1980 })
          .then(res => {
            expect(res.status).toBe(200);

            Album.findById(album._id, (_, updatedAlbum) => {
              expect(updatedAlbum.year).toBe(1980);
              done();
            });
          });
      });

      it('can alter name of album', done => {
        const album = albums[1];
        request(app)
          .patch(`/albums/${album._id}`)
          .send({ name: 'Back In Black' })
          .then(res => {
            expect(res.status).toBe(200);

            Album.findById(album._id, (_, updatedAlbum) => {
              expect(updatedAlbum.name).toBe('Back In Black');
              done();
            });
          });
      });

      it('it gives an error if no album exists', done => {
        request(app)
          .patch('/albums/12345')
          .send({ name: 'Stairway To Heaven' })
          .then(res => {
            expect(res.status).toBe(404);
            expect(res.body.error).toBe('cannot find album');
            done();
          });
      });
    });

    describe('Delete /albums', () => {
      it('can delete an album', done => {
        const album = albums[0];
        request(app)
          .delete(`/albums/${album._id}`)
          .then(res => {
            expect(res.status).toBe(204);

            Album.findById(album._id, (error, deletedAlbum) => {
              expect(error).toBe(null);
              expect(deletedAlbum).toBe(null);
              done();
            });
          });
      });

      it('can gives a 404 if album doesnt exist', done => {
        request(app)
          .delete('/albums/12345')
          .then(res => {
            expect(res.status).toBe(404);
            done();
          });
      });
    });
  });
});
