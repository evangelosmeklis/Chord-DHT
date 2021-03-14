const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')

module.exports = (params) => {
  if (!global.previousNode.ip && !global.nextNode.ip) {
    require('../messages/LEAVE_ACK')()
  }

  outSocket.sendCommandTo(
    params.leavingNode.ip,
    params.leavingNode.port,
    messageCommand.LEAVE_ACK, //send the node that is leaving the permission to leave
    outSocket.createCommandPayload(messageCommand.LEAVE_ACK)()
  )

  // if there are two nodes in the network then we have to make the current node point to itself
  if (params.newPreviousNode.id === global.myId) {
    global.previousNode = { id: null, ip: null, port: null }
    global.nextNode = { id: null, ip: null, port: null }
    return
  }

  global.previousNode = params.newPreviousNode

  outSocket.sendCommandTo( //inform the previous node (of the node that left) that its next node is gone
    params.newPreviousNode.ip,
    params.newPreviousNode.port,
    messageCommand.NODE_GONE,
    outSocket.createCommandPayload(messageCommand.NODE_GONE)()
  )

  ncontents = []
    //The files that are no longer supposed to be here (because of the way that the key,value pairs are stored) should go were they are supposed to be
    outSocket.sendCommandTo(
      global.nextNode.ip,
      global.nextNode.port,
      messageCommand.REDISTR,
      outSocket.createCommandPayload(messageCommand.REDISTR)(0,0,ncontents,global.ADDRESS,global.PORT,global.myId)
    )
}
