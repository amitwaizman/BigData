/*
Written by: Eldad Tsemach
This code sets up a Kafka consumer and Redis client to consume messages from a Kafka topic named "BigData1".
The messages are parsed into a dictionary and depending on the key in the dictionary, the data is sent to Redis with a specific key.
Any errors with Kafka or Redis are logged.
*/

const redis = require('redis');
const Kafka = require('node-rdkafka');

// Set up Redis client
const redisClient = redis.createClient({ host: 'localhost', port: 8001 });

// Set up Kafka consumer
const consumer = new Kafka.KafkaConsumer({
    'bootstrap.servers': 'pkc-6ojv2.us-west4.gcp.confluent.cloud:9092',
    'security.protocol': 'SASL_SSL',
    'sasl.mechanisms': 'PLAIN',
    'sasl.username': 'NKMJKKJBGXRREWXO',
    'sasl.password': 'HLbaDfw3sj1t3ljuCxH9DhjKkojEecY/JzFFbyonQgQax4Uc55j5hdzg1QHfTSgW',
    'group.id': 'node-group'
}, { "auto.offset.reset": "earliest" });

// Function to send data to Redis with a specified key
function sendDataToRedis(key, val) {
    console.log(val)
    redisClient.set(key, val, function (err, reply) {
        if (err) {
            console.error('Error writing message to Redis:', err);
        } else {
            console.log('Message written to Redis:', reply);
        }
    }); 
}
// Connect to Kafka consumer and Redis client
consumer.connect();
redisClient.connect().then(
    consumer.on('ready', () => {
        console.log("Ready to consume!")
        consumer.subscribe(['BigData1']);
        consumer.consume();
    })
)

// Log any Kafka consumer events
consumer.on('data', (message) => {
    message = message.value.toString()
    console.log("we got the following message - ", message);
    dict = JSON.parse(message)

    for (let k in dict) {
        switch (k) {
            case '0': {
                sendDataToRedis("Branch_" + (dict[k]["Branch_Name"]).toString(), dict[k]["Open/Close"])
                break;
            }
            case '1': {
                sendDataToRedis("Order_" + (dict[k]["Number_Order"]).toString(), JSON.stringify(dict[k]))
                break;
            }
            case '2': {
                sendDataToRedis("Order_" + (dict[k]["Number_Order"]).toString(), JSON.stringify(dict[k]))
                break;
            }
            default: {
                console.log(k)
                break;
            }
        }
        console.log(`${k}:${dict[k]}`)
    }
});

// Log any errors from the Kafka consumer
consumer.on('event.error', (err) => {
    console.error('Error with Kafka consumer:', err);
});

// Log any errors from the Redis client
redisClient.on('error', function (err) {
    console.error('Error with Redis client:', err);
});