'use strict'

const webshot = require('webshot')
const path = require('path')

exports.default = screenshot

function screenshot (id, width = 1024, height = 768, res) {
  return webshot(`http://localhost:3000/${ id }`, {
    screenSize: {
      width,
      height,
    },
    streamType: 'jpg',
    phantomPath: path.join(__dirname, '../vendor/phantomjs/bin/phantomjs'),
  }, (err, stream) => {
    if (err) {
      console.error(err)
      res.status(500).send({
        message: err.message || 'PhantomJS failed to render',
      })
    }
    stream.pipe(res)
  })
    // .pipe(fs.createWriteStream('myscreenshot.jpg'))
}
