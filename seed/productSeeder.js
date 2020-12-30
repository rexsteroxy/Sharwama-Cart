let Product = require('../models/product');
let mongoose = require('mongoose');


const mongooseOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  };
  
  mongoose.connect("mongodb://localhost:27017/shopping", mongooseOptions, function (err) {
    if (err) {
      console.error("System could not connect to mongo server.");
      console.log(err);
    } else {
      console.log("System connected to mongo server.");
    }
  });

let products = [
    new Product({
    imagePath:"https://image.shutterstock.com/image-photo/shawarma-sauce-on-white-background-260nw-471071540.jpg",
    title: 'Beef Shawarma',
    description:'Very Yummy',
    price:1000
}),
new Product({
    imagePath:"http://cookingtheglobe.com/wp-content/uploads/2016/07/beef-shawarma.jpg",
    title: 'Chicken Shawarma',
    description:'Creamy chicken yummy',
    price:1200
}),
new Product({
    imagePath:"http://cookingtheglobe.com/wp-content/uploads/2016/07/beef-shawarma.jpg",
    title: 'Mixed shawarma',
    description:'chicken, vegitables creamy beef. Very Delicious',
    price:1500
}),
]
let done = 0;


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
