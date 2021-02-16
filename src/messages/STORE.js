const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')

module.exports = (params) => {
  const keyChecksum = parseInt(params.key, 16)
  const idChecksum = parseInt(global.myId, 16)
  const nextIdChecksum = global.nextNode.id ? parseInt(global.nextNode.id, 16) : 0 //this is a fail safe. If i have no next node then i put 0 so the 
  //difference below can become the lowest possible (I have to store the pair)

  // if the abs  value of the difference between my Id and the hashed key's is lower than the same difference of the next node, then I store it in me.
  // if not then I send the pair to the next node so this can be checked again. 
  if (Math.abs(idChecksum) <= Math.abs(nextIdChecksum)) {
    global.fileList[params.key] = params.value
    if (params.replication > 1 && params.type==0 ){ //if I have to replicate send a replication message that includes the sender so we can send the ACK
      //console.log("---I have to replicate---")
      //console.log("it went in here on store.js")
      outSocket.sendCommandTo(
        global.nextNode.ip,
        global.nextNode.port,
        messageCommand.REPLICATE,
        outSocket.createCommandPayload(messageCommand.REPLICATE)(params.key, params.value,params.replication-1,params.type,params.senderip,params.senderport,params.senderid))
    }
    else if (params.replication > 1 && params.type==1){ //if we have eventual-consistency we need to send the ack now
      outSocket.sendCommandTo(
        params.senderip,
        params.senderport,
        messageCommand.REPLICATE_ACK,
        outSocket.createCommandPayload(messageCommand.REPLICATE_ACK)(params.key, params.value,params.replication-1,params.type,global.ADDRESS,global.PORT,global.myId)
      )

      outSocket.sendCommandTo(
        global.nextNode.ip,
        global.nextNode.port,
        messageCommand.REPLICATE,
        outSocket.createCommandPayload(messageCommand.REPLICATE)(params.key, params.value,params.replication-1,params.type,params.senderip,params.senderport,params.senderid))
    }

    else { //if there is no replication needed we store it here and send the storing ack
      //console.log(params.sender)
      //console.log("it went in here 2 on store.js")
      //console.log(params.sender)
      //console.log(global.PORT)
      //console.log(params.replication)
      outSocket.sendCommandTo(
        params.senderip,
        params.senderport,
        messageCommand.STORE_ACK,
        outSocket.createCommandPayload(messageCommand.STORE_ACK)(params.key, params.value,params.replication-1,global.ADDRESS,global.PORT,global.myId))
    }

  } else { //if hashing is not according to criteria then the next node must store the pair
    outSocket.sendCommandTo(
      global.nextNode.ip,
      global.nextNode.port,
      messageCommand.STORE,
      outSocket.createCommandPayload(messageCommand.STORE)(params.key, params.value,params.replication,params.type,params.senderip,params.senderport,params.senderid)
    )
  }
}
