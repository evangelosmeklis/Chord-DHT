module.exports = (params) => {
  global.replication = params.replication
  global.nextNode = params.nextNode
  global.previousNode = params.previousNode
}
