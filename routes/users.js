var express = require('express');
var router = express.Router();

/* var request = require('sync-request'); */

const userModel = require("../models/user");

/* GET Login page. */
/* router.get('/', function (req, res, next) {

  if (req.session.user == undefined) {
    req.session.user = [];
  }
  res.render('login', {alertMessage:''});
}); */

/* Sign-up  */
router.post('/sign-up', async function(req, res, next) {

  var user = await userModel.find({
    email: req.body.signUpEmail
  })

  if(user.length > 0 ) {
    req.session.user = user
    res.render('index', {user: req.session.user})
  } else {

    var newUser = new userModel ({
      name: req.body.signUpName,
      firstName: req.body.signUpFirstName,
      email: req.body.signUpEmail,
      password: req.body.signUpPassword,
    });
  
    await newUser.save();
   
    req.session.user = newUser
  
  res.render ('index', {user: req.session.user});
}
});

/* Sign-in */

router.post('/sign-in', async  function(req, res, next){

  var user = await userModel.find({email: req.body.signInEmail}) 
  if (user.length >0) {

    req.session.user = user

    res.render('index', {user: req.session.user})

  } else { 
   
    res.render('login', {alertMessage:'You need to sign-up first' })
  }
});

/* Logout */

router.get('/logout', function(req, res, next){
  req.session.user = null;
    res. redirect('/')
});






module.exports = router;
