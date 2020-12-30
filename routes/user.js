const express = require('express');
const router = express.Router();
const passport = require('passport');
const csrf =  require('csurf');
const userController = require('../controllers/userController')

let csrfProtection = csrf(); 
router.use(csrfProtection);

// get user dashboard with order history
router.get('/profile',userController.isLoggedIn,userController.getUserDashBoard);


// log out the user
router.get('/logout',userController.isLoggedIn,function(req, res, next){
    req.logout();
   res.redirect('/');
});


// checking where login is not needed
router.use('/', userController.isNotLoggedIn,function(req,res,next){
   return next();
});


// get the signup page
router.get('/signup',userController.getSignUpPage);


// user signup functionality
router.post('/signup',passport.authenticate('local.signup',{
    //successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
}),function(req,res,next){
    if(req.session.oldUrl){
        let oldLink = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldLink);
        
    }else{
        res.redirect('/user/profile');
    }
});


//user sigin in functinality
router.post('/signin',passport.authenticate('local.signin',{
    //successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true
}),function(req,res,next){
    if(req.session.oldUrl){
        let oldLink = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldLink);
    }else{
        res.redirect('/user/profile');
    }
});


// get sign in page
router.get('/signin',userController.getSignInPage);

module.exports = router; 

