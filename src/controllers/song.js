const Song = require('../models/song');

exports.add = (req, res) => {
  const song = new Song({
    name: req.body.name,
    album: req.params.albumId,
    artist: req.body.artistId,
  });
  if (!song.album) {
    res.status(404).json({ error: 'The album does not exist' });
  } else {
    song.save().then(savedSong => {
      Song.findOne({ _id: savedSong._id })
        .populate({ path: 'album' })
        .populate({ path: 'artist' })
        .exec((err, songId) => {
          res.status(201).json(songId);
        });
    });
  }
};

exports.list = (req, res) => {
  Song.find({}).then(results => {
    if (results) {
      res.status(200).json(results);
    } else {
      res.status(404).json('error - No song exists');
    }
  });
};

exports.find = (req, res) => {
  Song.findOne({ _id: req.params.songId }, (error, result) => {
    if (result) {
      res.status(201).json(result);
    } else {
      res.status(404).json({ error: 'error no song exists' });
    }
  });
};

exports.modify = (req, res) => {
  Song.findOne({ _id: req.params.songId }, (_, result) => {
    if (!result) {
      res.status(404).json({ error: 'error song does not exist' });
    } else {
      result
        .set(req.body)
        .save()
        .then(() => {
          res.status(201).json(result);
        });
    }
  });
};

exports.delete = (req, res) => {
  Song.findOneAndDelete({ _id: req.params.songId }, (err, result) => {
    if (!result) {
      res.status(404).json({ error: 'error - song could not be found' });
    } else {
      res.status(204).json('Song successfully deleted');
    }
  });
};
