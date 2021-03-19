const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')

module.exports = (params) => {
  const idChecksum = parseInt(global.myId, 16)
  const ingressNodeChecksum = parseInt(params.id, 16)
  const nextNodeChecksum = global.nextNode.id ? parseInt(global.nextNode.id, 16) : 0
  //if the id of the joining node is closer to mine then inform the node that is going in that it is getting put behind me
  if (
    Math.abs(idChecksum - ingressNodeChecksum) > Math.abs(nextNodeChecksum - ingressNodeChecksum) ||
    !global.previousNode.ip
  ) {
    global.weare = global.weare + 1 
    if (global.weare == 2){ //giname dio ara eimai o bootstrap
      global.bootstrap = global.myId
    } 
   
    outSocket.sendCommandTo(
      //It informs the node that wants to join that it can join
      params.nodeAddress,
      params.nodePort,
      messageCommand.JOIN_ACK,
      outSocket.createCommandPayload(messageCommand.JOIN_ACK)(global.replication,global.type,global.weare,global.bootstrap)
    )

    
    //if the current node has a node behind it then it informs it that its next node is going to be the one that just joined the network
    if (global.previousNode.ip) {
      outSocket.sendCommandTo(
        //sends the NEW NODE message to the predecessor
        global.previousNode.ip,
        global.previousNode.port,
        messageCommand.NEW_NODE,
        outSocket.createCommandPayload(messageCommand.NEW_NODE)(params.nodeAddress, params.nodePort, params.id)
      )
    }

    //if I am alone in the network then the node that just joined becomes my successor
    if (!global.nextNode.ip) {
      global.nextNode = {
        ip: params.nodeAddress,
        port: params.nodePort,
        id: params.id
      }
    }

    //The node that just entered becomes my previous node
    global.previousNode = {
      ip: params.nodeAddress,
      port: params.nodePort,
      id: params.id
    }

    
    //console.log(global.weare-1)
    //console.log(global.replication)
    if (global.weare-1 < global.replication){ //if the number of nodes in the network is less than the replicas needed, then we need to transfer all 
                                        //the files to the new nodes so that the replicas number is met
      //console.log("Helooo")
      for (let fileHashName in global.fileList) {
        outSocket.sendCommandTo(
            params.nodeAddress,
            params.nodePort,
            messageCommand.TRANSFER,
            outSocket.createCommandPayload(messageCommand.TRANSFER)(fileHashName, global.fileList[fileHashName],1,global.ADDRESS,global.PORT,global.myId)
        )
      }
    }
    ncontents = []
    //The files that are no longer supposed to be here (because of the way that the key,value pairs are stored) should go were they are supposed to be
     outSocket.sendCommandTo(
        params.nodeAddress,
        params.nodePort,
        messageCommand.REDISTR,
        outSocket.createCommandPayload(messageCommand.REDISTR)(0,0,ncontents,global.ADDRESS,global.PORT,global.myId)
      )
      outSocket.sendCommandTo(
        //It informs the node that wants to join that it can join
        params.nodeAddress,
        params.nodePort,
        messageCommand.NODECOUNT,
        outSocket.createCommandPayload(messageCommand.NODECOUNT)(0,global.weare)
      )
  } else {
    // This goes up to the original if and what it does is that if the difference in the hashes is not what we want,we push the join message to our next node
    outSocket.sendCommandTo(
      global.nextNode.ip,
      global.nextNode.port,
      messageCommand.JOIN,
      outSocket.createCommandPayload(messageCommand.JOIN)(params.nodeAddress, params.nodePort)
    )
  }
}
