'use strict'

const express = require('express')
const Idiom = require('./services/idiom')
const pug = require('pug')
const json = require('body-parser').json
const dynamo = require('./services/Dynamo')
const screenshot = require('./services/screenshot').default
const uuid = require('uuid')

const template = pug.compileFile('index.pug')

const DEFAULT_PORT = 3000
const PORT = process.env.PORT || DEFAULT_PORT

const app = express()

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'f8b9b2cf-068b-4b25-adf9-2a35e34805a0' || uuid.v4()

console.info('ADMIN TOKEN', ADMIN_TOKEN)

app.use(express.static('client'))

function isLoggedIn (req) {
  return req.query.token === ADMIN_TOKEN
}

function authMiddleware (req, res, next) {
  if (isLoggedIn(req)) {
    return next()
  }
  const err = new Error('Unauthorized')
  err.status = 401
  next(err)
}

app.get('/', (req, res, next) => {

  res.send(template({
    admin: isLoggedIn(req),
    background: Idiom.randomImage(),
    author: Idiom.randomAuthor(),
    idiom: Idiom.randomIdiom(),
  }))
})

app.get('/random/:id?', (req, res, next) => {
  return dynamo.random(req.params.id, req.query.sort, req.query.reverse === 'true')
    .then(res.send.bind(res))
    .catch(next)
})

app.get('/preview/:id', (req, res, next) => {
  const stream = screenshot(req.params.id, parseInt(req.query.width || 0, 10), parseInt(req.query.height || 0, 10))
    .pipe(res)

  stream.on('error', next)
})

app.post('/', authMiddleware, json(), (req, res, next) => {
  return dynamo.create(req.body)
    .then(res.send.bind(res))
    .catch(next)
})

app.get('/:id', (req, res, next) => {
  return dynamo.get(req.params.id)
    .then((idiom) => {
      return res.send(template({ background: Idiom.randomImage(), author: Idiom.randomAuthor(), idiom: idiom.text }))
    })
    .catch(next)
})

app.use((err, req, res, next) => {
  const status = err.status || 500
  res
    .status(status)
    .send({ status, message: err.message || 'Internal Server Error' })
})

app.listen(PORT, () => {
  console.info(`Listening on port ${ PORT }`)
})
