const net = require('net')
const commandMessages = require('../config/messageStrings')
const { generateHashFrom } = require('./hashFactory')

/**
 * Converts messages to objects for Buffer so that we can send them as binary
 * @param {string|Object} message message to convert
 */
function _convert (message) {
  let innerMessage = null

  switch (typeof innerMessage) {
    case 'string':
      innerMessage = message.replace(/\n$/, '')
      break
    case 'object':
      innerMessage = Buffer.from(JSON.stringify(message))
      break
    default:
      innerMessage = Buffer.from(message)
      break
  }

  return innerMessage
}

function handleError (err) {
  throw err
}

/**
 *
 * @param {string} address Endereço do destinatário
 * @param {number} port Porta do destinatário
 * @param {string} command String do comando
 * @param {*} params Parâmetros do comando
 */
function sendCommandTo (address, port, command, params, errorCb = handleError) {
  const fullCommand = {
    commandString: command,
    commandParams: params
  }
  sendMessageTo(address, port, fullCommand, errorCb)
}

/**
 * Creates the data that will be send with the command
 * @param {string} command Command string
 */
function createCommandPayload (command) {
  switch (command) {
    case commandMessages.JOIN:
      return (address, port) => ({
        nodeAddress: address,
        nodePort: parseInt(port, 10),
        id: global.myId
      })
    case commandMessages.JOIN_ACK:
      return () => ({
        previousNode: {
          port: global.previousNode.port || global.PORT,
          ip: global.previousNode.ip || global.ADDRESS,
          id: global.previousNode.id || global.myId
        },
        nextNode: {
          port: global.PORT,
          ip: global.ADDRESS,
          id: global.myId
        }
      })
    case commandMessages.NEW_NODE:
      return (ingressAddress, ingressPort, ingressId) => ({
        ingressAddress,
        ingressPort,
        ingressId
      })
    case commandMessages.LEAVE:
      return (newPreviousNode) => ({
        leavingNode: {
          ip: global.ADDRESS,
          port: global.PORT,
          id: global.myId
        },
        newPreviousNode
      })
    case commandMessages.LEAVE_ACK:
      return () => ({})
    case commandMessages.NODE_GONE:
      return () => ({
        nextIp: global.ADDRESS,
        nextPort: global.PORT,
        nextId: global.myId
      })
    case commandMessages.TRANSFER:
      return (key, value, sender) => ({
        key,
        value,
        sender
      })
    case commandMessages.TRANSFER_ACK:
      return (key) => ({
        key
      })
    case commandMessages.STORE:
      return (key, value) => ({
        key,
        value
      })
    case commandMessages.RETRIEVE:
      return (key, saveLocation, sender) => ({
        key,
        saveLocation,
        sender
      })
    case commandMessages.FOUND:
      return (key, value, saveLocation) => ({
        key,
        value,
        saveLocation
      })
    case commandMessages.RETRIEVEALL:
      return (key, saveLocation, sender) => ({
          key,
          saveLocation,
          sender
        })
  }
}

/**
 * Send a message to a node
 * @param {string} address Receiver address
 * @param {number} port Receiver port
 * @param {string|Buffer} message Message to send
 */
function sendMessageTo (address, port, message, errorCb) {
  const client = new net.Socket()
  let innerMessage = _convert(message)

  client.on('error', errorCb)

  client.connect(port, address)
  client.write(innerMessage)
  client.end()
}

module.exports = {
  sendMessageTo,
  sendCommandTo,
  createCommandPayload
}
