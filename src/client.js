'use strict'

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { ReactiveVar } from 'meteor/reactive-var';
import { createContainer } from 'meteor/react-meteor-data'

import NodesContainer from 'VD/client/components/nodes/nodes.container.client.js'

const data = [
  {
    id: 0,
    parent: null,
    title: 'Root',
    children: [ 1 ]
  },
  {
    id: 1,
    parent: 0,
    title: 'Jackson',
    children: [ 2, 3 ]
  },
  {
    id: 2,
    parent: 1,
    title: '1nd child Jack',
    children: []
  },
  { id: 3,
    parent: 1,
    title: '2nd child Jack',
    children: []
  },
  { id: 4,
    parent: 0,
    title: 'Peter',
    children: [ 5 ]
  },
  { id: 5,
    parent: 4,
    title: '1st child of Peter',
    children: []
  },
  { id: 6,
    parent: 4,
    title: '2nd child of Peter',
    children: []
  }
]

// Mapping of 2-dimensional grid to Node IDs
// It doens't link to the full node objects (not denormalized), because I would
// have duplicate node data then. For one the stuff from the DB and the other
// part in this raster mapping
// All the logic is in this raster. Meaning, decide which node to show if there
// are conflicting nodes at the same spot. Alogrithm defines it and stores
// that decision in the raster.
const raster = (function () {
  // private
  const store = {}
  function serialize(x, y) {
    return x.toString() + 'x' + y.toString()
  }

  // public
  function set(x, y, id) {
    store[serialize(x, y)] = id
    return true
  }
  function getNodeByPos(x, y) {
    return store[serialize(x, y)]
  }
  // TODO: add check in set() to see if there's already a node at this pos
  // add another func or a param flag to force a write anyway

  // Just outputs all node positions in an array
  function keys() {
    return Object.keys(store).map((keyStr) => {
        const strArray = keyStr.split('x') // gives ['12', '42']
        return { x: parseInt(strArray[0], 10), y: parseInt(strArray[1], 10) }
    })
  }

  // Outputs array of objects with x and y pos and the ID of the node that's
  // on that position
  function fetchAll() {
    return Object.keys(store).map((keyStr) => {
        const strArray = keyStr.split('x') // gives ['12', '42']
        const x = parseInt(strArray[0], 10)
        const y = parseInt(strArray[1], 10)

        return {
          x,
          y,
          id: getNodeByPos(x, y)
        }
    })
  }

  function getNodePos(id) {
    let pos = {}
    for (let data of fetchAll()) {
      if (data.id === id) {
        pos.x = data.x
        pos.y = data.y
      }
    }
    return pos
  }

  return {
    set,
    get: getNodeByPos,
    keys,
    fetchAll,
    getNodePos,
    getNodeById: getNodePos,
  }
}())

ReactDOM.render(<NodesContainer raster={raster} />, document.getElementById('root'))
