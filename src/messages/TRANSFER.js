const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')

module.exports = (params) => {
  global.fileList[params.key] = params.value

  //The node that received the transfer info informs the node that sent them that the transfer was successful and the sender can now delete the pair
  outSocket.sendCommandTo(
    params.senderip,
    params.senderport,
    messageCommand.TRANSFER_ACK,
    outSocket.createCommandPayload(messageCommand.TRANSFER_ACK)(params.key)
  )
}
