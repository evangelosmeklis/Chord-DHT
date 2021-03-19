const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')

module.exports = (params) => {
  global.replication = params.replication
  console.log("Replication value: " + global.replication)
  global.type = params.type
  if (global.type == 0) thetype ="chain replication"
  else if (global.type == 1 ) thetype = "eventual consistency"

  console.log("Replication type: " + thetype)
  global.weare = params.weare
  console.log("We are now: " + global.weare + " nodes in the network")
  global.bootstrap = params.bootstrap
  console.log("Bootstrap node id: " + global.bootstrap)
  global.nextNode = params.nextNode
  global.previousNode = params.previousNode

}
