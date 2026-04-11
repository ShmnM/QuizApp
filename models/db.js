
const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.ATLAS_URI;
const client = new MongoClient(uri);

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("cs355");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

function getCollection(name) {
  return db.collection(name);
}

module.exports = {
  connectDB,
  getCollection,
};
