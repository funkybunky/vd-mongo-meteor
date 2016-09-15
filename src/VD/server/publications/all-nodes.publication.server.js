import Nodes from 'VD/collections/nodes.collection.both.js'
import Links from 'VD/collections/links.collection.both.js'

Meteor.publish('allNodes', function() {
  return Nodes.find({})
})

Meteor.publish('allLinks', function() {
  return Links.find({})
})
