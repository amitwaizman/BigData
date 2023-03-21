//Amit Waizman


// *********************//
// Create & Send       //
// *******************//
const create = require('../Model/main.js');
var Kafka = require('node-rdkafka');


let sale = ""
let sale2 = ""
let sale3 = ""
let BranchesD = create.DBranches()
let OrdersD = create.DOrders()



     //                              https://www.confluent.io                                                       // 
    //*************************************************************************************************************//
   //This class sends messages to the Kafka.                                                                      //
  //It uses two separate setTimeout calls to perform different functions of sending messages every few seconds.  // 
 //The code also defines a Kafka producer with the appropriate credentials to connect to the broker.            //
//*************************************************************************************************************//



k = 0;
if (k < 20) {}
setTimeout(send, 100)


function send() {
    const producer = new Kafka.Producer({
        'metadata.broker.list': 'pkc-6ojv2.us-west4.gcp.confluent.cloud:9092',
        'security.protocol': 'SASL_SSL',
        'sasl.mechanisms': 'PLAIN',
        'sasl.username': 'NKMJKKJBGXRREWXO',
        'sasl.password': 'HLbaDfw3sj1t3ljuCxH9DhjKkojEecY/JzFFbyonQgQax4Uc55j5hdzg1QHfTSgW'
    });

    producer.connect()

    var genMessage = Buffer.from("");
    var genMessage2 = Buffer.from("");

    producer.on("ready", () => {

        var i = 0
        myLoop()
        function ready() {
            i++
            if (i < 1000) 
                myLoop();
            
            SendToKafka()
        }

        function myLoop() {
            setTimeout(ready, 1500)
        }
        function SendToKafka() {
            sale = create.Orders(BranchesD.BranchName, BranchesD.BranchNumber, BranchesD.AreaName, OrdersD.Toppings)
            if (sale != "empty") {
                console.log(sale)
                genMessage = Buffer.from(sale);
                producer.produce("BigData1", -1, genMessage);
            }
            sale2 = create.open_close(BranchesD.BranchName)
            if (sale2 != "empty") {
                console.log(sale2)
                genMessage2 = Buffer.from(sale2);
                producer.produce("BigData1", -1, genMessage2);
            }
        }

    })

    producer.on('event.error', function (err) {
        console.log("event.error")
        console.error(err);
        process.exit(1);
    });
}


setTimeout(send1, 2000)
function send1() {

    const producer = new Kafka.Producer({
        'metadata.broker.list': 'pkc-6ojv2.us-west4.gcp.confluent.cloud:9092',
        'security.protocol': 'SASL_SSL',
        'sasl.mechanisms': 'PLAIN',
        'sasl.username': 'NKMJKKJBGXRREWXO',
        'sasl.password': 'HLbaDfw3sj1t3ljuCxH9DhjKkojEecY/JzFFbyonQgQax4Uc55j5hdzg1QHfTSgW'
    });

    producer.connect()


    var genMessage3 = Buffer.from("");
    producer.on("ready", () => {

        var i = 0
        myLoop()
        function ready() {
            i++
            if (i < 1000) 
                myLoop();
            
            SendToKafka()
        }

        function myLoop() {
            setTimeout(ready, 1500)
        }
        function SendToKafka() {
            sale3 = create._statuse(BranchesD.BranchName, BranchesD.AreaName)
            if (sale3 != "empty") {
                console.log(sale3)
                genMessage3 = Buffer.from(sale3);
                producer.produce("BigData1", -1, genMessage3);
            }
        }
    })

    producer.on('event.error', function (err) {
        console.log("event.error")
        console.error(err);
        process.exit(1);
    });
}