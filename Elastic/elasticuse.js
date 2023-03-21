const axios = require('axios');
const { Client } = require('@elastic/elasticsearch');


const elastiClient = new Client({ node: 'http://localhost:9200' });

// Define the index and document to add
const indexName = 'kafkatry';
const typeName = 'json';

async function getDataFromElastic(key, data) {
    const newIndex = indexName + key;
    let ans = JSON.parse("{}");
    try {
      const response = await elastiClient.search({
        index: newIndex,
        type: key,
        body: data // message.value.toString() // content
      });
      ans = response.body;
      console.log(`Document searched ${ans}`);
    } catch (error) {
      console.log(`Error search: ${error}`);
    }
    return ans;
  }
  
async function getDataFromElastic2(key, data) {
    const newIndex = indexName + key;
    let ans = JSON.parse("{}");
    try {
        const response = await axios.get(`http://localhost:9200/${indexName + key}/_search`, {
        headers: {
            'Content-Type': 'application/json'
        },
        data: data});
        ans = response.data;
        console.log(`Document added to Elasticsearch with id ${ans}`);
    } catch (error) {
        console.log(`Error adding document to Elasticsearch: ${error}`);
    }
    return ans;
}

async function getHitsFromElastic(key, data)
{
const list = (await getDataFromElastic(key, data)).hits.hits;
const mapList = list.map(item => {return item._source;});
return mapList;
}
  
  module.exports = {
    getDataFromElastic,
    getHitsFromElastic,
  }
  
  