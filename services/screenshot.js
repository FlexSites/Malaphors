'use strict'

const webshot = require('webshot')
const path = require('path')

exports.default = screenshot

function screenshot (id, width = 1024, height = 768) {
  return webshot(`http://localhost:3000/${ id }`, {
    screenSize: {
      width,
      height,
    },
    streamType: 'jpg',
    phantomPath: path.join(__dirname, 'vendor/phantomjs/bin/phantomjs'),
  })
    // .pipe(fs.createWriteStream('myscreenshot.jpg'))
}
