const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')
const hashMaker = require('../utils/hashFactory')
const logger = require('knoblr')
const fs = require('fs')
const path = require('path')

module.exports = (params) => {
  //console.log(params.length)
  var value = ""
  var key = params[params.length-1]
  for (i=0; i<params.length-1; i++){
    if (i==params.length-2){
      params[i] = params[i].split(',')[0]
    }
    if (i==0) {
      value = value + params[i]
    }
    else value = value + " " + params[i]
  }
  temp = key
  key = value
  value = temp
  replication = global.replication
  logger.info(`Sending '${key}' to be stored`)
  const hashKey = hashMaker.generateHashFrom(key) //hashes the key
    const val = value.toString('base64') //was previously fs.readFileSync(path.resolve(filePath)).toString('base64')
    if (global.nextNode.ip) {
      //send STORE message to next node
      //console.log(outSocket.createCommandPayload(messageCommand.STORE)(hashKey, val))
      //console.log('it went in here on insert.js')
      //console.log("next node")
      //console.log(global.nextNode)
      console.log(replication)
      outSocket.sendCommandTo(
        global.nextNode.ip,
        global.nextNode.port,
        messageCommand.STORE,
        outSocket.createCommandPayload(messageCommand.STORE)(hashKey, val,replication,global.type,global.ADDRESS,global.PORT,global.myId)
      )
    } 
    
    else { //if I am alone send myself the ack so I can print
      global.fileList[hashKey] = val
      outSocket.sendCommandTo(
        global.ADDRESS,
        global.PORT,
        messageCommand.STORE_ACK,
        outSocket.createCommandPayload(messageCommand.STORE_ACK)(hashKey, val,replication, global.ADDRESS,global.PORT,global.myId)
      )
    }
}
