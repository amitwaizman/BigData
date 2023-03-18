const redis = require('redis');

// Connect to Redis server
const client = redis.createClient({ host: 'localhost', port: 6379 });

// Array to store retrieved data
let data = [];


client.on('connect', async function () {
  console.log('Connected!');

  const val = await client.get('Order_1679056713236')
    

  console.log('val!22' + val);

});

client.connect()