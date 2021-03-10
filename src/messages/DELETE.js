const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')
const logger = require('knoblr')

module.exports = (params) => {
  const keyChecksum = parseInt(params.key, 16)
  const idChecksum = parseInt(global.myId, 16)
  const nextIdChecksum = global.nextNode.id ? parseInt(global.nextNode.id, 16) : 0 //if we have a next node then get id else put 0

  //Based on the store method, if the key minus my id is greated than the next difference then I must not have it
  //else I must have it.
  if (Math.abs(keyChecksum) >= Math.abs(nextIdChecksum)) {
    outSocket.sendCommandTo(
      global.nextNode.ip,
      global.nextNode.port,
      messageCommand.DELETE,
      outSocket.createCommandPayload(messageCommand.DELETE)(params.key, params.senderip,params.senderport,params.senderid)
    )
  } else {
    if (!global.fileList[params.key]) {
      // If the pair is not in this node, send message that it was not found
      return outSocket.sendCommandTo(params.senderip, params.senderport, messageCommand.NOT_FOUND, {})
    }
    else{
        if (params.replication <=1){
          logger.info("Song was found, deleting...")
          delete global.fileList[params.key]
          logger.info("Deleted.")
          outSocket.sendCommandTo(
              params.senderip,
              params.senderport,
              messageCommand.DELETE_ACK,
              outSocket.createCommandPayload(messageCommand.DELETE_ACK)(params.key, params.senderip,params.senderport,params.senderid)
            )
        }
        else {
          logger.info("Song was found, deleting...")
          delete global.fileList[params.key]
          logger.info("Deleted.")
          outSocket.sendCommandTo(
              global.nextNode.ip,
              params.nextNode.port,
              messageCommand.DELETE,
              outSocket.createCommandPayload(messageCommand.DELETE)(params.key,params.replication-1, params.senderip,params.senderport,params.senderid)
            )
        }
    }
  }
}
