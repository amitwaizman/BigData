// https://www.cloudkarafka.com/ הפעלת קפקא במסגרת ספק זה

//*********************//
//   Create & Send    //
//*******************//
const create = require('../modles/data.js');
var Kafka = require('node-rdkafka');


let sale = ""
let BranchesD = create.DBranches()
let OrdersD = create.DOrders()
setTimeout(send, 1000)

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

    producer.on("ready", function (arg) {

        sale = create.Orders(BranchesD.BranchName,BranchesD.BranchNumber,BranchesD.AreaName,OrdersD.Toppings )
        console.log(sale)
        genMessage = Buffer.from(sale);

        producer.produce("nvdhmhmb-default", -1, genMessage);
        setTimeout(() => producer.disconnect(), 0);
    })

    myLoop()

    var i = 0;
    function ready() {
        i++
        if (i < 50) myLoop();
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