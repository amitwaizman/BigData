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

messages = [
    '{"0":{\"Branch_Name\":\"Or Akiva\",\"Open/Close\":\"open\"}}',
    '{"2":{"Branch_Name":"Ramat_Gan_the_city_center","Area":"Central","status":"in process","Date":"2023/3/16,20:50","Branch_Number":939529,"Topping":["pepper","Onion","Tomato","Bulgarian","corn"],"Number_Order":1678992665721}}',
    '{"2":{"Branch_Name":"Kfar Kara","Area":"Sharon","status":"in process","Date":"2023/3/16,20:50","Branch_Number":86100,"Topping":["Tomato","corn","Mushrooms","Bulgarian","eggplant"],"Number_Order":1678992706267}}',
    '{"0":{"Branch_Name":"Zichron_Yaakov","Open/Close":"close"}}',
    '{"1":{"Branch_Name":"Kiryat_Ata","Number_Order":1678992731726,"status":"finish"}}',
    '{"2":{"Branch_Name":"Maalot","Area":"North","status":"in process","Date":"2023/3/16,20:51","Branch_Number":682051,"Topping":["pepper","Bulgarian","Tomato","eggplant"],"Number_Order":1678992740190}}',
    '{"1":{"Branch_Name":"Kiryat_Ata","Number_Order":1678992731726,"status":"finish"}}'
]

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
consumer.connect();

redisClient.connect().then(
    consumer.on('ready', () => {
        console.log("Ready to consume!")
        consumer.subscribe(['BigData1']);
        consumer.consume();
    })
)

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