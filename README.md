# Sharwama-Cart
A Pizza and Sharwama shopping site built with Express.js and Node.js.
Am still building the App


mongoose.Promise = Promise;
mongoose.set('useCreateIndex', true);
const mongooseOptions = {  useNewUrlParser: true }

mongoose.connect('mongodb://localhost:27017/shopping', mongooseOptions, function(err) {
    if (err) {
        console.error('System could not connect to mongo server.')
        console.log(err)     
    } else {
        console.log('System connected to mongo server.')
    } 
});