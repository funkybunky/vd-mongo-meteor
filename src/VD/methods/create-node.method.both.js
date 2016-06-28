import Nodes from '../collections/Nodes.collection.both.js'
import Links from '../collections/Links.collection.both.js'

Meteor.methods({
  createNode: function(payload) {

    check(payload, {
      title: String,
      parentId: String,
      type: String,
      linkType: String,
    })

    const { title, type, parentId, linkType } = payload

    // Can I create new ID, request one without performing a DB write
    // Okay, 1min research couldnt find anything. Leave it then

    const nodeId = Nodes.insert({
      title,
      type,
    })

    const linkId = Links.insert({
      type: linkType,
      from: nodeId,
      to: parentId,
    })

  }
})
