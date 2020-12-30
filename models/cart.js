module.exports = function Cart(oldCart) {
  //properties of the cart model

  // if existing cart use it, else set cart items to an empty object and othe cart properties to zero
  this.items = oldCart.items || {};
  this.totalQty = oldCart.totalQty || 0;
  this.totalPrice = oldCart.totalPrice || 0;

  //add item method functionality
  this.add = function (item, id) {
    let storedItem = this.items[id];

    //if cart is empty set it
    if (!storedItem) {
      storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
    }

    //else increment the properties
    storedItem.qty++;
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalQty++;
    this.totalPrice += storedItem.item.price;
  };

  //method to reduce cart item by one.
  this.reduceByOne = function (id) {
    this.items[id].qty--;
    this.items[id].price -= this.items[id].item.price;
    this.totalQty--;
    this.totalPrice -= this.items[id].item.price;

    //delete if qty is less than zero
    if (this.items[id].qty <= 0) {
      delete this.items[id];
    }
  };

  //method to remove all cart item  per click
  this.removeAll = function (id) {
    this.totalQty -= this.items[id].qty;
    this.totalPrice -= this.items[id].price;
    delete this.items[id];
  };


  //helper function to convert cart items to array for index display
  this.generateArray = function () {
    let myArray = [];
    for (let id in this.items) {
      myArray.push(this.items[id]);
    }
    return myArray;
  };
};
