import React from 'react'

export default class NodeBorder extends React.Component {
  render() {
    const start = this.props.border[0]
    const end = this.props.border[1]
    // debugger
    // const NODES_WIDTH = this.props.NODES_WIDTH
    // const NODES_HEIGHT = this.props.NODES_HEIGHT
    return (
      <div style={{
        position: 'absolute',
        top: (start.y * 50) - 2,
        left: (start.x * 110) - 2,
        height: ((end.y + 1) * 50) - 12,
        width: (89),
        border: 'solid 4px black',
        backgroundColor: '#eee',
        background: `repeating-linear-gradient(
          45deg,
          #606dbc,
          #606dbc 10px,
          #465298 10px,
          #465298 20px
        )`,      
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
