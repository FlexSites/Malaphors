'use strict'

const screenshot = require('screenshot-stream')

const ADMIN_TOKEN = require('../constants').ADMIN_TOKEN

exports.default = (id, width = 1024, height = 768, res) => {
  return screenshot(`https://idioms-today.herokuapp.com/share/${ id }?token=${ ADMIN_TOKEN }`, `${ width }x${ height }`)
    .pipe(res)
}
