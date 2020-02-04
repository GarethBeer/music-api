const express = require('express');

const app = express();
app.use(express.json());

const artistController = require('./controllers/artist');
const albumController = require('./controllers/albums');

app.post('/artists', artistController.create);
app.get('/artists', artistController.list);
app.get('/artists/:id', artistController.find);
app.patch('/artists/:id', artistController.modify);
app.delete('/artists/:id', artistController.delete);

app.post('/artists/:id/albums', albumController.add);

module.exports = app;
