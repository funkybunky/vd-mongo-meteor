import { Meteor } from 'meteor/meteor';

import 'VD/server/index.js'

import Nodes from 'VD/collections/Nodes.collection.both.js'
import Links from 'VD/collections/Links.collection.both.js'

Meteor.startup(() => {
  // code to run on server at startup
  // fixture
  const killDb = () => {
    Nodes.remove({})
    Links.remove({})
  }
  const createIdea = (title) => {
    return Nodes.insert({
      title,
      type: 'idea',
    })
  }
  const createQuestion = (title) => {
    return Nodes.insert({
      title,
      type: 'question',
    })
  }

  // if (Nodes.find({}).count() === 0) {
    const createNodeHierachy = (levelsLeft = 1, parentId, parentType) => {

      // TODO: implement this later to dynaimcally produce correct relationships
      parentType = parentType || null
      childType = parentType

      if (levelsLeft < 1) {
        return true
      }

      const names = [
        'Jack',
        'Jones',
        'DUUDE',
        'Henry',
        'Ford',
        'Jackson',
        'Alanis',
        'Morris',
      ]

      const getRandomName = () => {
        return names[Math.floor(Math.random() * (names.length))]
      }

      parentId = parentId || Nodes.insert({
        title: getRandomName() + ' ' + levelsLeft,
        type: 'question',
      })
      const childId = Nodes.insert({
        title: getRandomName() + ' ' + levelsLeft,
        type: 'idea',
      })
      const linkId = Links.insert({
        from: childId,
        to: parentId,
        type: 'answers',
      })
      return createNodeHierachy(levelsLeft - 1, childId, childType)
    }

    // killDb()
    // createNodeHierachy(5)

  // }
});
