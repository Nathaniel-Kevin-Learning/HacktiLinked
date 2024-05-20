const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_DB_URL;

const client = new MongoClient(uri);
const database = client.db('Challange1P3');

module.exports = { database, client };
