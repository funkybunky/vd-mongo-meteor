import Nodes from 'VD/collections/Nodes.collection.both.js'
import Links from 'VD/collections/Links.collection.both.js'

import NodesMap from './nodes-map.component.client.js'

export default createContainer((params) => {
  console.log('params: ', params)

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

  const raster = populateRaster(nodes, links, params.raster)

  return {
    loading,
    raster,
    nodes,
  }
}, NodesMap)
