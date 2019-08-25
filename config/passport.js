const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy; 


passport.serializeUser(function(user,done){
    done(null, user.id);
});

passport.deserializeUser(function(id,done){
    User.findById(id,function(err, user){
        done(err, user);
    });
});


passport.use('local.signup',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
},
function(req,email,password,done){ 
req.checkBody('email','Invalid email').notEmpty().isEmail();
req.checkBody('password','Password must be more than 4 characters')
.not().isEmpty().isLength({min:4});
 let errors = req.validationErrors();
if(errors){
    let messages = [];
    errors.forEach(function(error) {
        messages.push(error.msg);
    });
    return done(null, false, req.flash('error',messages));
    
}
    User.findOne({'email': email}, function(err,user){
        if(err){
            return done(err);
        }
        if(user){
            return done(null, false, {message: 'Email is already in use.'});
        }
        let newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function(err,result){
            if(err){
                return done(err);
            }
            return done(null, newUser);
        });
    });
}));

//for sign in

passport.use('local.signin',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
},
function(req,email,password,done){ 
req.checkBody('email','Invalid email').notEmpty().isEmail();
req.checkBody('password','Password Should Not Be Empty')
.notEmpty();
 let errors = req.validationErrors();
if(errors){
    let messages = [];
    errors.forEach(function(error) {
        messages.push(error.msg);
    });
    return done(null, false, req.flash('error',messages));
    
}
    User.findOne({'email': email}, function(err,user){
        if(err){
            return done(err);
        }
        if(!user){
            return done(null, false, {message: 'No User Found!'});
        }
        if(!user.validPassword(password)){
            return done(null, false, {message: 'Incorrect Credentials'});
        }
        
            return done(null, user);
        
    });
}));
