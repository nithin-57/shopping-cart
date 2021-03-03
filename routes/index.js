var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');

var Product = require('../models/product');
var Order = require('../models/order');


/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];
Product.find(function(err, docs)  {
  var productChunks = [];
  var chunkSize = 3;
  for (var i = 0; i < docs.length; i += chunkSize) {
    productChunks.push(docs.slice(i, i + chunkSize));
  }
  res.render('shops/index', { title: 'Shopping Cart', products: productChunks,  successMsg: successMsg, noMessages: !successMsg});

});
});

router.get('/add-to-cart/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function(err, product) {
    if (err) {
      return res.redirect('/');
    }  
    cart.add(product, productId);
    req.session.cart = cart;
    console.log(req.session.cart);
    console.log(productId);
    console.log('Product....\n'+product);
    res.redirect('/');
  });
});

router.get('/reduce/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/remove/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function(req, res, next) {
  if (!req.session.cart) {
    return res.render('shops/shopping-cart', {products: null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shops/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', isLoggedIn, function(req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shops/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', isLoggedIn, function(req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);

  var stripe = require('stripe')(
    'sk_test_V4NM7pfviVeduicnF1T3vs2j0051eGjj07'
    );

// `source` is obtained with Stripe.js; see https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
stripe.charges.create({
  description: 'software development services',
  shipping: {
    name: 'john',
    address: {
      line1: '510 Townsend St',
      postal_code: '98140',
      city: 'San francisco',
      state: 'CA',
      country: 'US',
    },
  },
    amount: cart.totalPrice * 100,
    currency: "usd",
    source: req.body.stripeToken,
    description: "Test Charge",
  },
  function(err, charge) {
    // asynchronously called
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/checkout');
    }
    var order = new Order({
      user: req.user,
      cart: cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: charge.id
    });
    order.save(function(err, result) {
      req.flash('success', 'Successfully bought product!');
    req.session.cart = null;
    res.redirect('/');
    });
  });
});

module.exports = router; 

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}