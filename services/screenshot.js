'use strict'

const webshot = require('webshot')

exports.default = screenshot

function screenshot (id, width = 1024, height = 768) {
  return webshot(`http://localhost:3000/${ id }`, {
    screenSize: {
      width,
      height,
    },
  })
    // .pipe(fs.createWriteStream('myscreenshot.jpg'))
}
