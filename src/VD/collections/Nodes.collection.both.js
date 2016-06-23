import { Mongo } from 'meteor/mongo'

const Nodes = new Mongo.Collection('nodes')

Nodes.schema = new SimpleSchema({
  title: {type: String},
  children: {
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
    label: 'array of link IDs, incoming'
  },
  parents: {
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
    label: 'array of link IDs, outgoing'
  }
});

Nodes.attachSchema(Nodes.schema)

export default Nodes
