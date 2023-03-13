// https://www.cloudkarafka.com/ הפעלת קפקא במסגרת ספק זה

//*********************//
//   Create & Send    //
//*******************//
const create = require('../Model/main.js');
var Kafka = require('node-rdkafka');


let sale = ""
let sale2 = ""
let sale3 = ""
let BranchesD = create.DBranches()
let OrdersD = create.DOrders()
k=0;
if(k<20){}
setTimeout(send, 100)
function send() {

    const prefix = "nvdhmhmb-";
    const topic= [`${prefix}default`];

    var producer = new Kafka.Producer({
        "group.id": "cloudkarafka-example",
        "metadata.broker.list": "dory-01.srvs.cloudkafka.com:9094,dory-02.srvs.cloudkafka.com:9094,dory-03.srvs.cloudkafka.com:9094".split(","),
        "socket.keepalive.enable": true,
        "security.protocol": "SASL_SSL",
        "sasl.mechanisms": "SCRAM-SHA-256",
        "sasl.username": "nvdhmhmb",
        "sasl.password": "Pcn7wdhX_HqCPvMVDJwkoOXuq1T9u2e6",
        "debug": "generic,broker,security"
    });


    var genMessage = Buffer.from("");
    var genMessage2 = Buffer.from("");
    producer.on("ready", function (arg) {
        sale = create.Orders(BranchesD.BranchName,BranchesD.BranchNumber,BranchesD.AreaName,OrdersD.Toppings )
        if(sale !="empty"){
            console.log(sale)
            genMessage = Buffer.from(sale);
            producer.produce("nvdhmhmb-default", -1, genMessage);
        }
        sale2 = create.open_close(BranchesD.BranchName)
        if(sale2 !="empty"){
            console.log(sale2)
            genMessage2 = Buffer.from(sale2);
            producer.produce("nvdhmhmb-default", -1, genMessage2);
        }
        setTimeout(() => producer.disconnect(), 0);
    })


    myLoop()
    var i = 0;
    function ready() {
        i++
        if (i < 150) myLoop();
        producer.connect()
    }

    function myLoop() {
        setTimeout(ready, 2000)
    }


    producer.on('event.error', function (err) {
        console.log("event.error")
        console.error(err);
        process.exit(1);
    });
}


setTimeout(send1, 2000)
function send1() {

    const prefix = "nvdhmhmb-";
    const topic= [`${prefix}default`];

    var producer = new Kafka.Producer({
        "group.id": "cloudkarafka-example",
        "metadata.broker.list": "dory-01.srvs.cloudkafka.com:9094,dory-02.srvs.cloudkafka.com:9094,dory-03.srvs.cloudkafka.com:9094".split(","),
        "socket.keepalive.enable": true,
        "security.protocol": "SASL_SSL",
        "sasl.mechanisms": "SCRAM-SHA-256",
        "sasl.username": "nvdhmhmb",
        "sasl.password": "Pcn7wdhX_HqCPvMVDJwkoOXuq1T9u2e6",
        "debug": "generic,broker,security"
    });


    var genMessage3 = Buffer.from("");
    producer.on("ready", function (arg) {
        sale3 = create._sta(BranchesD.BranchName)
        if(sale3 !="empty"){
            console.log(sale3)
            genMessage3 = Buffer.from(sale3);
            producer.produce("nvdhmhmb-default", -1, genMessage3);
        }
        
        setTimeout(() => producer.disconnect(), 0);
    })


    myLoop()
    var i = 0;
    function ready() {
        i++
        if (i < 150) myLoop();
        producer.connect()
    }

    function myLoop() {
        setTimeout(ready, 2000)
    }


    producer.on('event.error', function (err) {
        console.log("event.error")
        console.error(err);
        process.exit(1);
    });
}