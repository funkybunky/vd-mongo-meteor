/* @ flow */

export default (props) => {
  return (
    <div style={{
      position: 'absolute',
      top: (props.y * 50) + 15,
      left: (props.x * 110) - 20,
      height: 6,
      width: 20,
      backgroundColor: 'black',
    }}></div>
  )
}
