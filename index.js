const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const port = 5000 || PROCESS.ENV.PORT

//middleware
const app = express()
app.use(express.json())
app.use(cors())

const user = process.env.DB_USER
const password = process.env.DB_PASS

const uri = `mongodb+srv://${user}:${password}@cluster0.xpxsbcb.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1
})

async function run () {
  try {
    await client.connect()
    const foodCollection = client.db('Jom-tapau').collection('foodCollection') //collection of food items

    const userCollection = client.db('Jom-tapau').collection('userCollection') //collection of user items

    const orderCollection = client.db('Jom-tapau').collection('orderCollection') //collection of order items

    //get data from the food collection
    app.get('/food', async (req, res) => {
      const query = {}
      const cursor = await foodCollection.find(query)
      const result = await cursor.toArray()

      res.send(result)
    })
//delete food by id

    // get food by id
    app.get('/food/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await foodCollection.findOne(query)

      res.send(result)
      console.log(id)
    })


    // post a food on the server
    app.post('/food', async (req, res) => {
      const newFood = req.body
      console.log('adding new food', newFood)
      const result = await foodCollection.insertOne(newFood)
      res.send(result)
    })

    // post user information to mongodb
    app.post('/user', async (req, res) => {
      const newUser = req.body
      const userEmail = req.body.email;
      const query = {email:newUser.email}

      if(userEmail){
        const userExist  = await userCollection.findOne(query);

      if(userExist){
        const error={errorMessage:'user already exists'};
        console.log(userExist)
        return res.send(error)
      }
      
      const result = await userCollection.insertOne(newUser);
      console.log('email pai nai: '+userEmail);
      res.send(result);
      }
    })

    app.get('/user',async(req,res)=>{
      const query={};
      const cursor = await userCollection.find(query)
      const result = await cursor.toArray();
      res.send(result);
    })

    //get user by id
    app.get('/user/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await userCollection.findOne(query)
      res.send(result)
    })
    //approve an user to rider
    app.put('/addRider',async (req, res) => {
      const id = req.body.id;
      console.log(id);
      const filter =  { _id: ObjectId(id)}
      const options ={upset:true};
      const update = {$set:{rider:true}}

      const result = await userCollection.updateOne(filter,update,options);

      console.log(result);
    })

    //reject teh rider 
    app.put('/rejectRider',async (req,res)=>{
      const id = req.body.id;
      const filter = {_id: ObjectId(id)}
      const options = {upset:true}

      const update = {$set:{rider:"rejected"}}
      const result = await userCollection.updateOne(filter,update,options)

      console.log(result)
    })

    //TODO: get food item by category
    //TODO: delete user by id
    //TODO: post order to order list
    //TODO: get all order list
    //TODO: get a specific users' order list
    //TODO: update an order when rider accept the order and complete the order
    //TODO: delete a specific food by id -
  } finally {
  }
}
run().catch(console.dir)
app.get('/', (req, res) => {
  res.send('Hello World');
});
app.listen(port, () => {
  console.log('Listening on port', port);
});


