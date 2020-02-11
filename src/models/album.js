const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  name: String,
  year: Number,
  artist: { type: mongoose.Schema.ObjectId, ref: 'artist' },
});

const Album = mongoose.model('album', albumSchema);

module.exports = Album;
