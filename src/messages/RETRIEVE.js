const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')
const logger = require('knoblr')

module.exports = (params) => {
  const keyChecksum = parseInt(params.key, 16)
  const idChecksum = parseInt(global.myId, 16)
  const nextIdChecksum = global.nextNode.id ? parseInt(global.nextNode.id, 16) : 0 //if we have a next node then get id else put 0

  //Based on the store method, if the key minus my id is greated than the next difference then I must not have it
  //else I must have it.
  if (Math.abs(keyChecksum - idChecksum) >= Math.abs(nextIdChecksum - idChecksum)) {
    outSocket.sendCommandTo(
      global.nextNode.ip,
      global.nextNode.port,
      messageCommand.RETRIEVE,
      outSocket.createCommandPayload(messageCommand.RETRIEVE)(params.key, params.saveLocation, params.sender)
    )
  } else {
    if (!global.fileList[params.key]) {
      // If the pair is not in this node, send message that it was not found
      return outSocket.sendCommandTo(params.sender.ip, params.sender.port, messageCommand.NOT_FOUND, {})
    }
    //if the node has the pair then send the info back to the sender
    outSocket.sendCommandTo(
      params.sender.ip,
      params.sender.port,
      messageCommand.FOUND,
      outSocket.createCommandPayload(messageCommand.FOUND)(params.key, global.fileList[params.key], params.saveLocation)
    )
  }
}
