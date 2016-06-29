import React from 'react'

export default class NodeBorder extends React.Component {
  render() {
    const start = this.props.border[0]
    const end = this.props.border[1]
    // const NODES_WIDTH = this.props.NODES_WIDTH
    // const NODES_HEIGHT = this.props.NODES_HEIGHT
    return (
      <div style={{
        position: 'absolute',
        top: (start.y * 50) - 2,
        left: (start.x * 110) - 2,
        height: ((end.y + 1) * 50) - 12,
        width: (89),
        border: 'solid 3px black'
      }}></div>
    )
  }
}


// export default () => {
//   return (
//     <div style={{
//       position: 'absolute',
//       top: (this.props.y * 50),
//       left: (this.props.x * 110),
//       height: (this.props.y * 50),
//       width: (this.props.x * 100),
//     }}></div>
//   )
// }
