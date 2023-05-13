const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');

require('dotenv').config();

const app = express();
const mongoURI = process.env.ENV_DB_CHECK_TEST === 'TEST' ? process.env.TEST_DB_URL : process.env.DB_URL;


app.use(express.json());
app.use('/api', productRoutes);


mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});


const port = process.env.PORT || 3000;


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;
