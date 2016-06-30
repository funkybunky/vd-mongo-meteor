import initRaster from './raster.utils.client.js'

export default (nodes, links) => {
  // console.log('da nodes: ', JSON.stringify(nodes, null, 2))
  // console.log('links: ', JSON.stringify(links, null, 2))

  const findParent = (childId, nodes, links) => {
    // nodes.reduce((node) => {})
    const linksToParent = links.filter((link) => link.from === childId)
    if (linksToParent.length === 0) throw new Error('No parent found!')
    const parents = nodes.filter((node) => node._id === linksToParent[0].to)
    if (parents.length === 0) throw new Error('No parent found!')
    return parents[0]
  }

  const findRoot = (nodes, links) => {
    // the root node is the one whose ID is in no link `from` field
    let rootId
    nodes.forEach((node) => {
      let isRoot = true
      links.forEach((link) => {
        if (link.from === node._id) isRoot = false
      })
      if (isRoot === true) {
        rootId = node._id
        // console.log('root: ', node.title)
      }
    })
    return rootId
  }

  const isRoot = (nodeId, nodes, links) => {
    return nodeId === findRoot(nodes, links)
  }

  // Returns children IDs
  const findChildren = (parentId, links) => {
    let children = []
    links.forEach((link) => {
      if (link.to === parentId) children.push(link.from)
    })
    return children
  }

  const getNodeName = (nodeId, nodes) => {
    if (nodes.includes(nodeId)) {
      return nodes.filter((node) => {
        nodeId === node._id
      })[0].title
    }
  }

  const helpers = {
    findParent,
    findRoot,
    isRoot,
    findChildren,
    getNodeName,
  }
  const raster = initRaster(nodes, links, helpers)


  // Places an array of children IDs in the raster
  // returns the last y-position
  // TODO: make this function pure by passing in the raster and returning it
  const placeChildren = (parentId, childrenIds) => {
    const parentPos = raster.getNodePos(parentId)
    // console.log('parentPos: ', parentPos)
    const childX = parentPos.x + 1

    let lastY = 0 // The space the grandchildren of the last child have taken

    for (let i = 0; i < childrenIds.length; i++ ) {
      const childId = childrenIds[i]
      // console.log('lastY: ', lastY)
      // raster.set(childX, parentPos.y + i + lastY, childId)
      raster.set(childX, parentPos.y + i, childId)
      // TODO: check here if the child that just got set has itself children
      // and set those first, that function returns the amount of space (y)
      // that was needed by all the grandchildrne of that node so that the
      // other children can be pushed down/ continue that amount farther down
      const grandChildrenIds = findChildren(childId, links)
      if (grandChildrenIds.length > 0) {
        lastY = placeChildren(childId, grandChildrenIds)
      }
    }

    // console.log('returning: ', parentPos.y + childrenIds.length)
    return parentPos.y + childrenIds.length
  }

  // find root node
  const rootId = findRoot(nodes, links)

  // place it in first pos: 0,0
  raster.set(0, 0, rootId)

  // find children: search through links, find those that link to that node
  const childrenIds = findChildren(rootId, links)

  // place children: x + 1, same y is the first child, others increase in y
  placeChildren(rootId, childrenIds)

  // find children of first child, iterate
  // already done in placeChildren()

  return raster
}
