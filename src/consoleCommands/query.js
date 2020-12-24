const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')
const hashMaker = require('../utils/hashFactory')
const logger = require('knoblr')
const path = require('path')
const fs = require('fs')

module.exports = (params) => {
  const [key] /*was key,saveLocation */ = params
  // print everything that is on the current node
  if (key == "*") {
    contents = []
    //console.log("---Printing contents of node---" )
    //console.log({ ip: global.ADDRESS, port: global.PORT, id: global.myId })
    //console.log("---Contents---")
    //next node has to do the same
    if (global.nextNode.ip) {
      thefirst = global.myId
      times = 0
      //we use the first and contents variables. The first is used for the system to know that it has made a full circle when it finds the first id again
      //the contents is to keep all the contents in the array to return them to the first node that made the query with *
      return outSocket.sendCommandTo(
        //send retrieve message to next node
        global.ADDRESS,
        global.PORT,
        messageCommand.RETRIEVEALL,
        outSocket.createCommandPayload(messageCommand.RETRIEVEALL)(thefirst,times,contents,/*, resolvedLocation,*/ {
          //inside the retrieve message we include our infos so that the node who has the key can send us the info
          ip: global.ADDRESS,
          port: global.PORT,
          id: global.myId
        })
      )
    }
  }

  else {
    const searchKey = hashMaker.generateHashFrom(key)
    //const resolvedLocation = path.resolve(saveLocation)

    //if there is the searchKey on the fileList then call saveFileToDisk
    if (global.fileList[searchKey]){
      return saveFileToDisk(searchKey /*, resolvedLocation*/)
    } 

    if (global.nextNode.ip) {
      console.log(global.ADDRESS)
      return outSocket.sendCommandTo(
        //send retrieve message to next node
        global.nextNode.ip,
        global.nextNode.port,
        messageCommand.RETRIEVE,
        outSocket.createCommandPayload(messageCommand.RETRIEVE)(searchKey,/*, resolvedLocation,*/ {
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
}

function saveFileToDisk (searchKey/*, saveLocation*/) {
  if (!global.fileList[searchKey]) return logger.error(`Could not find searched key`)

  logger.info('Key exists locally. Retrieving...')
  const fileContents = global.fileList[searchKey]//Buffer.from(global.fileList[searchKey], 'base64')
  logger.info(fileContents);
  //fs.writeFileSync(saveLocation, fileContents)
  //logger.info(`File saved at '${saveLocation}'`)
}
