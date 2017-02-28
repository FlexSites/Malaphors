'use strict'

const express = require('express')
const Idiom = require('./services/idiom')
const json = require('body-parser').json
const dynamo = require('./services/Dynamo')
const screenshot = require('./services/screenshot').default
const ADMIN_TOKEN = require('./constants').ADMIN_TOKEN
const DEFAULT_PORT = 3000
const PORT = process.env.PORT || DEFAULT_PORT
var path = require('path')
const favicon = require('serve-favicon')

const app = express()

app.set('view engine', 'pug')

app.use(favicon(path.join(__dirname, 'client', 'icons', 'favicon.ico')))
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
  res.render('index', {
    admin: false,
    background: Idiom.randomImage(),
    author: Idiom.randomAuthor(),
    idiom: Idiom.randomIdiom(),
  })
})

app.get('/admin', authMiddleware, (req, res, next) => {
  res.render('index', {
    admin: true,
    background: Idiom.randomImage(),
    author: Idiom.randomAuthor(),
    idiom: Idiom.randomIdiom(),
  })
})

app.get('/random/:id?', (req, res, next) => {
  return dynamo.random(req.params.id, req.query.sort, req.query.reverse === 'true')
    .then(res.send.bind(res))
    .catch(next)
})

app.get('/share/:id', authMiddleware, (req, res, next) => {
  return dynamo.get(req.params.id)
    .then((idiom) => {
      res.render('share', {
        background: Idiom.randomImage(),
        author: Idiom.randomAuthor(),
        idiom: idiom.text,
      })
    })
    .catch(next)
})

app.get('/preview/:id', (req, res, next) => {
  screenshot(req.params.id.replace(/\.jpg$/i, ''), parseInt(req.query.width || 0, 10), parseInt(req.query.height || 0, 10), res)
})

app.post('/', authMiddleware, json(), (req, res, next) => {
  return dynamo.create(req.body)
    .then(res.send.bind(res))
    .catch(next)
})

app.get('/:id', (req, res, next) => {
  return dynamo.get(req.params.id)
    .then((idiom) => {
      return res.render('index', {
        id: idiom.sort,
        background: Idiom.randomImage(),
        author: Idiom.randomAuthor(),
        idiom: idiom.text,
      })
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
