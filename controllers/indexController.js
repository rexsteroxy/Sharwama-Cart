let Cart = require('../models/cart');
let Product = require('../models/product');
let Order = require('../models/order');

exports.getHomePage = (req, res, next)=>{

 //get data from mongodb and pass it to the view
 let successMsg = req.flash('success')[0];
 Product.find({},function(err,data){
     if (err) throw err;
     let productChunks =[];
     let chunkSize = 3;
     for (let i=0; i<data.length; i += chunkSize ) {
         productChunks.push(data.slice(i,i + chunkSize)); 
     }
     res.render('shop/index', {title:"Shawarma Order App", products:productChunks, 
     successMsg: successMsg, noMessages: !successMsg });
 }).lean()

}


exports.addShawarmaToCart = (req, res,next)=>{
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
}


exports.reduceShawarmaTypeByOne = (req, res,next)=>{

    let productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart :  {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');

}


exports.removeAllShawarmaType = (req, res,next)=>{

    let productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart :  {});

    cart.removeAll(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
}


exports.displayAllItemsInCart = (req, res,next) => {

    if(!req.session.cart){ 
        return res.render('shop/shopping-cart', { products: null });
    }
    let cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});

}


exports.getCheckoutPage = (req, res,next) => {
    if(!req.session.cart){ 
        return res.redirect('/'); 
    }

    let cart = new Cart(req.session.cart);
    let errMsg = req.flash('error')[0];
    res.render('shop/checkout', { totalPrice: cart.totalPrice ,errMsg: errMsg , noErrors: !errMsg }); 

}



exports.striptChargeFunctionality = (req, res,next) => {

    if(!req.session.cart){ 
        return res.redirect('/'); 
    }
let cart = new Cart(req.session.cart);

    // Set your secret key: remember to change this to your live secret key in production

const stripe = require('stripe')(process.env.STRIPE_KEY);

// Token is created using Checkout or Elements!
// Get the payment token ID submitted by the form:
const token = req.body.stripeToken;
const chargeAmount = Math.round(cart.totalPrice / 480);
console.log(chargeAmount);  // Using Express

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

let order = new Order({
    user: req.user,
    cart: cart,
    name: req.body.name,
    address: req.body.address,
    paymentId: charge.id
});
 order.save(function(err,result){
    req.flash('success','Payment Successful');
    req.session.cart = null;
    res.redirect('/user/profile');
 });
    

  } 
);
}