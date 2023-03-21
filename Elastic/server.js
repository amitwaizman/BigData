const Kafka = require('node-rdkafka');
const axios = require('axios');
const { Client } = require('@elastic/elasticsearch');

// Create a new client instance
const elastiClient = new Client({ node: 'http://localhost:9200' });

// Define the index and document to add
const indexName = 'kafkatry';
const typeName = 'json';

// Set up Kafka consumer
const consumer = new Kafka.KafkaConsumer({
  'bootstrap.servers': 'pkc-6ojv2.us-west4.gcp.confluent.cloud:9092',
  'security.protocol': 'SASL_SSL',
  'sasl.mechanisms': 'PLAIN',
  'sasl.username': 'NKMJKKJBGXRREWXO',
  'sasl.password': 'HLbaDfw3sj1t3ljuCxH9DhjKkojEecY/JzFFbyonQgQax4Uc55j5hdzg1QHfTSgW',
  'group.id': 'node-group'
}, { "auto.offset.reset": "earliest" });


// Create the index if it doesn't exist


consumer.connect();

async function sendDataToElastic(key, val) {
  const newIndex = indexName + key;
  await elastiClient.indices.create({ index: newIndex }).catch(error => {
    if (error.meta.statusCode !== 400) {
      console.log(`Error creating Elasticsearch index: ${error}`);
    }
  });
  console.log(val);
  try {
    let response;
    if (key == '0')
    {
      response = await elastiClient.index({
        index: newIndex,
        type: key,
        body: val // message.value.toString() // content
      });
    }
    else
    {
      response = await elastiClient.index({
        index: newIndex,
        type: key,
        id: `${val.Number_Order}`,
        body: val // message.value.toString() // content
      });
      let ans = await updateTiming(`${val.Number_Order}`);
    }
    
    // console.log(`Document added to Elasticsearch with id ${response.body._id}`);
  } catch (error) {
    // console.log(`Error adding document to Elasticsearch: ${error}`);
  }
}

async function updateTiming(order)
{
  try
  {
    let result1 = await elastiClient.get({index: (indexName + '1'), type: '1', "id": order});
    let result2 = await elastiClient.get({index: (indexName + '2'), type: '2', "id": order});
    console.log("THISSS" + JSON.stringify(result1));
    let timing = result1.body._source.Date - result2.body._source.Date;
    await elastiClient.update({
      index: indexName + '1',
      id: order,
      type: '1',
      body: {
        "doc": {
          "DateDif": timing
        }
      }
    });
  }
  catch(error)
  {
    console.error("ERROR: " + error);
  }  
}

consumer.on("ready", () => {
  consumer.subscribe(["BigData1"]);
  consumer.consume();
}).on("data", async (message) => {
  const content = JSON.parse(message.value.toString());
  console.log("Received message - ", content);
  for (let k in content) {
    await sendDataToElastic(k, content[k]);
  }
  // Add the document to the Elasticsearch index
  
});

// Log any errors from the Kafka consumer
consumer.on('event.error', (err) => {
  console.error('Error with Kafka consumer:', err);
});



// // const { Client } = require('@elastic/elasticsearch');

// // Create a new client instance
// const elasti = new Client({ node: 'http://localhost:9200' });
// // var result = elasti.search({
// //   index: indexName,
// //   type: "json",
// //   body:{
// //     aggs: {
// //       top5_adds: {
// //         terms: {
// //           field: "2.Topping.keyword",
// //           size: 5
// //         }
// //       }}
// //     }});
// // console.log("this is: " + JSON.stringify(result));





