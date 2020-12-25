const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')
const hashMaker = require('../utils/hashFactory')
const logger = require('knoblr')
const path = require('path')
const fs = require('fs')

module.exports = (params) => {
    const [key] /*was key,saveLocation */ = params
    const searchKey = hashMaker.generateHashFrom(key)
    //const resolvedLocation = path.resolve(saveLocation)

    //if there is the searchKey on the fileList then call saveFileToDisk
    if (global.fileList[searchKey]){
      return saveFileToDisk(searchKey /*, resolvedLocation*/)
    } 

    if (global.nextNode.ip) {
      return outSocket.sendCommandTo(
        //send retrieve message to next node
        global.nextNode.ip,
        global.nextNode.port,
        messageCommand.DELETE,
        outSocket.createCommandPayload(messageCommand.DELETE)(searchKey,/*, resolvedLocation,*/ {
          //inside the retrieve message we include our infos so that the node who has the key can send us the info
          ip: global.ADDRESS,
          port: global.PORT,
          id: global.myId
        })
      )
    }

    // If there is only one node in the network
    saveFileToDisk()
}


function saveFileToDisk (searchKey/*, saveLocation*/) {
  if (!global.fileList[searchKey]) return logger.error(`Could not find searched key`)

  logger.info('Key exists locally. Deleting...')
  delete global.fileList[searchKey]
  logger.info("Deleted.");
  //fs.writeFileSync(saveLocation, fileContents)
  //logger.info(`File saved at '${saveLocation}'`)
}
