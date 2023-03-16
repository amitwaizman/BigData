const Kafka = require('node-rdkafka');
const redis = require('redis');

// Set up Redis client
const redisClient = redis.createClient({ host: 'localhost', port: 8001 });

// Set up Kafka consumer
const consumer = new Kafka.KafkaConsumer({
    "group.id": "cloudkarafka-example",
    "metadata.broker.list": "dory-01.srvs.cloudkafka.com:9094,dory-02.srvs.cloudkafka.com:9094,dory-03.srvs.cloudkafka.com:9094".split(","),
    "socket.keepalive.enable": true,
    "security.protocol": "sasl_ssl",
    "sasl.mechanisms": "SCRAM-SHA-256",
    "sasl.username": "nvdhmhmb",
    "sasl.password": "Pcn7wdhX_HqCPvMVDJwkoOXuq1T9u2e6",
    "debug": "generic,broker,security"
});

consumer.connect();

consumer.on('ready', () => {
console.log("Getting ready!")
  consumer.subscribe(['nvdhmhmb-default']);
  consumer.consume();
});

consumer.on('data', (message) => {
    console.log("we got the following message - ", message);
//   const key = message.key.toString();
//   const value = message.value.toString();

//   // Write the message to Redis
//   redisClient.set(key, value, (err, reply) => {
//     if (err) {
//       console.error('Error writing message to Redis:', err);
//     } else {
//       console.log('Message written to Redis:', reply);
//     }
//   });
});

// Log any errors from the Kafka consumer
consumer.on('event.error', (err) => {
  console.error('Error with Kafka consumer:', err);
});

// Log any errors from the Redis client
redisClient.on('error', (err) => {
  console.error('Error with Redis client:', err);
});



