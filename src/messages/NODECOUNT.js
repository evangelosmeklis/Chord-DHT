const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')

module.exports = (params) => {
  global.weare = params.weare
  //The node that received the transfer info informs the node that sent them that the transfer was successful and the sender can now delete the pair
  var zifirst = params.thefirst //get the first
  var zitimes = params.times
  var change = false


  if (params.thefirst == global.myId){ //if we made a full circle just print the contents gathered
    if (zitimes>0){
      console.log("We are " + global.weare +" nodes in the network now.")
      change =true
      zitimes=zitimes+1
      return
    }
  }
  else console.log("We are " + global.weare + " nodes in the network now.")

  //for every key,value pair in the fileList of the node, put them inside contents
  if (global.nextNode.ip && change==false) {
      return outSocket.sendCommandTo(
        //send retrieve message to next node
        global.nextNode.ip,
        global.nextNode.port,
        messageCommand.NODECOUNT,
        outSocket.createCommandPayload(messageCommand.NODECOUNT)(zifirst,zitimes,params.weare)
      )
  }
}
