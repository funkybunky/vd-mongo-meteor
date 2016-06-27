import React, { Component } from 'react'

// Just takes x and y and renders a node at that given position
export default class NodeItem extends Component {
  render () {
    console.log('props to NodeItem: ',)
    return (
      <div style={{
          position: 'absolute',
          top: (this.props.y * 50),
          left: (this.props.x * 70),
          display: 'inline-block'}}>
        <span>{this.props.currentNode.title}</span>
      </div>
    )
  }
}
