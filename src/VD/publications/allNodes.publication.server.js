import Nodes from '../collections/Nodes.collection.both.js'

Meteor.publish('allNodes', function() {
  return Nodes.find({})
})
