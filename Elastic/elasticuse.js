/*****************
 * GILAD LIVSHIT *
 *****************/

// Imports
const axios = require('axios');
const { Client } = require('@elastic/elasticsearch');


const elastiClient = new Client({ node: 'http://localhost:9200' });

// Define the index and document to add
const indexName = 'kafkatry';

/**
 * performing search query on the DB, and then we get the whole result of the quary 
 * @param {*} key symbol of family
 * @param {*} data the body of the query - JSON/dict
 * @returns 
 */
async function getDataFromElastic(key, data) {
  //setting the index name  
  const newIndex = indexName + key;
  let ans = JSON.parse("{}");
  try {
    // get the response from query
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

/**
 * as getDataFromElastic - we perform a query on the DB, but the results are only the hits,
 * we ignore the rest of the data, only wich dock has passed, without metadata
 * @param {*} key family symbol
 * @param {*} data body of query
 * @returns 
 */
async function getHitsFromElastic(key, data)
{
const list = (await getDataFromElastic(key, data)).hits.hits;
const mapList = list.map(item => {return item._source;});
return mapList;
}
  
const day = 86400000;

/**
 * the function returns the start of the day (now) and the end of it in ms
 * @returns 
 */
function dateToEpoch() {
  let thedate = new Date();
  let time = thedate.getTime();
  time = time - (time % day);
  let end = time + day;
  return { time , end };
}

/**
 * by given date, the function returns the start of the day and the end of it in ms
 * @returns 
 */
function dateToEpochDater(date)
{
  let startTime = Date.parse(date);
  
  startTime = startTime - (startTime % day);
  let endTime = startTime + day;
  return { startTime , endTime };
}

// exporting the functions
module.exports = {
  getDataFromElastic,
  getHitsFromElastic, dateToEpoch, dateToEpochDater,
}