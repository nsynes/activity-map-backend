const path = require('path')
const fs = require('fs')
const morgan = require('morgan')
const rfs = require('rotating-file-stream')

const logDirectory = path.join(__dirname, 'log')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
const accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory
})

module.exports = morgan('combined', {stream: accessLogStream})
