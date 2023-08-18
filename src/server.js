const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');

const secretKey = crypto.randomBytes(64).toString('hex');
console.log('Generated Secret Key:', secretKey);


const Category = require('./models/Category');
const Product = require('./models/Product');
const Cart = require('./models/Cart'); 
const Order = require('./models/Order'); 
const User = require('./models/User');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



// Category Listing
app.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Unable to retrieve categories.' });
  }
});
// Product Listing
app.get('/products/:categoryId', async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const products = await Product.find({ categoryId }, 'title price description availability');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Unable to retrieve products.' });
  }
});
// Product Details
app.get('/product/:productId', async (req, res) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Unable to retrieve product details.' });
  }
});

// Order Placement
app.post('/order/place', async (req, res) => {
  const { userId, products } = req.body;

  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found.' });
    }

    const totalPrice = cart.items.reduce((total, item) => {
      const product = cart.items.find(cartItem => cartItem.productId._id.toString() === item.productId._id.toString());
      return total + product.productId.price * item.quantity;
    }, 0);

    const order = new Order({
      userId,
      products: cart.items,
      totalPrice,
    });

    await order.save();

    // Clear the cart after placing the order
    await Cart.findOneAndUpdate({ userId }, { $set: { items: [] } });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Unable to place order.' });
  }
});

// Order History
app.get('/order/history/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const orders = await Order.find({ userId }).sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Unable to retrieve order history.' });
  }
});

// Order Details
app.get('/order/details/:orderId', async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const order = await Order.findById(orderId).populate('products.productId');
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: 'Order not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Unable to retrieve order details.' });
  }
});

// User Registration
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashedPassword,
    });
    await user.save();
    res.json({ message: 'User registered successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Unable to register user.' });
  }
});

// User Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid credentials.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Unable to log in.' });
  }
});
// ... Other API endpoints ...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
