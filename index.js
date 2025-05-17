const express = require("express");
const cors = require("cors")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config()
const port = process.env.PORT || 3000

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req,res)=>{
    res.send("coffe Store")
})

// console.log(process.env.DB_user)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster.gnlwsvv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection = client.db("coffeeDb").collection("coffee")
    
    app.post("/coffees", async (req,res)=>{
      const newCoffee = req.body 
      const result = await coffeeCollection.insertOne(newCoffee)
      res.send(result)
    })

    app.get("/coffees", async (req,res)=>{
      const result = await coffeeCollection.find().toArray()
      res.send(result)
    })

    app.put("/coffees/:id", async (req,res)=>{
        const id = req.params.id 
        const filter = {_id : new ObjectId(id)}
        const option = { upsert : true }
        const updatedCoffee = req.body 
        const updatedDoc = {
          $set: updatedCoffee
        }
        const result = await coffeeCollection.updateOne(filter,updatedDoc,option)
        res.send(result)
    })

    app.delete("/coffees/:id", async (req,res)=>{
        const id = req.params.id
        const query = { _id : new ObjectId(id)}
        const result = await coffeeCollection.deleteOne(query)
        res.send(result)
    })

    app.get("/coffees/:id",async (req,res)=>{
        const id = req.params.id 
        const qurey = { _id : new ObjectId(id)}
        const result = await coffeeCollection.findOne(qurey)
        res.send(result)
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, ()=>{
    console.log(`Coffe Server is running port: ${port}`)
})