# Chord-DHT
Distributed Systems Course, implementation of Chord DHT in node.js

# Node DHT

> A simple Distributed Hash Table made in NodeJS

<!-- TOC -->

- [Node DHT](#node-dht)
  - [Introduction](#introduction)
    - [Installation](#installation)
    - [Running](#running)
  - [Files](#files)
  - [Commands](#commands)

<!-- /TOC -->

## Introduction

This is just an experiment as a coursework for Distributed Systems class on National Technical University of Athens. The goal is to implement a simple DHT using some defined rules:

- There must always be a ring of nodes, which every node has a pointer to the next one and another pointer to the previous one
- If a node is alone then it points to no one
- If there are only two nodes, then them both point to each other
- File retrieval must be routed through the ring until it finds the specified file and returns it to the sender, this differs from the original DHT implementation since it does not guarantee a _O(nlogn)_ search time
- To join the network, the node must know at least one other node which has already joined the network, otherwise it will create a new DHT.
- We are not assuming failures, all nodes work to perfection and grecefuly exits the network __at all times__.

### Installation

You need to have Node.js installed (newest edition, version 14 and after), see [Node's official website](http://nodejs.org).

After that, run `npm install` inside the folder

### Running

The main entrypoint is the `index.js` file. It accepts a single argument from the command line, the known hostlist, this will tell the node to connect to an existing network of other nodes. This list can be comma separated and the program will try to connect to each one of them, the first one to answer will be the entrypoint to the network.

If no nodes respond, a new network will be created.

- __Running as first node__: `node index.js replication X type Y`
- __Try to connect to an existing node__: `node index.js localhost:<port>` or `node index.js <ip_address>:<port>` 


## Protocol

Every node must contain 3 base informations:

- The next node
- The previous node
- The node ID

Previous and next nodes are objects with 3 properties: `ip`, `port` and `id`. The IP and port are String and Int respectively, the ID is a `sha1` hash computed on [hashFactory](./src/utils/hashFactory.js) using a fixed password and `ip:port` as base data.


```js
{
  port: Number,
  ip: String,
  id: String
}
```
## Files

The folder structure looks like the following:

- __src__: Contains all the source files
  - __config__: Contains the message strings to all commands
  - __consoleCommands__: That is the client side implementation of all the interactive commands the user can issue at the terminal, in short, the files here are what should happen if you issue a valid command
  - __messages__: Contains the implementation of all messages from the __receiver__ perspective (aKa, what should happen if I receive such message)
  - __utils__: Utility wrappers
  - __node.js__: Main node file, contains all definitions of a node

## Commands

When the node connects you can type `help` into the terminal to get a list of all available commands along with their params.

### insert<key><value> 

Inserts key value pair inside Chord 

### query<key>

Queries key inside Chord

### depart

Gracefully departs node

### delete<key>

Deletes key value pair from the Chord

### overlay

Gives an overview of the Chord network

### help

Explains all these commands


