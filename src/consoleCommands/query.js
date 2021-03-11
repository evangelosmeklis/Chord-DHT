const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')
const hashMaker = require('../utils/hashFactory')
const logger = require('knoblr')
const path = require('path')
const fs = require('fs')

module.exports = (params) => {
  key = ""
  for (i=0;i<params.length;i++){
    if (i==0) key = key + params[i]
    else key = key + " " + params[i] 
  }
  //console.log(key)
  // print everything that is on the current node
  if (key == "*") {
    contents = []
    
    for (let info in global.fileList){
      contents.push(global.fileList[info])
    }

    //next node has to do the same
    if (global.nextNode.ip) {
      thefirst = global.myId
      times = 1
      //we use the first and contents variables. The first is used for the system to know that it has made a full circle when it finds the first id again
      //the contents is to keep all the contents in the array to return them to the first node that made the query with *
      return outSocket.sendCommandTo(
        //send retrieve message to next node
        global.nextNode.ip,
        global.nextNode.port,
        messageCommand.RETRIEVEALL,
        outSocket.createCommandPayload(messageCommand.RETRIEVEALL)(thefirst,times,contents,global.ADDRESS,global.PORT,global.myId)
      )
    }
    else {
      for (let info in contents){
        console.log(contents[info])
      }
    }
  }

  else {
    const searchKey = hashMaker.generateHashFrom(key)
    //console.log(searchKey)
    //if there is the searchKey on the fileList then call saveFileToDisk
    if (global.fileList[searchKey] && (global.type==1 || global.replication==1)){
      return saveFileToDisk(searchKey)
    } 
  
    var r = 0
    if (global.myId == global.bootstrap) r = 1

    if (global.nextNode.ip) {
      return outSocket.sendCommandTo(
        //send retrieve message to next node
        global.nextNode.ip,
        global.nextNode.port,
        messageCommand.RETRIEVE,
        outSocket.createCommandPayload(messageCommand.RETRIEVE)(searchKey,global.replication,0,global.type,r,global.ADDRESS,global.PORT,global.myId)
      )
    }
    else saveFileToDisk(searchKey) //only one node in the network
  }
}

function saveFileToDisk (searchKey) {
  if (!global.fileList[searchKey]) return logger.error(`Could not find searched key`)

  logger.info('Key exists locally. Retrieving...')
  const fileContents = global.fileList[searchKey]
  logger.info(fileContents);
}
