import { Mongo } from 'meteor/mongo'

const Links = new Mongo.Collection('links')

Links.schema = new SimpleSchema({
  from: {
    type: String,
    label: 'node ID of the child'
  },
  to: {
    type: String,
    label: 'node ID of the parent'
  },
  author: {
    type: String,
    label: 'user ID',
    optional: true // for now
  },
  type: {
    type: String,
    label: 'one of answers, supports, questions, subjects'
  },
})

Links.attachSchema(Links.schema)

export default Links
