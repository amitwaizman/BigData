const express = require('express');
const bodyParser = require('body-parser');
const {getSales} = require('./readSales');
const getRules = require('./bigML')

const app = express();
app.use(bodyParser.json());

// http://localhost:3000/bigml/getbydates?startdate=2023-03-16T00:00:00.000Z&enddate=2023-03-18T23:59:59.999Z

// API function to write data to BigML
app.get('/bigml/getbydates', async (req, res) => {
    const startdate = req.query.startdate;
    const enddate = req.query.enddate;
    const startDate = new Date(startdate);
    const endDate = new Date(enddate);

    const aa = await getSales(startDate, endDate);
    console.log(aa);
    const resource_uri = await getRules.getResourceURL();
    let timed_out = 0;
    var waitForData = async function () {
        let data = await getRules.getData(resource_uri)
        if (data.code === 200) {
            const rules = getRules.getAssociations(data)
            console.log("Finally: " + JSON.stringify(rules))
            res.send(rules)
        } else {
            setTimeout(waitForData, 15000);
        }
        timed_out += 1;
        if (timed_out === 5){
            res.send("Timed out")
        }
    }
    setTimeout(waitForData, 15000);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
