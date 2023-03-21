/*
Written by: Eldad Tsemach
The code is a Node.js server that handles requests for different data sets from Redis and Elasticsearch databases.
It also sends requests to an external API and returns the requested data in JSON format.
The endpoints include getting Redis data, getting the top 5 addings, getting the top 5 fastest handlers,
getting the average handle time, getting all orders from today, and getting data from an external API.
*/

/*
Elastic queries: by Gilad Livshitz, we used here queries based on the tasks
*/

const redis = require('redis');
const express = require('express');
const cors = require('cors')
const axios = require('axios');


// const corsOptions = {
//   origin: 'http://localhost:3002',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

const {getDataFromElastic, getHitsFromElastic} = require('../Elastic/elasticuse')

const app = express();

app.use(cors());


// Create a Redis client
const client = redis.createClient({ host: 'localhost', port: 8001 });

client.connect()

// Log an error if the Redis client encounters an error
client.on('error', (err) => {
  console.log('Redis client error:', err);
});

// The /redis-data endpoint gets data from the Redis client and sends it as a response.
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

// The /getTop5Addings endpoint sends a query to Elasticsearch and returns the top 5 most common terms in the "Topping" field of the documents.
app.get('/getTop5Addings', async (req, res) => {
  //get http://localhost:9200/kafkat/_search
  const data = {
    "size": 0,
    "aggs": {
      "top5_adds": {
        "terms": {
          "field": "Topping.keyword",
          "size": 5
        }
      }
    }
  };

  const myList = (await getDataFromElastic('2', data)).aggregations.top5_adds.buckets;
  const myNewList = myList.map(item => {
        return {
          label: item.key,
          value: item.doc_count
        }
      });
      
      // console.log(myNewList);
      res.send(myNewList);
})

// The /getTop5FastestHandlers endpoint sends a query to Elasticsearch and returns the 5 branches with the fastest handling time of orders.
app.get('/getTop5FastestHandlers', async (req, res) => {
  const query = {
        "size": 0,
        "query": {
            "match_all": {}
        },
        "aggs": {
            "order_ids": {
                "terms": {
                    "field": "Branch_Name.keyword",
                    "order": {
                        "min_time": "asc"
                    },
                    "size": 5
                },
                "aggs": {
                    "min_time": {
                        "min": {
                            "field": "DateDif"
                        }
                    }
                }
            }
        }
      };
  
  const myList = (await getDataFromElastic('1', query)).aggregations.order_ids.buckets;
  const myNewList = myList.map(item => {
        return {
          label: item.key,
          value: item.min_time.value / 60000
        }
      });
      
  // console.log(myNewList);
  res.send(myNewList);
})

// The /getAvarageHandleTime endpoint sends a query to Elasticsearch and returns the average handle time of all orders.
app.get('/getAvarageHandleTime', async (req, res) => {
  
  // const finished = await getHitsFromElastic('1', {"size": 10000});
  // const started = await getHitsFromElastic('2', {"size": 10000});
  const query = {
    "size": 0,
    "query": {
        "match_all": {}
    },
    "aggs": {
        "avg_date": {
            "avg": {
                "field": "DateDif"
            }
        }
    }
  };

  const avg_wait = (await getDataFromElastic('1', query)).aggregations.avg_date.value;
  const data = {data: Math.round(avg_wait / 600000)}
  res.send(data);
})

// The /getAllOrdersFromToday endpoint gets data from Redis and Elasticsearch and returns all orders from today.
app.get('/getAllOrdersFromToday', async (req, res) => {
  const keys = await client.keys('*')

  if (!keys || keys.length === 0) {
    res.send([]);
    return;
  }

  let {startTime, endTime} = dateToEpoch();
  const query = {
    "size": 10000,
    "query": {
        "range": {
            "Date": {
                "gte": startTime,
                "lt": endTime
            }
        }
    }
  };

  const hits = await getHitsFromElastic('2', query);

  const data = {};
  hits.forEach(item => {
    let k = `Order_${item.Number_Order}`;
    data[k] = JSON.stringify(item);
  })

  const result = {}
  Object.keys(data)
  .filter(key => key.includes("Order_"))
  .forEach(key => {
    result[key] = data[key]
  })
  
  
  res.send(result);
  // console.log(result)
})

// The /getdatafrombigml endpoint gets data from a BigML API and sends it as a response.
const bigMlURL = "http://localhost:3000/bigml/getbydates"
app.get('/getdatafrombigml', async (req, res) => {
  console.log("got new request for bigml data")
  const startdate = req.query.startdate;
  const enddate = req.query.enddate;

  const result = (await axios.get(`${bigMlURL}?startdate=${startdate}&enddate=${enddate}`)).data
  console.log(result)

  res.send(result);
})

app.get('/getdatafromelastic', async (req, res) => {
  console.log("got new request for elastic data")
  const date = req.query.date;
  const branch = req.query.branch;
/*
  example of data you need to send:
  {
    "1": {
      'Hour': 'Loading',
      'Time to handle': 'Loading',
      'Amount': 'Loading',
      'Olives': 'Loading',
      'Mushrooms': 'Loading',
      'Bulgarian' :'Loading',
      'Onion': 'Loading',
      'Tomato':'Loading',
      'corn':'Loading',
      'eggplant':'Loading',
      'pepper': 'Loading'
    }
  }
*/
  console.log(result)

  res.send(result);
})

const server = express()
  .use(app)
  .listen(3001, () => {
    console.log(`Listening Socket on http://localhost:3001`)
  });

  function dateToEpoch() {
  let thedate = new Date();
  const day = 86400000;
  let time = thedate.getTime();
  time = time - (time % day);
  let end = time + day;
  return { time , end };
}
