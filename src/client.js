'use strict'

import { ReactiveVar } from 'meteor/reactive-var';

import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Nodes from 'VD/collections/Nodes.collection.both.js'
import Links from 'VD/collections/Links.collection.both.js'
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

// Just takes x and y and renders a node at that given position
class NodeItem extends Component {
  render () {
    console.log('props to NodeItem: ',)
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

    const getNodeById = (id) => {
      return this.props.nodes.reduce((wantedNode, node) => {
        if (node._id === id) return node
        return wantedNode
      })
    }
    // Iterate through raster and render a node
    // if (this.props.loading === true) {
    //   return (
    //     <div>Loading...</div>
    //   )
    // } else {
    //   return (
    //     <div style={{position: 'relative'}}>
    //       {/* We use reduce here, because there are.. hm.. no.  */}
    //       {raster.keys().map((position) => {
    //         const nodeId = raster.get(position.x, position.y)
    //         const node = getNodeById(nodeId)
    //         return <NodeItem key={nodeId} currentNode={node} x={position.x} y={position.y} />
    //       })}
    //     </div>
    //   )
    // }
    return (
      this.props.loading ?
        <div>Loading...</div>
        :
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
}

const NodesContainer = createContainer((params) => {
  console.log('params: ', params)
  const raster = params.raster

  const createRaster = (nodes, links) => {
    console.log('da nodes: ', JSON.stringify(nodes, null, 2))
    console.log('links: ', JSON.stringify(links, null, 2))

    const findRoot = () => {
      // the root node is the one whose ID is in no link `from` field
      let rootId
      nodes.forEach((node) => {
        let isRoot = true
        links.forEach((link) => {
          if (link.from === node.Id) isRoot = false
        })
        if (isRoot === true) rootId = node._id
      })
      return rootId
    }

    // Returns children IDs
    const findChildren = (parentId) => {
      let children = []
      links.forEach((link) => {
        if (link.to === parentId) children.push(link._id)
      })
      return children
    }

    // Places an array of children IDs in the raster
    // returns the last y-position
    // TODO: make this function pure by passing in the raster and returning it
    const placeChildren = (parentId, childrenIds) => {
      const parentPos = raster.getNodePos(parentId)
      const childX = parentPos.x + 1

      let lastY = 0 // The space the grandchildren of the last child have taken

      for (let i = 0; i < childrenIds.length - 1; i++ ) {
        const childId = childrenIds[i]
        raster.set(childX, parentPos.y + i + lastY, childId)
        // TODO: check here if the child that just got set has itself children
        // and set those first, that function returns the amount of space (y)
        // that was needed by all the grandchildrne of that node so that the
        // other children can be pushed down/ continue that amount farther down
        const grandChildrenIds = findChildren(childId)
        if (childrenIds.length > 0) {
          lastY = placeChildren(childId, grandChildrenIds)
        }

      }
      return parentPos.y + childrenIds.length - 1
    }

    // find root node
    const rootId = findRoot()

    // place it in first pos: 0,0
    raster.set(0, 0, rootId)

    // find children: search through links, find those that link to that node
    const childrenIds = findChildren(rootId)

    // place children: x + 1, same y is the first child, others increase in y
    placeChildren(rootId, childrenIds)

    // find children of first child, iterate
    // already done in placeChildren()

  }
  const nodesHandle = Meteor.subscribe('allNodes', {
    onReady: (...squat) => {
      console.log('ready! args: ', ...squat)
    },
    onStop: (...whuut) => {
      console.log('errorz, stopped: ', ...whuut)
    }
  })
  const linksHandle = Meteor.subscribe('allLinks', {
    onReady: (...squat) => {
      console.log('ready! args: ', ...squat)
    },
    onStop: (...whuut) => {
      console.log('errorz, stopped: ', ...whuut)
    }
  })
  const loading = !nodesHandle.ready() || !linksHandle.ready()
  const nodes = Nodes.find({}).fetch()
  const links = Links.find({}).fetch()

  // const raster = createRaster(nodes, links)
  createRaster(nodes, links)

  return {
    loading,
    raster,
    nodes,
  }
}, NodesMap)

ReactDOM.render(<NodesContainer raster={raster} />, document.getElementById('root'))
