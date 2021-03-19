const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')

module.exports = (params) => {
  var reached = 0
  if (global.myId == global.bootstrap || global.reached == 1){
    var reached = 1
  }

  if (reached == 1){ //if we made a full circle just print the contents gathered
    global.weare = params.weare 
    console.log("We are " + global.weare + " nodes in the network now.")
  }
  else if (global.nextNode.ip) {
    outSocket.sendCommandTo(
      //Informs other nodes of the current number of nodes
      global.nextNode.ip,
      global.nextNode.port,
      messageCommand.NODECOUNT,
      outSocket.createCommandPayload(messageCommand.NODECOUNT)(reached,global.weare)
      )
  }
}