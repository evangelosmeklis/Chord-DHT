const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')
const hashMaker = require('../utils/hashFactory')
const logger = require('knoblr')
const fs = require('fs')
const path = require('path')

module.exports = (params) => {
  const [key, filePath] = params
  logger.info(`Sending '${key}' to be stored`)
  const hashKey = hashMaker.generateHashFrom(key) //hashes the key
  try {
    const fileContent = filePath.toString('base64') //was previously fs.readFileSync(path.resolve(filePath)).toString('base64')
    if (global.nextNode.ip) {
      //send STORE message to next node
      console.log(outSocket.createCommandPayload(messageCommand.STORE)(hashKey, fileContent))
      outSocket.sendCommandTo(
        global.nextNode.ip,
        global.nextNode.port,
        messageCommand.STORE,
        outSocket.createCommandPayload(messageCommand.STORE)(hashKey, fileContent)
      )
    } else {
      global.fileList[hashKey] = fileContent
    }
  } catch (e) {
    logger.error('This file could not be found')
  }
}
