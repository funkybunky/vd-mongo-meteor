import { createContainer } from 'meteor/react-meteor-data'

import Nodes from 'VD/collections/Nodes.collection.both.js'
import Links from 'VD/collections/Links.collection.both.js'

import NodesMap from './nodes-map.component.client.js'

import populateRaster from 'VD/client/utils/populate-raster.utils.client.js'

export default createContainer((params) => {
  // console.log('params: ', params)

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

  let populatedRaster
  if (!loading) {
    populatedRaster = populateRaster(nodes, links)
  }

  const handleNewNode = (payload) => {
    check(payload, {
      title: String,
      parentId: String,
      type: String,
      linkType: String,
    })
    Meteor.call('createNode', payload, (err, res) => {
      if (err) console.log('createNode error! ', err)
      // if (res)
    })
    // neededInfo = {
    //   'new node name',  'wow!'
    //   'parentId', = 'declscs'
    //   'nodeType', = 'idea'
    //   'relationshipType' = answers
    // }
  }

  return {
    loading,
    raster: populatedRaster,
    nodes,
    links,
    handleNewNode,
  }
}, NodesMap)
