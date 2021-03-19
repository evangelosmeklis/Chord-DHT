const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')

module.exports = (params) => {
  if (!global.previousNode.ip && !global.nextNode.ip) {
    require('../messages/LEAVE_ACK')()
  }
  if (params.leavingNode.ip){
    outSocket.sendCommandTo(
      params.leavingNode.ip,
      params.leavingNode.port,
      messageCommand.LEAVE_ACK, //send the node that is leaving the permission to leave
      outSocket.createCommandPayload(messageCommand.LEAVE_ACK)()
    )
  }

  // if there are two nodes in the network then we have to make the current node point to itself
  if (params.newPreviousNode.id === global.myId) {
    global.previousNode = { id: null, ip: null, port: null }
    global.nextNode = { id: null, ip: null, port: null }
    return
  }
  //console.log("Reached this.")
  global.previousNode = params.newPreviousNode

  global.weare = global.weare -1
  if (global.nextNode.ip){
    outSocket.sendCommandTo(
      //Informs other nodes of the current number of nodes
      global.nextNode.ip,
      global.nextNode.port,
      messageCommand.NODECOUNT,
      outSocket.createCommandPayload(messageCommand.NODECOUNT)(0,global.weare)
      )
  }
  else {
    console.log("We are " + global.weare + "in the network")
  }
  //console.log("Reached this vol2.")
  if (params.newPreviousNode.ip){
    outSocket.sendCommandTo( //inform the previous node (of the node that left) that its next node is gone
      params.newPreviousNode.ip,
      params.newPreviousNode.port,
      messageCommand.NODE_GONE,
      outSocket.createCommandPayload(messageCommand.NODE_GONE)()
    )
  }
  //console.log("Reached this vol3.")
  if (global.nextNode.ip){
    ncontents = []
      //The files that are no longer supposed to be here (because of the way that the key,value pairs are stored) should go were they are supposed to be
      outSocket.sendCommandTo(
        global.nextNode.ip,
        global.nextNode.port,
        messageCommand.REDISTR,
        outSocket.createCommandPayload(messageCommand.REDISTR)(0,0,ncontents,global.ADDRESS,global.PORT,global.myId)
      )
  }
  //console.log("Reached this vol4.")
}
