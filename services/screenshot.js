'use strict';

const path = require('path');
const webshot = require('webshot');

exports.default = screenshot;

function screenshot(id, width = 1024, height = 768) {
  return webshot(`http://localhost:3000/${ id }`, {
    phantomPath: path.resolve(__dirname, '../node_modules/phantomjs/bin/phantomjs'),
    screenSize: {
      width,
      height,
    },
  })
    // .pipe(fs.createWriteStream('myscreenshot.jpg'));
}
