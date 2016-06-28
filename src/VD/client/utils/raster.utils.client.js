// Mapping of 2-dimensional grid to Node IDs
// It doens't link to the full node objects (not denormalized), because I would
// have duplicate node data then. For one the stuff from the DB and the other
// part in this raster mapping
// All the logic is in this raster. Meaning, decide which node to show if there
// are conflicting nodes at the same spot. Alogrithm defines it and stores
// that decision in the raster.
export default (function () {
  // private
  const store = {}
  const visibility = {} // maps node ID to true/false
  function serialize(x, y) {
    return x.toString() + 'x' + y.toString()
  }

  // public
  function getNodeByPos(x, y) {
    return store[serialize(x, y)]
  }
  function set(x, y, id) {
    if (getNodeByPos(x, y)) {
      // If there already is a node, we log for now
      console.log('already a node at this place, overwriting..')
      // throw new Error('already a node at this place!')
    }
    store[serialize(x, y)] = id
    return true
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
