const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m0n59.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri)

async function run() {
  try {
    await client.connect()
    const database = client.db("food-delivery");
    const foodCollection = database.collection("food");
    const userCollection = database.collection("user");

    app.get('/food', async (req, res) => {
      const cursor = foodCollection.find({});
      const food = await cursor.toArray()
      res.send(food)
    })

    app.get('/user', async (req, res) => {
      const cursor = userCollection.find({});
      const user = await cursor.toArray()
      res.send(user)
    })

    app.get('/food/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const result = await foodCollection.findOne(query);
      console.log(result)
      res.json(result)
    })

    app.get('/user/:email', async (req, res) => {
      const email = req.params.email;
      const query = { emailName: email }
      const result =userCollection.find(query);
      const users= await result.toArray()
      res.json(users)
    })

    app.post('/food', async (req, res) => {
      const newUser = req.body;
      const result = await foodCollection.insertOne(newUser);
      res.json(result)
    })

    app.post('/placeOrder', async (req, res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser)
      console.log(req.body.emailName)
      res.json(result)
    })

    app.delete('/user/:id',async (req,res)=>{
      const id=req.params.id
      const query = { _id: ObjectId(id) }
      const result = await userCollection.deleteOne(query);
      res.json(result)
    })

    app.put('/user/:id',async(req,res)=>{
      const id=req.params.id
      const filter = { _id: ObjectId(id) }
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status:'approved'
        },
      }
      const result = await userCollection.updateOne(filter, updateDoc, options)
      res.json(result)
    })

  }
  finally {
    // await client.close()
  }
}
run().catch(console.dir)



app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.listen(port, () => {
  console.log(`server running on ${port}`)
})