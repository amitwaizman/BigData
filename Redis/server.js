const redis = require('redis');

// Set up Redis client
const redisClient = redis.createClient({ host: 'localhost', port: 8001 });
messages = [
    '{"0":{\"Branch_Name\":\"Or Akiva\",\"Open/Close\":\"open\"}}',
    '{"2":{"Branch_Name":"Ramat_Gan_the_city_center","Area":"Central","status":"in process","Date":"2023/3/16,20:50","Branch_Number":939529,"Topping":["pepper","Onion","Tomato","Bulgarian","corn"],"Number_Order":1678992665721}}',
    '{"2":{"Branch_Name":"Kfar Kara","Area":"Sharon","status":"in process","Date":"2023/3/16,20:50","Branch_Number":86100,"Topping":["Tomato","corn","Mushrooms","Bulgarian","eggplant"],"Number_Order":1678992706267}}',
    '{"0":{"Branch_Name":"Zichron_Yaakov","Open/Close":"close"}}',
    '{"1":{"Branch_Name":"Kiryat_Ata","Number_Order":1678992731726,"status":"finish"}}',
    '{"2":{"Branch_Name":"Maalot","Area":"North","status":"in process","Date":"2023/3/16,20:51","Branch_Number":682051,"Topping":["pepper","Bulgarian","Tomato","eggplant"],"Number_Order":1678992740190}}',
    '{"1":{"Branch_Name":"Kiryat_Ata","Number_Order":1678992731726,"status":"finish"}}'
]

function sendDataToRedis(key, val){
    console.log(val)
    redisClient.set(key.toString(), val, function(err, reply) {
        if (err) {
        console.error('Error writing message to Redis:', err);
        } else {
        console.log('Message written to Redis:', reply);
        }
    });
}

redisClient.connect().then(
    messages.forEach(message => {
        // console.log(message)
        dict = JSON.parse(message)
        // console.log(dict)
        for (let k in dict){
            switch (k){
                case '0':{
                    sendDataToRedis(dict[k]["Branch_Name"], dict[k]["Open/Close"])
                    break;
                }
                case '1': {
                    sendDataToRedis(dict[k]["Number_Order"], JSON.stringify(dict[k]))
                    break;
                }
                case '2': {
                    sendDataToRedis(dict[k]["Number_Order"], JSON.stringify(dict[k]))
                    break;
                }
                default: {
                    console.log(k)
                    break;
                }
            }
            console.log(`${k}:${dict[k]}`)
        }
        
    })
)


// Log any errors from the Redis client
redisClient.on('error', function(err) {
  console.error('Error with Redis client:', err);
});