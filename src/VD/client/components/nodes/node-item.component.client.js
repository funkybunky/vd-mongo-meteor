import React, { Component } from 'react'

// Just takes x and y and renders a node at that given position
export default class NodeItem extends Component {
  static propTypes = {
    currentNode: React.PropTypes.object.isRequired,
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired,
    handleNewNode: React.PropTypes.function.isRequired,
  }
  handleNodeClick = (event) => {
    event.preventDefault()
    const payload = {
      parentId: this.props.currentNode._id,
      title: this.props.currentNode.title + 'son',
      type: 'idea',
      linkType: 'answers',
    }
    this.props.handleNewNode(payload)
  }
  render () {
    // console.log('props to NodeItem: ',)
    return (
      <div
        style={
        {
          position: 'absolute',
          top: (this.props.y * 50),
          left: (this.props.x * 110),
          display: 'inline-block',
          backgroundColor: '#888',
          color: '#ddd',
          width: '90px',
          height: '40px',
          border: '1px solid #333',
        }
        }
        onClick={this.handleNodeClick}
      >
        <span>{this.props.currentNode.title}</span>
      </div>
    )
  }
}
