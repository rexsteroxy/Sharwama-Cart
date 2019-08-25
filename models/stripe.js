 let cart = new Cart(req.session.cart);

    // Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
const stripe = require('stripe')('sk_test_8tpELYC75jD6QH4x0AEoPvQI00xyGqF3Ud');

// Token is created using Checkout or Elements!
// Get the payment token ID submitted by the form:
const token = request.body.stripeToken; // Using Express

(async () => {
  const charge = await stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: 'usd',
    description: 'Example charge',
    source: token,
    statement_descriptor: 'Custom descriptor',
  },  function(err,charge){
//       if(err){
//           return res.redirect('/checkout')
//       }
//       req.cart = null;
//       res.redirect('/');
//   });