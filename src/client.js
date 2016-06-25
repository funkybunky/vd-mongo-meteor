'use strict'

import { ReactiveVar } from 'meteor/reactive-var';

import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Nodes from 'VD/collections/Nodes.collection.both.js'
import { createContainer } from 'meteor/react-meteor-data'

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
  function get(x, y) {
    return store[serialize(x, y)]
  }
  function keys() {
    return Object.keys(store).map((keyStr) => {
        const strArray = keyStr.split('x') // gives ['12', '42']
        return { x: parseInt(strArray[0], 10), y: parseInt(strArray[1], 10) }
    })
  }

  return {
    set,
    get,
    keys
  }
}())

raster.set(1,1,0)
raster.set(2,1,1)

const getNodeById = (id) => {
  //debugger
  let nodeById
  data.forEach((node) => {
    if (node.id === id) {
      nodeById = node
    }
  })
  return nodeById
  throw new Error('No node found! Halp! ID: ', id)
}

// Just takes x and y and renders a node at that given position
class NodeItem extends Component {
  render () {
    return (
      <div style={{position: 'absolute', top: (this.props.y * 40), left: (this.props.x * 40), display: 'inline-block'}}>
        <span>{this.props.currentNode.title}</span>
      </div>
    )
  }
}

// Takes raster
class NodesMap extends Component {
  render () {
    const raster = this.props.raster
    console.log('keys: ', raster.keys())
    // Iterate through raster and render a node
    if (this.props.loading === true) {
      return (
        <div>Loading...</div>
      )
    } else {
      return (
        <div style={{position: 'relative'}}>
          {/* We use reduce here, because there are.. hm.. no.  */}
          {raster.keys().map((position) => {
            const nodeId = raster.get(position.x, position.y)
            const node = getNodeById(nodeId)
            return <NodeItem key={nodeId} currentNode={node} x={position.x} y={position.y} />
          })}
        </div>
      )
    }
    // return (
    //   {this.props.loading ?
    //     <div>Loading...</div>
    //     :
    //     <div style={{position: 'relative'}}>
    //       {/* We use reduce here, because there are.. hm.. no.  */}
    //       {raster.keys().map((position) => {
    //         const nodeId = raster.get(position.x, position.y)
    //         const node = getNodeById(nodeId)
    //         return <NodeItem key={nodeId} currentNode={node} x={position.x} y={position.y} />
    //       })}
    //     </div>
    //   }
    // )
  }
}

const NodesContainer = createContainer((params) => {
  const createRaster = (nodes) => {
    return params.raster
  }
  const nodesHandle = Meteor.subscribe('allNodes')
  const loading = !nodesHandle.ready()
  const nodes = Nodes.find({}).fetch()
  const raster = createRaster(nodes)
  debugger
  return {
    loading,
    raster,
  }
}, NodesMap)

ReactDOM.render(<NodesContainer raster={raster} />, document.getElementById('root'))
