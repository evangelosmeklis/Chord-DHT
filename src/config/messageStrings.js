module.exports = {
  JOIN: 'JOIN', // Entrance to the network (this message is sent by the node that wants to join the network)
  JOIN_ACK: 'JOIN_ACK', // Response to the join of network (Response from the node in the network responsible for the position of the new node)
  NEW_NODE: 'NEW_NODE', // Sent to the previous node to inform for the entrance of a new node
  NODE_GONE: 'NODE_GONE', // Sent to the previous node of the node that leaves the network to inform success
  RETRIEVE: 'RETRIEVE', // Sent to the network to retrieve a (key,value) pair
  RETRIEVEALL: 'RETRIEVEALL', // Sent to the network to retrieve all (key,value) pairs
  FOUND: 'FOUND', // Sent to the node that made the query to inform him that the pair has been found
  NOT_FOUND: 'NOT_FOUND', // Sent to the node that made the query to inform him that the pair has not been found
  TRANSFER: 'TRANSFER', // Request to move a (key,value) pair from one node to another
  TRANSFER_ACK: 'TRANSFER_ACK', // Response that a transfer has been completed succesfully and that the pair can be removed from the list
  STORE: 'STORE', // Request to store a pair in the network
  LEAVE: 'LEAVE', // Sends a message to the next node with the info of the previous node
  LEAVE_ACK: 'LEAVE_ACK', // Sent from the successor node, gives permission to leave the network
  DELETE: 'DELETE',// delete a key from your list
  DELETE_ACK: 'DELETE_ACK',// delete a key from your list
  OVERLAY: 'OVERLAY', //Prints the network topology 
}
