const {MongoClient} = require('mongodb');
const fs = require('fs');

const uri = 'mongodb+srv://BigData:BigDataProject23@bigdata.e88w7z4.mongodb.net/BigDataProject?retryWrites=true&w=majority';

const getSales = async function (startDate, endDate) { // const getSales = async function () {
    let sales;
    let toppingsArray = [];
    try {
        const client = await MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB Atlas successfully!');
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

        let csvContent = '';
        toppingsArray.forEach(row => {
            const filteredRow = row.filter(item => item !== ''); // remove empty strings
            if (filteredRow.length > 0) {
                csvContent += filteredRow.join(',') + '\n';
            } else {
                csvContent += 'null\n';
            }
        });

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
