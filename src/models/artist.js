const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: String,
  genre: String,
});

const Artist = mongoose.model('artist', artistSchema);

module.exports = Artist;
