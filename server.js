'use strict';

const express = require('express');
const Idiom = require('./services/idiom');
const pug = require('pug');
const json = require('body-parser').json;
const dynamo = require('./services/Dynamo');

const template = pug.compileFile('index.pug');

const DEFAULT_PORT = 3000;
const PORT = process.env.PORT || DEFAULT_PORT;

const app = express();

app.use(express.static('client'));

app.get('/', (req, res, next) => {

  res.send(template({
    background: Idiom.randomImage(),
    author: Idiom.randomAuthor(),
    idiom: Idiom.randomIdiom(),
  }));
});

app.post('/', json(), (req, res, next) => {
  return dynamo.create(req.body)
    .then(res.send.bind(res))
    .catch(next);
});

app.get('/random/:id?', (req, res, next) => {
  return dynamo.random(req.params.id, req.query.sort, req.query.reverse === 'true')
    .then(res.send.bind(res))
    .catch(next);
});

app.get('/preview/:id', (req, res, next) => {
  const stream = screenshot(req.params.id, parseInt(req.query.width || 0, 10), parseInt(req.query.height || 0, 10))
    .pipe(res);

  stream.on('error', next);
});

app.get('/:id', (req, res, next) => {
  return dynamo.get(req.params.id)
    .then((idiom) => {
      return res.send(template({ background: Idiom.randomImage(), author: Idiom.randomAuthor(), idiom: idiom.text }));
    })
    .catch(next);
});

app.listen(PORT, () => {
  console.info(`Listening on port ${ PORT }`);
});
