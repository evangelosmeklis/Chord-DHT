module.exports = (params) => {
  console.log('-- DHT --')
  console.log('Available commands:')
  console.log(`
  -> insert <key> <value>: Stores <key> and <value> in the network
  -> delete <key> : Deletes the (key,value) pair from the network (to be made, not working currently)
  -> query <key> : Retrieves <key> from the network and prints the song
  -> depart: Leaves the network and closes the node
  -> overlay: Prints the network topology (to be made,not working currently)
  -> help: Shows this
  -> info: Shows node information
  -> debug: Toggle debug mode
  `)
}
