/*
Written by: Ilan Sirisky
This code connects to a MongoDB database using Mongoose and sets up a Kafka consumer to consume messages from a Kafka topic.
It then parses each message and saves it to MongoDB if it meets a specific condition.
The code also includes error handling and logging for both MongoDB and Kafka operations.
*/

const Kafka = require("node-rdkafka");
const mongoose = require('mongoose');

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb+srv://BigData:BigDataProject23@bigdata.e88w7z4.mongodb.net/BigDataProject?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connection successful!');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

// Define the schema for the messages
const MessageSchema = new mongoose.Schema({content: String});
// Create the model for the messages
const Message = mongoose.model('Message', MessageSchema, 'Sales');

// Create a new Kafka consumer
const consumer = new Kafka.KafkaConsumer({
    'bootstrap.servers': 'pkc-6ojv2.us-west4.gcp.confluent.cloud:9092',
    'security.protocol': 'SASL_SSL',
    'sasl.mechanisms': 'PLAIN',
    'sasl.username': 'NKMJKKJBGXRREWXO',
    'sasl.password': 'HLbaDfw3sj1t3ljuCxH9DhjKkojEecY/JzFFbyonQgQax4Uc55j5hdzg1QHfTSgW',
    'group.id': 'node-group'
}, {"auto.offset.reset": "earliest"});

consumer.connect();

consumer.on("ready", () => {
    consumer.subscribe(["BigData1"]);
    consumer.consume();
}).on("data", async (message) => {

    // Parse the message and save it to MongoDB
    const content = message.value.toString();
    const newMessage = new Message({content});

    try { 
        if (content.startsWith('{"2":')) {
            await newMessage.save();
            console.log(`Message saved to MongoDB: ${content}`);
            consumer.commit(message);
        }
    } catch (err) {
        console.error('Error saving message to MongoDB:', err);
    }
});
