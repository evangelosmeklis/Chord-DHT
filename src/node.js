const hashMaker = require('./utils/hashFactory')
const commandMessages = require('./config/messageStrings')
const inSocket = require('./utils/socketServer')
const outSocket = require('./utils/socketClient')
const logger = require('knoblr')

// Node Properties
global.ADDRESS = '127.0.0.1'
global.PORT = inSocket.getPort() // The current PORT that our node is in
global.fileList = {} //It will store the file list in a form of dictionary (key,value)
global.myId = hashMaker.generateHashFrom(`${global.PORT}:${global.ADDRESS}`) //creates the node Id
global.nextNode = { ip: null, port: null, id: null } // Creates the next node reference
global.previousNode = { ip: null, port: null, id: null } // Creates the previous node reference
global.stats = {}
global.DEBUG = 0

/**
 * Tries to connect to the first node on the network
 * @param {{nodeAddress: string, nodePort: number}[]} nodeList The list of the known nodes on the network
 */
function connectToDHT (nodeList) {
  if (nodeList.length <= 0) {
    logger.info(`No nodes where found. Creating a new network`) // There are no nodes, so this is the first node on the DHT
    global.myId = hashMaker.generateHashFrom(
      (0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff).toString(16)
    )
    return setUpUser()
  }

  const handleConnectionError = (err) => {
    logger.error(
      `There was an error connecting to ${nodeToConnect.nodeAddress}:${nodeToConnect.nodePort}, sending to the next node...`
    )
    connectToDHT(nodeList) // Calls the function again with the least element
  }

  const nodeToConnect = nodeList.shift() // Removes the first element and returns
  outSocket.sendCommandTo(
    nodeToConnect.nodeAddress,
    nodeToConnect.nodePort,
    commandMessages.JOIN,
    outSocket.createCommandPayload(commandMessages.JOIN)(global.ADDRESS, global.PORT),
    handleConnectionError
  )
  setTimeout(setUpUser, 1500)
}

// Deals with sudden exits on a known event
function setUpExitProtocol () {
  process.on('SIGINT', () => process.exit(34)) // 34 is a random code that we use to define a sudden exit
  //A known exit event
  process.on('exit', (code) => {
    console.log() // New line after ctrl+C

    if (code === 34) {
      logger.info('Detecting exit')
      require('./consoleCommands/depart')() // Execute exit command
    }
  })
}

/**
 * Creates local connection for message interaction
 */
function setUpLocalTCPServer () {
  // Creates the TCP socket for this node
  const server = inSocket.createServer()
  server.listen(PORT, ADDRESS, () =>
    logger.info(`Server listening on ${server.address().address}:${server.address().port}`)
  )

  server.on('connection', (socket) => {
    //Opens the port to receive tcp messages
    socket.on('data', (data) => {
      // Handling event for incoming messages
      const message = JSON.parse(data.toString())
      global.stats[message.commandString] = (global.stats[message.commandString] || 0) + 1 //increases the count for this type of message
      if (global.DEBUG) console.log('### MESSAGE RECEIVED\n', message)
      require(`./messages/${message.commandString}`)(message.commandParams)
    })

    socket.on('close', () => {
      //When a client disconnects from this socket
    })
  })
}

/**
 * Shows the starting message
 */
function printWelcomeMessage () {
  console.log(`-- You're now connected to the DHT as ${global.myId} --`)
  console.log(`Type 'help' to see the list of available commands.`)
  process.stdout.write('> ')
}

/**
 * Prepares STDin to receive messages
 */
function openStdIn () {
  // Opens standard input for the user to interact with the system
  const stdIn = process.openStdin()
  stdIn.addListener('data', (input) => {
    const inStr = input.toString().replace(/\n$/, '')
    if (inStr.length >= 1) {
      const [commandString, ...params] = inStr.split(' ')
      switch (commandString) {
        case 'insert':
        case 'delete':
        case 'query':
        case 'help':
        case 'depart':
        case 'debug':
        case 'info':
          require(`./consoleCommands/${commandString}`)(params)
          break
        default:
          logger.error(`This command is not recognized, type 'help' for a list of available commands`)
          break
      }
    }
    process.stdout.write('> ')
  })
}

/**
 * Grouping fuctions that make the console usable for the user
 */
function setUpUser () {
  setUpExitProtocol()
  printWelcomeMessage()
  openStdIn()
}

/**
 * Point of enter
 * @param {{nodePort: number, nodeAddress: string}[]} nodeList List with the known connected nodes
 */
function start (nodeList) {
  try {
    setUpLocalTCPServer()
    connectToDHT(nodeList)
  } catch (error) {
    logger.error(error.message)
  }
}

module.exports = { start }
