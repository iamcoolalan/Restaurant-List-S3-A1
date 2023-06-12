const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')

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
  req.flash('success_msg', '你已成功登出!')
  res.redirect('/users/login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []

  if(!name || !email || !password || !confirmPassword ){
    errors.push({ message: '所有欄位皆為必填。' })
  }
  if(password !== confirmPassword){
    errors.push({ message: '密碼與確認密碼不符。' })
  }
  if(errors.length){
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
        errors.push({ message: '此 Email 已經註冊過。' })
        return res.render('register', {
          errors,
          name,
          email,
          password,
          confirmPassword
        })
      } 
      return User.create({
        name,
        email,
        password
      })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err)) 
    })
    .catch(err => console.log(err))
})

module.exports = router