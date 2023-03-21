/*****************
 * GILAD LIVSHIT *
 *****************/

// this document represents the server that get data from the kafka and set 
// it to the elasticsearch DB


// Imports
const Kafka = require('node-rdkafka');
const axios = require('axios');
const { Client } = require('@elastic/elasticsearch');

// Create a new client instance
const elastiClient = new Client({ node: 'http://localhost:9200' });

// the base name of the index
const indexName = 'kafkatry';

// Set up Kafka consumer
const consumer = new Kafka.KafkaConsumer({
  'bootstrap.servers': 'pkc-6ojv2.us-west4.gcp.confluent.cloud:9092',
  'security.protocol': 'SASL_SSL',
  'sasl.mechanisms': 'PLAIN',
  'sasl.username': 'NKMJKKJBGXRREWXO',
  'sasl.password': 'HLbaDfw3sj1t3ljuCxH9DhjKkojEecY/JzFFbyonQgQax4Uc55j5hdzg1QHfTSgW',
  'group.id': 'node-group'
}, { "auto.offset.reset": "earliest" });

// connect to consumer
consumer.connect();

/**
 * the function sets the value into the elastic DB
 * gets the "family" of the request, which will determine the index and type
 * and then the value will be inserrted
 * @param {*} key '0', '1' or '2'
 * @param {*} val dict / JSON to insert
 */
async function sendDataToElastic(key, val) {
  const newIndex = indexName + key;
  // create the index if doesn't exist
  await elastiClient.indices.create({ index: newIndex }).catch(error => {
    if (error.meta.statusCode !== 400) {
      console.log(`Error creating Elasticsearch index: ${error}`);
    }
  });

  try {
    let response;
    // if the message is only about stores enter regularly
    if (key == '0')
    {
      response = await elastiClient.index({
        index: newIndex,
        type: key,
        body: val // message.value.toString() // content
      });
    }
    else    // in case of orders - enter them and claculate time it took to answare
    {
      response = await elastiClient.index({
        index: newIndex,
        type: key,
        id: `${val.Number_Order}`,    // order as the docId
        body: val
      });
      let ans = await updateTiming(`${val.Number_Order}`);
    }
    
    // console.log(`Document added to Elasticsearch with id ${response.body._id}`);
  } catch (error) {
    // console.log(`Error adding document to Elasticsearch: ${error}`);
  }
}

/**
 * by given order number check if the order has been finished and set it to both of the statuses
 * @param {*} order 
 */
async function updateTiming(order)
{
  try
  {
    // get details when finished
    let result1 = await elastiClient.get({index: (indexName + '1'), type: '1', "id": order});
    // get details when started
    let result2 = await elastiClient.get({index: (indexName + '2'), type: '2', "id": order});
    //console.log("THISSS" + JSON.stringify(result1));
    let timing = result1.body._source.Date - result2.body._source.Date;

    // update the timing to both of them
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
    await elastiClient.update({
      index: indexName + '2',
      id: order,
      type: '2',
      body: {
        "doc": {
          "DateDif": timing
        }
      }
    });
  }
  catch(error)    // if failed to get one of them
  {
    console.error("ERROR: " + error);
  }  
}

// read the data
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



