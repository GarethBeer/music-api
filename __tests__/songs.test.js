const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Artist = require('../src/models/artist');
const Album = require('../src/models/album');
const Song = require('../src/models/song');

describe('Songs', () => {
  let artistId;
  let albumId;

  beforeAll(done => {
    const url = process.env.DATABASE_CONN;
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    done();
  });

  beforeEach(done => {
    Artist.create({ name: 'ACDC', genre: 'Rock' }, (_, artist) => {
      artistId = artist._id.toString();
      Album.create({ name: 'Highway To Hell', year: 1979, artist: artistId }, (__, album) => {
        albumId = album._id.toString();
        done();
      });
    });
  });

  afterEach(done => {
    Artist.deleteMany({}, () => {
      Album.deleteMany({}, () => {
        Song.deleteMany({}, () => {
          done();
        });
      });
    });
  });

  afterAll(done => {
    mongoose.connection.close();
    done();
  });

  describe('POST /album/:albumId/song', () => {
    it('creates a new song under an album', done => {
      request(app)
        .post(`/albums/${albumId}/songs`)
        .send({
          artistId,
          name: 'Walk All Over You',
        })
        .then(res => {
          expect(res.status).toBe(201);
          const songId = res.body._id;
          expect(res.body).toEqual({
            name: 'Walk All Over You',
            _id: songId,
            artist: {
              _id: artistId,
              name: 'ACDC',
              genre: 'Rock',
              __v: 0,
            },
            album: {
              _id: albumId,
              artist: artistId,
              name: 'Highway To Hell',
              year: 1979,
              __v: 0,
            },
            __v: 0,
          });
          done();
        });
    });
  });

  describe('with artists in the database', () => {
    let songs;
    beforeEach(done => {
      Promise.all([
        Song.create({ name: 'Highway To Hell', album: albumId, artist: artistId }),
        Song.create({ name: 'Beating around the bush', album: albumId, artist: artistId }),
        Song.create({ name: 'Touch Too Much', album: albumId, artist: artistId }),
      ]).then(document => {
        songs = document;
        done();
      });
    });

    describe('Get /songs', () => {
      it('finds all songs', done => {
        request(app)
          .get('/songs')
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(3);

            res.body.forEach(song => {
              const expected = songs.find(a => a._id.toString() === song._id);
              expect(song.name).toBe(expected.name);
            });
            done();
          });
      });

      it('finds a particular song', done => {
        const song = songs[0];
        request(app)
          .get(`/songs/${song._id}`)
          .then(res => {
            expect(res.status).toBe(201);
            expect(res.body.name).toBe('Highway To Hell');
            expect(res.body.artist).toBe(artistId);
            expect(res.body.album).toBe(albumId);
          });
        done();
      });

      it('errors is no song exists', done => {
        request(app)
          .get(`/songs/12345`)
          .then(res => {
            expect(res.status).toBe(404);
            expect(res.body.error).toBe('error no song exists');
          });
        done();
      });
    });

    describe('Patch / songs/:songId', () => {
      it('alters the name of a song', done => {
        const song = songs[0];
        request(app)
          .patch(`/songs/${song._id}`)
          .send({ name: 'Shot Down In Flames' })
          .then(res => {
            expect(res.status).toBe(201);

            Song.findOne({ name: 'Shot Down In Flames' }, (_, updatedSong) => {
              expect(updatedSong.name).toBe('Shot Down In Flames');
              done();
            });
          });
      });

      it('errors if song does not exist', done => {
        request(app)
          .patch(`/songs/1234`)
          .send({ name: 'Shot Down In Flames' })
          .then(res => {
            expect(res.status).toBe(404);
            expect(res.body.error).toBe('error song does not exist');
            done();
          });
      });
    });

    describe('Delete /songs/:songId', () => {
      it('deletes song from database', done => {
        const song = songs[0];
        request(app)
          .delete(`/songs/${song._id}`)
          .then(res => {
            expect(res.status).toBe(204);
            Song.findById(song._id, (_, deletedSong) => {
              expect(deletedSong).toBe(null);
              done();
            });
          });
      });
      it('deletes song from database', done => {
        request(app)
          .delete(`/songs/12345`)
          .then(res => {
            expect(res.status).toBe(404);
            expect(res.body.error).toBe('error - song could not be found');
            done();
          });
      });
    });
  });
});
