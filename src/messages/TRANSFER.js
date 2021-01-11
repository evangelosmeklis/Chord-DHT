const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')

module.exports = (params) => {
  tr = true;
  if (global.fileList[params.key]){ 
    //console.log(global.fileList[params.key])
    tr = false //if we already have the file due to replicas then we must return and not send transfer ack
  }
  else {
    //console.log(tr)
    //console.log(params.forep)
    global.fileList[params.key] = params.value
  }
  //The node that received the transfer info informs the node that sent them that the transfer was successful and the sender can now delete the pair
  if (tr && params.forep==0){
    outSocket.sendCommandTo(
      params.senderip,
      params.senderport,
      messageCommand.TRANSFER_ACK,
      outSocket.createCommandPayload(messageCommand.TRANSFER_ACK)(params.key)
    )
  }
}
