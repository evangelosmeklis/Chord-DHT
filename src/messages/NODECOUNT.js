const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')

module.exports = (params) => {
  var reached = 0
  if (global.myId == global.bootstrap || params.reached == 1){
    reached = 1
  }

  if (reached == 1){ //if we made a full circle just print the contents gathered
    global.weare = params.weare 
    console.log("We are " + global.weare + " nodes in the network now.")
    if (global.nextNode.ip && global.nextNode.id != global.bootstrap){
     //console.log(global.myId,global.nextNode.id,global.bootstrap)
      outSocket.sendCommandTo(
        //Informs other nodes of the current number of nodes
        global.nextNode.ip,
        global.nextNode.port,
        messageCommand.NODECOUNT,
        outSocket.createCommandPayload(messageCommand.NODECOUNT)(reached,global.weare)
        )
      }
  }
  else if (global.nextNode.ip) {
    //console.log(global.myId,global.nextNode.id,global.bootstrap)
    outSocket.sendCommandTo(
      //Informs other nodes of the current number of nodes
      global.nextNode.ip,
      global.nextNode.port,
      messageCommand.NODECOUNT,
      outSocket.createCommandPayload(messageCommand.NODECOUNT)(reached,params.weare)
      )
  }
  else {
    console.log("wtf")
  }
}
