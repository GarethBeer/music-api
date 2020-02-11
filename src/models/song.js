const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  name: String,
  album: { type: mongoose.Schema.ObjectId, ref: 'album' },
  artist: { type: mongoose.Schema.ObjectId, ref: 'artist' },
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
