const express = require('express')
const router = express.Router()
const { authenticator } = require('../middleware/auth')

const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
const user = require('./modules/user')
const auth = require('./modules/auth')

router.use('/restaurants', authenticator, restaurants)
router.use('/users', user)
router.use('/auth', auth)
router.use('/', authenticator, home)

module.exports = router