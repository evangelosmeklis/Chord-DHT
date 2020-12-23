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
  } else {
    outSocket.sendCommandTo(
      global.nextNode.ip,
      global.nextNode.port,
      messageCommand.STORE,
      outSocket.createCommandPayload(messageCommand.STORE)(params.key, params.value)
    )
  }
}
