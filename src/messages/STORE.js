const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')

module.exports = (params) => {
  const keyChecksum = parseInt(params.key, 16)
  const idChecksum = parseInt(global.myId, 16)
  const nextIdChecksum = global.nextNode.id ? parseInt(global.nextNode.id, 16) : 0 //this is a fail safe. If i have no next node then i put 0 so the 
  //difference below can become the lowest possible (I have to store the pair)

  // if the abs  value of the difference between my Id and the hashed key's is lower than the same difference of the next node, then I store it in me.
  // if not then I send the pair to the next node so this can be checked again. 
  if (Math.abs(idChecksum - keyChecksum) <= Math.abs(nextIdChecksum - keyChecksum)) {
    global.fileList[params.key] = params.value
    if (params.replication > 1 ){ //if I have to replicate send a replication message that includes the sender so we can send the ACK
      outSocket.sendCommandTo(
        global.nextNode.ip,
        global.nextNode.port,
        messageCommand.REPLICATE,
        outSocket.createCommandPayload(messageCommand.REPLICATE)(params.key, params.value,params.replication-1,params.sender))
    }

    else { //if there is no replication needed we store it here and send the storing ack
      outSocket.sendCommandTo(
        params.sender.ip,
        params.sender.port,
        messageCommand.STORE_ACK,
        outSocket.createCommandPayload(messageCommand.STORE_ACK)(params.key, params.value,params.replication-1,
          {
            ip: global.ADDRESS,
            port: global.PORT,
            id: global.myId
          }))
    }

  } else { //if hashing is not according to criteria then the next node must store the pair
    outSocket.sendCommandTo(
      global.nextNode.ip,
      global.nextNode.port,
      messageCommand.STORE,
      outSocket.createCommandPayload(messageCommand.STORE)(params.key, params.value,params.sender)
    )
  }
}
