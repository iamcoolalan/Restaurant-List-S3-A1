const Restaurants = require('../restaurants')
const User = require('../user')
const bcrypt = require('bcryptjs')
const db = require('../../config/mongoose')

const restaurantsList = require('../../data/restaurant.json')
const SEED_USERS = require('../../data/seedUser.json')

//After finishing creating the seed data close the database
db.once('open', () => {
  console.log('Generate seed data...')

  SEED_USERS.forEach((seedUser, index, array) => {
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
        const seedIndex = (seedUser.id-1) * 3

        return Promise.all(Array.from(
          {length: 3},
          (_, i) => Restaurants.create({
            ...restaurantsList.results[i + seedIndex],
            userId
          })
        ))
      })
      .then(() => {
        if(index === array.length - 1){
          console.log('done.')
          process.exit()
        }
      })
  })
})
