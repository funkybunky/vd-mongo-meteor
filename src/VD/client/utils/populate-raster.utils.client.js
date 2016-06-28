export default (nodes, links, raster) => {
  // console.log('da nodes: ', JSON.stringify(nodes, null, 2))
  // console.log('links: ', JSON.stringify(links, null, 2))

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
        console.log('root: ', node.title)
      }
    })
    return rootId
  }

  // Returns children IDs
  const findChildren = (parentId, links) => {
    let children = []
    links.forEach((link) => {
      if (link.to === parentId) children.push(link.from)
    })
    return children
  }

  // Places an array of children IDs in the raster
  // returns the last y-position
  // TODO: make this function pure by passing in the raster and returning it
  const placeChildren = (parentId, childrenIds) => {
    const parentPos = raster.getNodePos(parentId)
    console.log('parentPos: ', parentPos)
    const childX = parentPos.x + 1

    let lastY = 0 // The space the grandchildren of the last child have taken

    for (let i = 0; i < childrenIds.length; i++ ) {
      const childId = childrenIds[i]
      console.log('lastY: ', lastY)
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

    console.log('returning: ', parentPos.y + childrenIds.length)
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
