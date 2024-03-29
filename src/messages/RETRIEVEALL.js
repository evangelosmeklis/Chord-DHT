const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')
const logger = require('knoblr')

module.exports = (params) => {
    const keyChecksum = parseInt(params.key, 16)
    const idChecksum = parseInt(global.myId, 16)
    const nextIdChecksum = global.nextNode.id ? parseInt(global.nextNode.id, 16) : 0 //if we have a next node then get id else put 0

    var ncontents = params.contents //get contents from parameters
    var zifirst = params.thefirst //get the first
    var zitimes = params.times
    var change = false

    if (params.thefirst == global.myId){ //if we made a full circle just print the contents gathered
      if (zitimes>0){
        console.log("---Printing contents of all nodes :)---" )
        console.log("---Contents---")
        for (f in params.contents){ 
          console.log("Node ID: " + params.contents[f][0] + " data: " + params.contents[f][1])
        }
        change =true
        zitimes=zitimes+1
        return
      }
    }

    //for every key,value pair in the fileList of the node, put them inside contents
    if (change == false ){
      for (let info in global.fileList){
        ncontents.push([global.myId,global.fileList[info]])
      }
    }

    if (global.nextNode.ip && change==false) {
        return outSocket.sendCommandTo(
          //send retrieve message to next node
          global.nextNode.ip,
          global.nextNode.port,
          messageCommand.RETRIEVEALL,
          outSocket.createCommandPayload(messageCommand.RETRIEVEALL)(zifirst,zitimes,ncontents,global.ADDRESS,global.PORT,global.myId)
        )
    }
}
