const redis = require('redis');
const express = require('express');
const cors = require('cors')

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const app = express();

app.use(cors(corsOptions));


// Create a Redis client
const client = redis.createClient({ host: 'localhost', port: 8001 });

client.connect()

// Log an error if the Redis client encounters an error
client.on('error', (err) => {
  console.log('Redis client error:', err);
});

app.get('/redis-data', async (req, res) => {
  const keys = await client.keys('*')

  if (!keys || keys.length === 0) {
    res.send([]);
    return;
  }

  const val = await client.mGet(keys)

  const data = {};
  keys.forEach((key, index) => {
    data[key] = val[index];
  });
  // const result = Object.keys(data)
  // .filter(key => key.includes("Branch_"))
  // .reduce( (obj,key) => {
  //   return Object.assign(obj, {
  //     [key] : data[key]
  //   })
  // })

  res.send(data);
  // console.log(data)
})

app.get('/getTop5Addings', async (req, res) => {
  const data = [
    { label: "Type 1", value: 100 },
    { label: "Type 2", value: 80 },
    { label: "Type 3", value: 50 },
    { label: "Type 4", value: 40 },
    { label: "Type 5", value: 30 },
  ];

  res.send(data);
})

app.get('/getTop5FastestHandlers', async (req, res) => {
  const data = [
    { label: "Type 1", value: 100 },
    { label: "Type 2", value: 80 },
    { label: "Type 3", value: 50 },
    { label: "Type 4", value: 40 },
    { label: "Type 5", value: 30 },
  ];

  res.send(data);
})

app.get('/getAvarageHandleTime', async (req, res) => {
  const data = {data: 15}

  res.send(data);
})

app.get('/getAllOrdersFromToday', async (req, res) => {
  const keys = await client.keys('*')

  if (!keys || keys.length === 0) {
    res.send([]);
    return;
  }

  const val = await client.mGet(keys)

  const data = {};
  keys.forEach((key, index) => {
    data[key] = val[index];
  });
  const result = {}
  Object.keys(data)
  .filter(key => key.includes("Order_"))
  .forEach(key => {
    result[key] = data[key]
  })
  
  res.send(result);
  console.log(result)
})

const server = express()
  .use(app)
  .listen(3001, () => {
    console.log(`Listening Socket on http://localhost:3001`)
  });