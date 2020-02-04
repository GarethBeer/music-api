const Album = require('../models/album');
const Artist = require('../models/artist');

exports.add = (req, res) => {
  Artist.findOne({ _id: req.params.id }, (err, artist) => {
    if (!artist) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      const album = new Album({
        name: req.body.name,
        year: req.body.year,
        artist: req.params.id,
      });
      album.save().then(() => {
        res.status(201).json(album);
      });
    }
  });
};
