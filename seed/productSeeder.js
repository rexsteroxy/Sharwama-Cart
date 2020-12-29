var Product = require('../models/product');
var mongoose = require('mongoose');
mongoose.connect('localhost:27017/shopping');
var products = [
    new Product({
    imagePath:"https://res.cloudinary.com/stero/image/upload/v1562689623/s4eck80gvopy1tyej4jo.jpg",
    title: 'Rex Building',
    description:'Estate Building with comfortable rooms',
    price:5000
}),
new Product({
    imagePath:"https://res.cloudinary.com/stero/image/upload/v1562689623/s4eck80gvopy1tyej4jo.jpg",
    title: 'Bungalow',
    description:'Estate Building with comfortable rooms',
    price:4000
}),
new Product({
    imagePath:"https://res.cloudinary.com/stero/image/upload/v1562689623/s4eck80gvopy1tyej4jo.jpg",
    title: 'Flat Building',
    description:'Estate Building with comfortable rooms',
    price:15000
}),
]
var done = 0;


for(let i=0; i<products.length;i++){
    products[i].save(function(err,result){
        done++;
        if(done === products.length){
            exit();
        }
    });
} 
function exit(){
    mongoose.disconnect();
}
//creating database schema
// var productone = Product({
//     imagePath:"https://res.cloudinary.com/stero/image/upload/v1562689623/s4eck80gvopy1tyej4jo.jpg",
//     title: 'Rex Building is one in town',
//     description:'Buitiful House',
//     price:4050
// }).save(function(err){
//     if(err) throw err;
//     console.log('product saved');
    
// })