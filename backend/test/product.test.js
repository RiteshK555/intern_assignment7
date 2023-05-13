const { expect } = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const Product = require('../models/Product');
require('dotenv').config();

describe('Product API', () => {
  

  after((done) => {
    mongoose.connection.close()
      .then(() => done())
      .catch((err) => done(err));
  });

  beforeEach(async () => {
    await Product.deleteMany({});
  });

  describe('GET /api/products', () => {
    it('should retrieve all products', async () => {
      await Product.create([
        { name: 'Product 1', description: 'Description 1', price: 10 },
        { name: 'Product 2', description: 'Description 2', price: 20 },
      ]);

      const res = await request(app).get('/api/products');

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.equal(2);
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({ name: 'New Product', description: 'New Description', price: 30 });

      expect(res.status).to.equal(201);
      expect(res.body).to.be.an('object');
      expect(res.body.name).to.equal('New Product');
    });
  });

  describe('GET /api/products/:productId', () => {
    it('should retrieve a specific product by ID', async () => {
      const product = await Product.create({ name: 'Product 1', description: 'Description 1', price: 10 });

      const res = await request(app).get(`/api/products/${product._id}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body.name).to.equal(product.name);
      expect(res.body.description).to.equal(product.description);
      expect(res.body.price).to.equal(product.price);
    });

    it('should return 404 if product ID is not found', async () => {
      const nonExistingProductId = new mongoose.Types.ObjectId();

      const res = await request(app).get(`/api/products/${nonExistingProductId}`);

      expect(res.status).to.equal(404);
    });
  });

  describe('PUT /api/products/:productId', () => {
    it('should update a specific product by ID', async () => {
      const product = await Product.create({ name: 'Product 1', description: 'Description 1', price: 10 });
      const updatedProductData = { name: 'Updated Product', description: 'Updated Description', price: 20 };

      const res = await request(app)
        .put(`/api/products/${product._id}`)
        .send(updatedProductData);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body.name).to.equal(updatedProductData.name);
      expect(res.body.description).to.equal(updatedProductData.description);
      expect(res.body.price).to.equal(updatedProductData.price);
    });

    it('should return 404 if product ID is not found', async () => {
      const nonExistingProductId = new mongoose.Types.ObjectId();
      const updatedProductData = { name: 'Updated Product', description: 'Updated Description', price: 20 };

      const res = await request(app)
        .put(`/api/products/${nonExistingProductId}`)
        .send(updatedProductData);

      expect(res.status).to.equal(404);
    });
  });

  describe('DELETE /api/products/:productId', () => {
    it('should delete a specific product by ID', async () => {
      const product = await Product.create({ name: 'Product 1', description: 'Description 1', price: 10 });

      const res = await request(app).delete(`/api/products/${product._id}`);

      expect(res.status).to.equal(200);

      const deletedProduct = await Product.findById(product._id);
      expect(deletedProduct).to.be.null;
    });

    it('should return 404 if product ID is not found', async () => {
      const nonExistingProductId = new mongoose.Types.ObjectId();

      const res = await request(app).delete(`/api/products/${nonExistingProductId}`);

      expect(res.status).to.equal(404);
    });
  });

});
