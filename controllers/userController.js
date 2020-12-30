const express = require('express');
let Cart = require('../models/cart');
let Order = require('../models/order');





//use passport request method to check if user is logged in
exports.isLoggedIn = (req,res,next) => {
    if(req.isAuthenticated()){
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}

//use passport request method to check if user is not logged in
exports.isNotLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');

}


// get user dashboard with order history
exports.getUserDashBoard = (req,res,next )=>{
    let successMsg = req.flash('success')[0];
    Order.find({user: req.user},function(err, orders){
        if(err){
            res.write('Error!');
        }
        let cart;
        orders.forEach(function(order){
            cart= new Cart(order.cart);
            order.items = cart.generateArray();

        });
        //console.log(orders);
        res.render('user/profile', { orders: orders,successMsg: successMsg, noMessages: !successMsg}); 
    }).lean();
}



// get signup page
exports.getSignUpPage = (req,res,next )=>{

    let messages = req.flash('error');
    res.render('user/signup',{csrfToken: req.csrfToken(),messages: messages, hasErrors: messages.length > 0});
}


// get sign in page
exports.getSignInPage = (req,res,next )=>{
    
    let messages = req.flash('error');
    res.render('user/signin',{csrfToken: req.csrfToken(),messages: messages, hasErrors: messages.length > 0});
}