module.exports = (params) => {
  global.replication = params.replication
  console.log("Replication value: " + global.replication)
  global.nextNode = params.nextNode
  global.previousNode = params.previousNode
}
