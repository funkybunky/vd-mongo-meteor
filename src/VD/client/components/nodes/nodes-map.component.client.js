'use strict'

import React, { Component } from 'react'
import _ from 'lodash' // not found by flow, because node_modules is ignored
/* @flow */

import NodeItem from './node-item.component.client.js'
import NodeBorder from './node-border.component.client.js'
import NodeConnector from './node-connector.component.client.jsx'

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

  getBorders (raster: Object, nodes: Array<Object>, links: Array<Object>): Array<MinMaxPos> {
    return _.compact(nodes.map((node) => {
      return this.getBorderPos(node._id, raster, nodes, links)
    }))
  }

  getFirstChildren (raster: Object, nodes: Array<Object>, links: Array<Object>): Array<String> {
    return _.compact(nodes.map((node) => {
      const childrenIds = this.getChildrenIds(node._id, nodes, links)
      if (childrenIds.length > 0) {
        return childrenIds[0]
      }
    }))
  }

  render () {
    if (this.props.loading) {
      return (
        <div>Loading...</div>
      )
    } else {
      const { raster, nodes, links } = this.props

      const borders = this.getBorders(raster, nodes, links)

      const getNodeById = (id) => {
        return nodes.reduce((wantedNode, node) => {
          if (node._id === id) return node
          return wantedNode
        })
      }

      const drawBorders = () => {
        return borders.map((border) => {
          return <NodeBorder key={JSON.stringify(border)} border={border} />
        })
      }

      const drawParentChildConnectors = () => {
        // const bla = this.getFirstChildren()
        // debugger
        return this.getFirstChildren(raster, nodes, links).map((childId) => {
          const pos = raster.getNodePos(childId)
          return <NodeConnector key={childId} x={pos.x} y={pos.y} />
        })
      }
      // const firstChildren = this.getFirstChildren(raster, nodes, links)

      return (
        <div style={{position: 'relative'}}>

          {drawBorders()}

          {drawParentChildConnectors()}

          {raster.keys().map((position) => {
            const nodeId = raster.get(position.x, position.y)
            const node = getNodeById(nodeId)
            return <NodeItem
              key={nodeId}
              currentNode={node}
              x={position.x}
              y={position.y}
              //isFirstChild={firstChildren.includes(nodeId)}
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
