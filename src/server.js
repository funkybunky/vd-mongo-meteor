import { Meteor } from 'meteor/meteor';

import 'VD/server/index.js'

import Nodes from 'VD/collections/Nodes.collection.both.js'

Meteor.startup(() => {
  // code to run on server at startup
  // fixture
  if (Nodes.find({}).count() === 0) {
    Nodes.insert({
      title: 'myfirst node',
    })
  }
});
