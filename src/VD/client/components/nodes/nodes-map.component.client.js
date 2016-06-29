'use strict'

import React, { Component } from 'react'
import _ from 'lodash' // not found by flow, because node_modules is ignored
/* @flow */

import NodeItem from './node-item.component.client.js'
import NodeBorder from './node-border.component.client.js'

type MinMaxPos = [
  { x: Number, y: Number}
]
type Node = Object // TODO: declare it correclty in own file `types.js`
type Link = Object

// Takes raster
export default class NodesMap extends Component {
  getChildrenIds (parentId: String, nodes: Array<Node>, links:Array<Link>): Array<String> {
    let childrenIds = []
    links.forEach((link) => {
      if (link.to === parentId) {
        childrenIds.push(link.from)
      }
    })
    return childrenIds
  }
  getBorderPos (parentId: String, raster: Object, nodes: Array<Node>, links: Array<Link>): MinMaxPos {
    const childrenIds = this.getChildrenIds(parentId, nodes, links)
    if (childrenIds.length === 0) {
      console.log('no children')
      return false
    }
    const positions = childrenIds.map((id) => {
      return raster.getNodeById(id)
    })
    // is array of objects with props x, y
    console.log('positions: ', positions)
    // sort the objects
    // they should have the same x, if not throw here
    // just sort for y down

    // or I just need the minimum y and the maximum y, thats pretty easy without
    // sort
    const minY = _.minBy(positions, (pos) => pos.y)
      .y
    const maxY = _.maxBy(positions, (pos) => pos.y)
      .y

    const x = positions[0].x // We just take the first x, since all are the same

    const result = [
      { x: x, y: minY },
      { x: x, y: maxY }
    ]

    return result
  }

  // drawBorder = (borderPos) => {
  //   const nodesWidth = 110
  //   const nodesHeight = 50
  //
  // }

  getBorders (raster: Object, nodes: Array<Object>, links: Array<Object>): Array<MinMaxPos> {
    return _.compact(nodes.map((node) => {
      return this.getBorderPos(node._id, raster, nodes, links)
    }))
  }

  render () {
    if (this.props.loading) {
      return (
        <div>Loading...</div>
      )
    } else {
      const { raster, nodes, links } = this.props
      // console.log('keys: ', raster.keys())

      // const testNode = this.props.nodes[2]
      // console.log('checking node ', testNode.title)
      // const border = this.getBorderPos(testNode._id, raster, this.props.nodes, this.props.links)
      // console.log('border. ', border)

      const borders = this.getBorders(raster, nodes, links)

      const getNodeById = (id) => {
        return nodes.reduce((wantedNode, node) => {
          if (node._id === id) return node
          return wantedNode
        })
      }

      return (
        <div style={{position: 'relative'}}>
          {borders.map((border) => {
            <NodeBorder border={border} />
          })}

          {raster.keys().map((position) => {
            const nodeId = raster.get(position.x, position.y)
            const node = getNodeById(nodeId)
            return <NodeItem
              key={nodeId}
              currentNode={node}
              x={position.x}
              y={position.y}
              handleNewNode={this.props.handleNewNode} />
          })}
        </div>
      )
    }

    // return (
    //   this.props.loading ?
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
    // )
  }
}
