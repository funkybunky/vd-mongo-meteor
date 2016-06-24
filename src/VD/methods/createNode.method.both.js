import Nodes from '../collections/Nodes.collection.both.js'
import Links from '../collections/Links.collection.both.js'

Meteor.methods({
  createNode: function(nodeData, linkdData) {
    // props on nodeData: title, type, children, parents

    // Can I create new ID, request one without performing a DB write
    // Okay, 1min research couldnt find anything. Leave it then

    const nodeId = Nodes.insert(nodeData)
    // const linkId = Links.insert(linkData)
  }
})
