const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')
const logger = require('knoblr')

module.exports = (params) => {
  const keyChecksum = parseInt(params.key, 16)
  const idChecksum = parseInt(global.myId, 16)
  const nextIdChecksum = global.nextNode.id ? parseInt(global.nextNode.id, 16) : 0 //if we have a next node then get id else put 0
  //Based on the store method, if the key minus my id is greated than the next difference then I must not have it
  //else I must have it.
  var re = 0
  if (global.myId == global.boostrap || global.reachedb == 1) re =1 
  if (Math.abs(idChecksum) > Math.abs(nextIdChecksum) && params.force==0 && re==0) {
    outSocket.sendCommandTo(
      global.nextNode.ip,
      global.nextNode.port,
      messageCommand.RETRIEVE,
      outSocket.createCommandPayload(messageCommand.RETRIEVE)(params.key, params.replication,0, params.type,params.senderip,params.senderport,params.senderid)
    )
  } else {
    if (!global.fileList[params.key]) {
      // If the pair is not in this node, send message that it was not found
      return outSocket.sendCommandTo(params.senderip, params.senderport, messageCommand.NOT_FOUND, {})
    }
    //if the node has the pair then send the info back to the sender
    else if (params.replication<=1  && params.type == 0){
      outSocket.sendCommandTo(
        params.senderip,
        params.senderport,
        messageCommand.FOUND,
        outSocket.createCommandPayload(messageCommand.FOUND)(params.key, global.fileList[params.key],global.ADDRESS,global.PORT,global.myId)
      )
    }
    else if (params.type == 1){
      outSocket.sendCommandTo(
        params.senderip,
        params.senderport,
        messageCommand.FOUND,
        outSocket.createCommandPayload(messageCommand.FOUND)(params.key, global.fileList[params.key],global.ADDRESS,global.PORT,global.myId)
      )
    }
    //if I am not the last replica, we must find the last replicas
    else {
      outSocket.sendCommandTo(
        global.nextNode.ip,
        global.nextNode.port,
        messageCommand.RETRIEVE,
        outSocket.createCommandPayload(messageCommand.RETRIEVE)(params.key,params.replication-1,1,params.type,re,params.senderip,params.senderport,params.senderid)
      )
    }
  }
}
