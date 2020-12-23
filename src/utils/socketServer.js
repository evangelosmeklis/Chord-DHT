const net = require('net')
const getRandomInt = require('./getRandomInt')

/**
 * Create and return the TCP server
 */
function createServer () {
  return net.createServer()
}

function getPort () {
  return getRandomInt(3000, 65000)
}

module.exports = {
  createServer,
  getPort
}
