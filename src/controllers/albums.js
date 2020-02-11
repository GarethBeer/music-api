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
      album.save().then(albums => {
        res.status(201).json(albums);
      });
    }
  });
};

exports.list = (req, res) => {
  Album.find({}).then(albums => {
    res.status(200).json(albums);
  });
};

exports.find = (req, res) => {
  Album.findOne({ _id: req.params.albumId }, (_, result) => {
    if (!result) {
      res.status(404).json('error, no album found');
    } else {
      res.status(201).json(result);
    }
  });
};

exports.modify = (req, res) => {
  Album.findOne({ _id: req.params.id }, (_, album) => {
    if (!album) {
      res.status(404).json({ error: 'cannot find album' });
    } else {
      album.set(req.body);
      album.save().then(updatedAlbum => {
        res.status(200).json(updatedAlbum);
      });
    }
  });
};

exports.delete = (req, res) => {
  Album.findByIdAndDelete({ _id: req.params.id }, (_, album) => {
    if (!album) {
      res.status(404).json({ error: 'No album exists' });
    } else {
      res.status(204).json({});
    }
  });
};
