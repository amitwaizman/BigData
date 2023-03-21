/*
Written by: Ilan Sirisky
This is a Node.js module that exports a function named getSales which retrieves sales data from a MongoDB Atlas cluster,
filters the data based on a date range, extracts a specific field from the data and writes the extracted data to a CSV file.
*/

const {MongoClient} = require('mongodb');
const fs = require('fs');

const uri = 'mongodb+srv://BigData:BigDataProject23@bigdata.e88w7z4.mongodb.net/BigDataProject?retryWrites=true&w=majority';

const getSales = async function (startDate, endDate) {
    let sales;
    let toppingsArray = [];
    try {
        // Connect to the MongoDB cluster
        const client = await MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB Atlas successfully!');
        // Make the appropriate DB calls
        const collection = client.db('BigDataProject').collection('Sales');
        sales = await collection.find().toArray();
        for (const sale of sales) {
            const content = JSON.parse(sale.content);
            const date = new Date(content["2"].Date);

            if (date >= startDate && date <= endDate) {
                toppingsArray.push(content["2"].Topping);
            }
        }
        console.log("Toppings array ready");

        // Write to CSV file
        let csvContent = '';
        toppingsArray.forEach(row => {
            const filteredRow = row.filter(item => item !== ''); // remove empty strings
            if (filteredRow.length > 0) {
                csvContent += filteredRow.join(',') + '\n';
            } else {
                csvContent += 'null\n';
            }
        });

        // Write to file
        fs.writeFileSync('toppings.csv', csvContent);
        console.log('File saved successfully!');

        client.close();
    } catch (err) {
        console.error(err);
    }
    return toppingsArray;
}

module.exports = {
    getSales,
}
