// Mapping of 2-dimensional grid to Node IDs
// It doens't link to the full node objects (not denormalized), because I would
// have duplicate node data then. For one the stuff from the DB and the other
// part in this raster mapping
// All the logic is in this raster. Meaning, decide which node to show if there
// are conflicting nodes at the same spot. Alogrithm defines it and stores
// that decision in the raster.
export default function rasta (nodes, links, helpers, store) {
  // private
  const posToId = {} // maps pos to node ID, deprecated prolly
  store = store || {} // maps node ID to options
  function init (nodes) {
    nodes.forEach((node) => {
      // If there are values stored from the previous iteration, use those
      store[node._id] = store[node._id] || {}
      // store[node._id].showChildren = store[node._id].showChildren || true
    })
  }
  init(nodes)
  function serialize(x, y) {
    return x.toString() + 'x' + y.toString()
  }

  // public
  function getNodeByPos(x, y) {
    return posToId[serialize(x, y)]
  }
  function set(x, y, id) {
    if (helpers.isRoot(id, nodes, links)) {
      // if the root is node, we draw it no matter what
      posToId[serialize(x, y)] = id
      return true
    } else if (store[helpers.findParent(id, nodes, links)._id].showChildren === false) {
      // If parent has the option to not show its children, don't do it
      // get parent through a function here and check if it has that prop true
      store[id].isShown = false
      store[id].pos = [x, y]
      // debugger
    } else if (getNodeByPos(x, y)) {
      // If there already is a node, we don't show the current node
      console.log('already a node at this place, not drawing it. id: ', id)
      // throw new Error('already a node at this place!')
      store[id].isShown = false
      store[id].pos = [x, y]
      // Set its parent to not showChildren and call this whole function again
      const parent = helpers.findParent(id, nodes, links)
      store[parent._id].showChildren = false
      // debugger
      // If there is already a node, we check that node's parent:

      // Does it havet eh showChildren flag set? If it is set, we hide the
      // current node and also mkae the currentNode's parent showChildren =
      // false. This is our current behaviour.

      // TODO: But if the flag of the other parent is not set at all, but our
      // node says true, then go to the .. no .. then set the other node's
      // parent flag to false and re-run this rasta func

      // What if our node says show but also the other node says true? conflict!

      // Need a notion of currentAction. This should win everytime. Like when
      // there is a conflict.

      // TODO: Hm, no I need a log of actions. that's way better. The newer the
      // action the higher its value.

      // TODO: IF there are two conflicting information, look at the action log
      // and decide from there.
      return rasta(nodes, links, helpers, store)
    } else {
      posToId[serialize(x, y)] = id
      store[id].isShown = true
      return true
    }
  }

  // Just outputs all node positions in an array
  function keys() {
    return Object.keys(posToId).map((keyStr) => {
        const strArray = keyStr.split('x') // gives ['12', '42']
        return { x: parseInt(strArray[0], 10), y: parseInt(strArray[1], 10) }
    })
  }

  // Outputs array of objects with x and y pos and the ID of the node that's
  // on that position
  function fetchAll() {
    return Object.keys(posToId).map((keyStr) => {
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
    // console.log('getting pos of node: ', id)
    if (id === 'zxHn2DCPAREEQ5x4c') console.log(JSON.stringify(store, null, 2))
    if (store[id].isShown === false) return false
    let pos = {}
    for (let data of fetchAll()) {
      if (data.id === id) {
        pos.x = data.x
        pos.y = data.y
      }
    }
    return pos
  }

  function checkChildrenShown(parentId) {
    // console.log('store: ', store[parentId])
    return store[parentId].showChildren
  }

  return {
    set,
    get: getNodeByPos,
    keys,
    fetchAll,
    getNodePos,
    getNodeById: getNodePos,
    checkChildrenShown,
    helpers,
  }
}
