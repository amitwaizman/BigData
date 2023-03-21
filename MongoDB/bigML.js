/*
Written by: Ilan Sirisky
This code uses the BigML API to create an Association model, retrieve the model's URL, and then fetch the data from the retrieved URL.
It also includes a function that processes the fetched data to return the associations between the items in the dataset.
The code is designed to be exported as a module, with the functions getResourceURL, getData,
and getAssociations available for use in other parts of the codebase.
*/

const bigml = require('bigml');
const fetch = require("node-fetch");

process.env.BIGML_USERNAME = 'ilan1il1000';
process.env.BIGML_API_KEY = 'c873501d60fe9e2981301d10a3895cf351165ad8';
const apiUsername = process.env.BIGML_USERNAME;
const apiKey = process.env.BIGML_API_KEY;
const BIGML_AUTH = `username=${apiUsername};api_key=${apiKey}`;

const sourcePath = './toppings.csv';

const bigmlClient = new bigml.BigML(apiUsername, apiKey);

const source = new bigml.Source(bigmlClient);


async function getResourceURL() {
    return new Promise((resolve, reject) => {
        // Create source
        source.create(sourcePath, (err, sourceInfo) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                // Create dataset
                console.log("Source created")
                const dataset = new bigml.Dataset(bigmlClient);
                dataset.create(sourceInfo.resource, (err, datasetInfo) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        // Create model
                        console.log("Dataset created");
                        association = new bigml.Association(bigmlClient);
                        association.create(datasetInfo.resource, (err, associationInfo) => {
                            if (err) {
                                console.log(err);
                                reject(err);
                            } else {
                                console.log("Model created");
                                console.log('Association info:', associationInfo);

                                resource_uri = associationInfo.location + associationInfo.resource.split('/')[1] + '?' + BIGML_AUTH;
                                console.log(resource_uri);
                                resolve(resource_uri);
                            }
                        });
                    }
                });
            }
        });
    });
}

// fetch data from bigML using the resource url
const getData = async function (url) {
    var data = await fetch(url)
    data = await data.json()
    return data
}

// get the associations from the data
function getAssociations(data) {
    let items = data.associations.items
    let rules = data.associations.rules
    let result = {}
    let i = 0
    for (let rule of rules) {
        let lhs = rule.lhs[0]
        let rhs = rule.rhs[0]
        let lhsItem = items[lhs]
        let rhsItem = items[rhs]
        let confidence = rule.confidence
        let support = rule.support[0]
        let data = {
            Antecedent: lhsItem.name,
            Consequent: rhsItem.name,
            "Support (\%)": (support * 100).toFixed(2),
            "Confidence (\%)": (confidence * 100).toFixed(2)
        }
        result[i] = data
        i++
    }
    return result
}

module.exports = {
    getResourceURL,
    getData,
    getAssociations
}
