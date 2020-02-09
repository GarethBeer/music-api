const Song = require('../models/song');

exports.add = (req, res) => {
  const track = new Song({
    name: req.body.name,
    artist: req.body.artist,
    album: req.params.albumId,
  });
  track.save().then(() => {
    res.status(201).json(track);
  });
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
      res.status(404).json('error no song exists');
    }
  });
};

exports.modify = (req, res) => {
  Song.findOne({ _id: req.params.songId }, (_, result) => {
    if (!result) {
      res.status(404).json('error song does not exist');
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
      res.status(404).json('error - song could not be found');
    } else {
      res.status(201).json('Song successfully deleted');
    }
  });
};
