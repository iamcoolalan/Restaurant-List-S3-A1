const Restaurants = require('../restaurants')
const User = require('../user')
const bcrypt = require('bcryptjs')
const db = require('../../config/mongoose')
const { Promise } = require('mongoose')

const restaurantsList = require('../../data/restaurant.json')
const SEED_USERS = require('../../data/seedUser.json')

//After finishing creating the seed data close the database
db.once('open', () => {
  console.log('Generate seed data...')

  SEED_USERS.forEach(seedUser => {
    bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(seedUser.password, salt))
      .then(hash => User.create({
        name: seedUser.name,
        email: seedUser.email,
        password: hash
      }))
      .then(user => {
        const userId = user._id
        const index = (seedUser.id-1) * 3

        return Promise.all(Array.from(
          {length: 3},
          (_, i) => Restaurants.create({
            ...restaurantsList.results[i+index],
            userId
          })
        ))
      })
      .then(() => {
        console.log('done.')
        process.exit()
      })
  })
})
