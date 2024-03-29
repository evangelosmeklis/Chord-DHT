const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')
const hashMaker = require('../utils/hashFactory')
const logger = require('knoblr')
const path = require('path')
const fs = require('fs')

module.exports = (params) => {
    const [key] = params
    const searchKey = hashMaker.generateHashFrom(key)

    /* //if there is the searchKey on the fileList then call saveFileToDisk
    if (global.fileList[searchKey]){
      if (global.replication<=1) return saveFileToDisk(searchKey)
      else {
        logger.info('Key exists locally, but has other replicas too. Deleting...')
        delete global.fileList[searchKey]
        global.replication = global.replication - 1
      }
    } */


    if (global.nextNode.ip) {
      return outSocket.sendCommandTo(
        //send retrieve message to next node
        global.nextNode.ip,
        global.nextNode.port,
        messageCommand.DELETE,
        outSocket.createCommandPayload(messageCommand.DELETE)(searchKey,global.replication,0,0,global.ADDRESS,global.PORT,global.myId)
      )
    }
    else saveFileToDisk(searchKey)
}


function saveFileToDisk (searchKey) {
  if (!global.fileList[searchKey]) return logger.error(`Could not find searched key`)

  logger.info('Key exists locally. Deleting...')
  delete global.fileList[searchKey]
  logger.info("Deleted.");
}
