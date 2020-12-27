const logger = require('knoblr')
const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')

module.exports = (params) => {
  //if there is not a next node after this node, then it just leaves the network
  if (!global.nextNode.ip && !global.previousNode.ip) {
    process.exit(0)
  }
  //if there is a next node
  if (global.nextNode.ip) {
    let timeout = 0
    // if we have pairs in this node then we must send them to the next node
    if (Object.keys(global.fileList).length > 0) {
      // We set the time of exist, depending on the number of pairs that this node has
      timeout = Object.keys(global.fileList).length * 2000
      logger.info('Transfering files to next node')

      //for every pair in the fileList
      for (let fileHashName in global.fileList) {
        outSocket.sendCommandTo(
          global.nextNode.ip,
          global.nextNode.port,
          messageCommand.TRANSFER, //send TRANSFER message to the next node
          outSocket.createCommandPayload(messageCommand.TRANSFER)(fileHashName, global.fileList[fileHashName],global.ADDRESS,global.PORT,global.myId)
        )
      }
    }

    performExit()
  }
  logger.info(`Disconnecting...`)
}

function performExit () {
  logger.info('File transfer completed. Sending exit message to next node')
  // Send message to next node
  outSocket.sendCommandTo(
    global.nextNode.ip,
    global.nextNode.port,
    messageCommand.LEAVE, //send LEAVE message to my next node that contains the ip and port of my previous node
    outSocket.createCommandPayload(messageCommand.LEAVE)(global.previousNode)
  )
}
