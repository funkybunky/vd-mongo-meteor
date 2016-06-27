import Nodes from 'VD/collections/Nodes.collection.both.js'
import Links from 'VD/collections/Links.collection.both.js'

import NodesMap from './nodes-map.component.client.js'

export default createContainer((params) => {
  console.log('params: ', params)
  const raster = params.raster

  const createRaster = (nodes, links) => {
    console.log('da nodes: ', JSON.stringify(nodes, null, 2))
    console.log('links: ', JSON.stringify(links, null, 2))

    const findRoot = () => {
      // the root node is the one whose ID is in no link `from` field
      let rootId
      nodes.forEach((node) => {
        let isRoot = true
        links.forEach((link) => {
          if (link.from === node.Id) isRoot = false
        })
        if (isRoot === true) rootId = node._id
      })
      return rootId
    }

    // Returns children IDs
    const findChildren = (parentId) => {
      let children = []
      links.forEach((link) => {
        if (link.to === parentId) children.push(link._id)
      })
      return children
    }

    // Places an array of children IDs in the raster
    // returns the last y-position
    // TODO: make this function pure by passing in the raster and returning it
    const placeChildren = (parentId, childrenIds) => {
      const parentPos = raster.getNodePos(parentId)
      const childX = parentPos.x + 1

      let lastY = 0 // The space the grandchildren of the last child have taken

      for (let i = 0; i < childrenIds.length - 1; i++ ) {
        const childId = childrenIds[i]
        raster.set(childX, parentPos.y + i + lastY, childId)
        // TODO: check here if the child that just got set has itself children
        // and set those first, that function returns the amount of space (y)
        // that was needed by all the grandchildrne of that node so that the
        // other children can be pushed down/ continue that amount farther down
        const grandChildrenIds = findChildren(childId)
        if (childrenIds.length > 0) {
          lastY = placeChildren(childId, grandChildrenIds)
        }

      }
      return parentPos.y + childrenIds.length - 1
    }

    // find root node
    const rootId = findRoot()

    // place it in first pos: 0,0
    raster.set(0, 0, rootId)

    // find children: search through links, find those that link to that node
    const childrenIds = findChildren(rootId)

    // place children: x + 1, same y is the first child, others increase in y
    placeChildren(rootId, childrenIds)

    // find children of first child, iterate
    // already done in placeChildren()

  }
  const nodesHandle = Meteor.subscribe('allNodes', {
    onReady: (...squat) => {
      console.log('ready! args: ', ...squat)
    },
    onStop: (...whuut) => {
      console.log('errorz, stopped: ', ...whuut)
    }
  })
  const linksHandle = Meteor.subscribe('allLinks', {
    onReady: (...squat) => {
      console.log('ready! args: ', ...squat)
    },
    onStop: (...whuut) => {
      console.log('errorz, stopped: ', ...whuut)
    }
  })
  const loading = !nodesHandle.ready() || !linksHandle.ready()
  const nodes = Nodes.find({}).fetch()
  const links = Links.find({}).fetch()

  // const raster = createRaster(nodes, links)
  createRaster(nodes, links)

  return {
    loading,
    raster,
    nodes,
  }
}, NodesMap)
