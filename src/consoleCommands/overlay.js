const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')
const hashMaker = require('../utils/hashFactory')
const logger = require('knoblr')
const path = require('path')
const fs = require('fs')

module.exports = (params) => {
    var cnodesid = []
    var cnodesip = []
    var cnodesport = []
    cnodesid.push(global.myId)
    cnodesip.push(global.ADDRESS)
    cnodesport.push(global.PORT)

    if (global.nextNode.ip) {
      thefirst = global.myId
      times = 1
      return outSocket.sendCommandTo(
        //send overlay message to next node
        global.nextNode.ip,
        global.nextNode.port,
        messageCommand.OVERLAY,
        outSocket.createCommandPayload(messageCommand.OVERLAY)(thefirst,times,cnodesid,cnodesip,cnodesport,global.ADDRESS,global.PORT,global.myId)
      )
    }

}