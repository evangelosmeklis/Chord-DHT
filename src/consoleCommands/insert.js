const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')
const hashMaker = require('../utils/hashFactory')
const logger = require('knoblr')
const fs = require('fs')
const path = require('path')

module.exports = (params) => {
  const [key, filePath] = params
  replication = global.replication
  logger.info(`Sending '${key}' to be stored`)
  const hashKey = hashMaker.generateHashFrom(key) //hashes the key
  try {
    const fileContent = filePath.toString('base64') //was previously fs.readFileSync(path.resolve(filePath)).toString('base64')
    if (global.nextNode.ip) {
      //send STORE message to next node
      //console.log(outSocket.createCommandPayload(messageCommand.STORE)(hashKey, fileContent))
      outSocket.sendCommandTo(
        global.nextNode.ip,
        global.nextNode.port,
        messageCommand.STORE,
        outSocket.createCommandPayload(messageCommand.STORE)(hashKey, fileContent,replication,
          {
            ip: global.ADDRESS,
            port: global.PORT,
            id: global.myId
          })
      )
    } 
    
    else { //if I am alone send myself the ack so I can print
      global.fileList[hashKey] = fileContent
      outSocket.sendCommandTo(
        global.ADDRESS,
        global.PORT,
        messageCommand.STORE_ACK,
        outSocket.createCommandPayload(messageCommand.STORE_ACK)(hashKey, fileContent,replication,
          {
            ip: global.ADRESS,
            port: global.PORT,
            id: global.myId
          })
      )
    }
  } catch (e) {
    logger.error('This file could not be found')
  }
}
