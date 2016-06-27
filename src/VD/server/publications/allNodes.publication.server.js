import Nodes from 'VD/collections/Nodes.collection.both.js'
import Links from 'VD/collections/links.collection.both.js'

Meteor.publish('allNodes', function() {
  return Nodes.find({})
})

Meteor.publish('allNodes', function() {
  return Links.find({})
})
