const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const userController = require('../controllers/userController')


/* GET home page. */
router.get('/', indexController.getHomePage);



//for adding items to cart
router.get('/add-to-cart/:id',indexController.addShawarmaToCart);


// To reduce shawarma item type by one
router.get('/reduce/:id',indexController.reduceShawarmaTypeByOne);


// to remove all shawarma type all at once when added to cart
router.get('/removeAll/:id',indexController.removeAllShawarmaType);



//for displaying items in cart
router.get('/shopping-cart/', indexController.displayAllItemsInCart);



//for getting the check out page
router.get('/checkout/', userController.isLoggedIn, indexController.getCheckoutPage);


// stripe charge functionality
router.post('/charge', userController.isLoggedIn, indexController.striptChargeFunctionality);



module.exports = router; 

