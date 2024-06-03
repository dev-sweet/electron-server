const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
const { ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

// use middlewears
app.use(cors());
app.use(express.json());

// create mongoClient
const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const run = async () => {
  try {
    await client.connect();
    const productDB = client.db("product_db");
    const productCollection = productDB.collection("product_collection");

    //  handle product routes and requests

    // handle product post request
    app.post("/products", async (req, res) => {
      console.log("user hit the api post");
      const proudct = req.body;
      const result = await productCollection.insertOne(proudct);
      res.send(result);
    });

    // handle products get request
    app.get("/products", async (req, res) => {
      const result = productCollection.find({});
      const products = await result.toArray();
      res.send(products);
    });

    // handle products get request for sing product
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const result = await productCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });
  } finally {
    // await client.close();
  }
};

run().catch((err) => console.dir(err));

// listen the app
app.listen(port, () => {
  console.log(`Your server is running at PORT:`, port);
});
