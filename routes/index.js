var express = require('express');
var router = express.Router();
let Cart = require('../models/cart');
let Product = require('../models/product');


/* GET home page. */
router.get('/', function(req, res, next) {
  //get data from mongodb and pass it to the view
  let successMsg = req.flash('success')[0];
  Product.find({},function(err,data){
      if (err) throw err;
      let productChunks =[];
      let chunkSize = 3;
      for (let i=0; i<data.length; i += chunkSize ) {
          productChunks.push(data.slice(i,i + chunkSize)); 
      }
      res.render('shop/index', {title:"Node project deal", products:productChunks, 
      successMsg: successMsg, noMessages: !successMsg });
  })
});
//for adding items to cart
router.get('/add-to-cart/:id',function(req, res, next){
   
    let productId = req.params.id;
    
    let cart = new Cart(req.session.cart ? req.session.cart :  {});
    Product.findById(productId, function(err, product){
        if(err){
            return res.redirect('/');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/')
    });
    
});

//for displaying items in cart
router.get('/shopping-cart/', function(req, res, next){
    
    if(!req.session.cart){ 
        return res.render('shop/shopping-cart', { products: null });
    }
    let cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
}); 
//for getting the check out page
router.get('/checkout/', function(req, res, next){
    if(!req.session.cart){ 
        return res.redirect('/'); 
    }

    let cart = new Cart(req.session.cart);
    let errMsg = req.flash('error')[0];
    res.render('shop/checkout', { totalPrice: cart.totalPrice ,errMsg: errMsg , noErrors: !errMsg }); 
    
});

router.post('/charge',function(req,res,next){
    if(!req.session.cart){ 
        return res.redirect('/'); 
    }
let cart = new Cart(req.session.cart);

    // Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
const stripe = require('stripe')('sk_test_8tpELYC75jD6QH4x0AEoPvQI00xyGqF3Ud');

// Token is created using Checkout or Elements!
// Get the payment token ID submitted by the form:
const token = req.body.stripeToken; // Using Express

stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: 'usd',
    description: 'Example charge',
    source: token,
    statement_descriptor: 'Custom descriptor',
  },function(err,charge){
    if(err){
        req.flash('error', err.message)
     return res.redirect('/checkout')
    }
    req.flash('success','Payment Successful');
    req.session.cart = null;
    res.redirect('/');

  }
);
});

module.exports = router; 

