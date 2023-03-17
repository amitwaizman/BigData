const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const { Client } = require('bigml');

const MONGO_URL = 'mongodb+srv://BigData:BigDataProject23@bigdata.e88w7z4.mongodb.net/BigDataProject?retryWrites=true&w=majority';
const BIGML_USERNAME = 'ilan1il1000';
const BIGML_API_KEY = 'c873501d60fe9e2981301d10a3895cf351165ad8';

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
// let db;
// MongoClient.connect(MONGO_URL, (err, client) => {
//   if (err) {
//     console.error(err);
//     process.exit(1);
//   }
//   db = client.db();
//   console.log('Connected to MongoDB');
// });

// Connect to BigML
// const bigml = new Client(BIGML_USERNAME, BIGML_API_KEY);
// console.log('Connected to BigML');

// API function to write data to BigML
app.get('/bigml/getbydates', (req, res) => {
  const startdate = req.query.startdate;
  const enddate = req.query.enddate;
  // Ilan do his bigml calculations
  answer = `${startdate} - ${enddate}` // Need to change that
  res.send(answer)
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
