module.exports = (params) => {
  global.replication = params.replication
  console.log("Replication value: " + global.replication)
  global.type = params.type
  if (global.type == 0) thetype ="chain replication"
  else if (global.type == 1 ) thetype = "eventual consistency"

  console.log("Replication type: " + thetype)

  global.nextNode = params.nextNode
  global.previousNode = params.previousNode
}
