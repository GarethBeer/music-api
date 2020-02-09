const express = require('express');

const app = express();
app.use(express.json());

const artistController = require('./controllers/artist');
const albumController = require('./controllers/albums');
const songController = require('./controllers/song');

// Artists routes
app.post('/artists', artistController.create);
app.get('/artists', artistController.list);
app.get('/artists/:id', artistController.find);
app.patch('/artists/:id', artistController.modify);
app.delete('/artists/:id', artistController.delete);

// Albums
app.post('/artists/:id/albums', albumController.add);
app.get('/albums', albumController.list);
app.patch('/albums/:id', albumController.modify);
app.delete('/albums/:id', albumController.delete);

// Songs
app.post('/album/:albumId/songs', songController.add);
app.get('/songs', songController.list);
app.get('/songs/:songId', songController.find);
app.patch('/songs/:songId', songController.modify);
app.delete('/songs/:songId', songController.delete);
module.exports = app;
