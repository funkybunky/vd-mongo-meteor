import React, { Component } from 'react'

import NodeItem from './node-item.component.client.js'

// Takes raster
export default class NodesMap extends Component {
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
