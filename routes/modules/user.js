const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')
const bcrypt = require('bcryptjs')

router.get('/login', (req, res) => {
  const login_warning_msg = req.flash('login_warning_msg') || []
  res.render('login', { login_warning_msg })
})

router.post('/login', passport.authenticate('local', {
  failureFlash: true,
  failureRedirect: '/users/login',
  successRedirect: '/'
})
)

router.get('/logout', (req, res) => {
  req.logOut()
  req.flash('success_msg', 'Logout success!')
  res.redirect('/users/login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []

  if (!email || !password || !confirmPassword) {
    errors.push({ message: 'Make sure you have filled in the Email, Password and Confirm Password ' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: 'password and confirm password not matched' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }

  User.findOne({ email })
    .then(user => {
      if (user) {
        errors.push({ message: 'This email already exists' })
        return res.render('register', {
          errors,
          name,
          email,
          password,
          confirmPassword
        })
      }
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => {
          User.create({
            name,
            email,
            password: hash
          })
        })
        .then(() => {
          req.flash('success_msg', 'Register success! You can login now!')
          res.redirect('/users/login')
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

module.exports = router