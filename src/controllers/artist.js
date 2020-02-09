const Artist = require('../models/artist');

exports.create = (req, res) => {
  const artist = new Artist({
    name: req.body.name,
    genre: req.body.genre,
    albums: [],
  });
  artist.save().then(() => {
    res.status(201).json(artist);
  });
};

exports.list = (req, res) => {
  Artist.find().then(artists => {
    res.status(200).json(artists);
  });
};

exports.find = (req, res) => {
  const { id } = req.params;
  Artist.findOne({ _id: id }, (err, artist) => {
    if (!artist) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      res.status(200).json(artist);
    }
  });
};

exports.modify = (req, res) => {
  const { id } = req.params;
  Artist.findOne({ _id: id }, (_, artist) => {
    if (!artist) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      artist.set(req.body);
      artist.save().then(updatedArtist => {
        res.status(200).json(updatedArtist);
      });
    }
  });
};

exports.delete = (req, res) => {
  const { id } = req.params;
  Artist.findOneAndDelete({ _id: id }, (err, artist) => {
    if (!artist) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      res.status(204).send('Artist deleted');
    }
  });
};
