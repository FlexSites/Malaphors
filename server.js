'use strict';

const express = require('express');
const Idiom = require('./services/idiom');
const pug = require('pug');

const template = pug.compileFile('index.pug');

const DEFAULT_PORT = 3000;
const PORT = process.env.PORT || DEFAULT_PORT;

const app = express();

app.use(express.static('client'));

app.get('/idioms', (req, res, next) => {
  res.send(template({ background: Idiom.randomImage(), author: Idiom.randomAuthor(), idiom: Idiom.randomIdiom() }));
});

app.listen(PORT, () => {
  console.info(`Listening on port ${ PORT }`);
});
