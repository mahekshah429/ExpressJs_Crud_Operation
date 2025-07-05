const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Product = require('./models/Product');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect MongoDB
mongoose.connect(
  'mongodb+srv://wwwvishalcloud872:wsEI5ZtxsJBdF8vv@cluster0.y5kbrew.mongodb.net/product_api?retryWrites=true&w=majority&appName=Cluster0',
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log('MongoDB Connected Successfully'))
.catch(err => console.error('MongoDB connection failed', err));

// POST - Add new product
app.post('/products', async (req, res) => {
  try {
    const { name, price, category, inStock } = req.body;
    const product = new Product({ name, price, category, inStock });
    const savedProduct = await product.save();
    res.status(201).json({ message: 'Product added successfully', data: savedProduct });
  } catch (error) {
    res.status(400).json({ message: 'Failed to add product', error: error.message });
  }
});

// GET - All products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// GET - Product by ID
app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

// PUT - Update product by ID
app.put('/products/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated)
      return res.status(404).json({ message: 'Product not found' });

    res.json({ message: 'Product updated', data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

// DELETE - Delete product by ID
app.delete('/products/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: 'Product not found' });

    res.json({ message: 'Product deleted', data: deleted });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

// BONUS: GET - All in-stock products
app.get('/products/in-stock', async (req, res) => {
  try {
    const inStockProducts = await Product.find({ inStock: true });
    res.json(inStockProducts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching in-stock products', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Product API server running on port ${port}`);
});
