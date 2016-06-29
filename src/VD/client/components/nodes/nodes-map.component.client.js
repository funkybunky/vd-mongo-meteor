import React, { Component } from 'react'
import _ from 'lodash'

import NodeItem from './node-item.component.client.js'
import NodeBorder from './node-border.component.client.js'

// Takes raster
export default class NodesMap extends Component {
  getChildrenIds = (parentId: String, nodes, links) => {
    let childrenIds = []
    links.forEach((link) => {
      if (link.to === parentId) {
        childrenIds.push(link.from)
      }
    })
    debugger
    return childrenIds
  }
  getBorderPos = (parentId: String, raster, nodes, links) => {
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

  drawBorder = (borderPos) => {
    const nodesWidth = 110
    const nodesHeight = 50

  }

  render () {
    if (this.props.loading) {
      return (
        <div>Loading...</div>
      )
    } else {
      const raster = this.props.raster
      // console.log('keys: ', raster.keys())

      const testNode = this.props.nodes[2]
      console.log('checking node ', testNode.title)
      const border = this.getBorderPos(testNode._id, raster, this.props.nodes, this.props.links)
      console.log('border. ', border)

      const getNodeById = (id) => {
        return this.props.nodes.reduce((wantedNode, node) => {
          if (node._id === id) return node
          return wantedNode
        })
      }

      return (
        <div style={{position: 'relative'}}>
          <NodeBorder border={border} />
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
