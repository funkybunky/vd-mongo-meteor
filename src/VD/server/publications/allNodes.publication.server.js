import Nodes from 'VD/collections/Nodes.collection.both.js'

Meteor.publish('allNodes', function() {
  console.log('pub!')
  return Nodes.find({})
})
