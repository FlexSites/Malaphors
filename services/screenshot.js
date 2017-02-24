'use strict'

const screenshot = require('screenshot-stream')

exports.default = (id, width = 1024, height = 768, res) => {
  return screenshot(`https://idioms-today.herokuapp.com/${ id }`, `${ width }x${ height }`)
    .pipe(res)
}
