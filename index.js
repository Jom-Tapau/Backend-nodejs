const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const express = require('express')
const cors = require('cors')
var bodyParser = require('body-parser')
const { query } = require('express')
require('dotenv').config()
const port = 5000 || PROCESS.ENV.PORT

//middleware
const app = express()
app.use(express.json())
app.use(cors())

const stripe = require("stripe")('sk_test_51MMoiTGFkQKcRUEsTZeNAQCl8HGEsoTTYy1Lf2KfBsJKpOCcp44rzQVzUXOzyVkWkEIG9zj1TbzsQvsWpcJAPwhK00RLdVbM1g');

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
    //find user using mail
    app.post('/findUser',async (req, res) => {
      const {email} = req.body;
      console.log(email)
      const query = {email:email};
      const result = await userCollection.findOne(query);
      res.send(result);
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
    //get user by email
    app.get('/getUser/:email',async(req,res)=>{
      const email = req.params.email;
      const query = {email:email}
      const result = await userCollection.findOne(query);
      console.log(result)
      res.send(result);
    })
    //get all users
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

    //get data from the food collection
    app.get('/food', async (req, res) => {
      const query = {}
      const cursor = await foodCollection.find(query)
      const result = await cursor.toArray()

      res.send(result)
    })

    // post a food on the server
    app.post('/food', async (req, res) => {
      const newFood = req.body
      console.log('adding new food', req.body, req.file)
      const result = await foodCollection.insertOne(newFood)
      res.send(result)
     
    })

    //delete food by id 
    app.get('/foodDelete/:id',async(req, res)=>{
      const id = req.params.id;
      console.log(id)
      const filter = { _id: ObjectId(id)}
      const result = await foodCollection.deleteOne(filter);
      res.send(result)
      console.log(result)
    })
    //get food by id
    app.get('food/:id',async (req,res)=>{
      const id = req.params.id;
      const filter = {_id:ObjectId(id)}
      const result = await foodCollection.findOne(filter);
      res.send(result);
      console.log(result);
    })
    //search food 
    app.post('/searchFood',async (req,res)=>{
      const searchText = req.body.text;
      const query = {}
      const cursor = await foodCollection.find(query)
      const results = await cursor.toArray()
      const newResult = results.filter(result=>result.name.toLowerCase().
      includes(searchText))

      console.log(results);
      res.send(newResult)
      console.log(req.body.text)
    })
    app.get('/user/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const user = await userCollection.findOne(query);
      res.send(user);

    })
    //update profile
    app.put('/user/:id', async(req,res)=>{
      const id = req.params.id;
      const filter ={_id:ObjectId(id)};
      const userDetails = req.body;
      const option ={upsert:true};
      const update = {$set:{
        name:userDetails.name,
        phoneNumber:userDetails.phoneNumber,
        matricValue:userDetails.matricValue,
        address:userDetails.address

      }};
      const result = await userCollection.updateOne(filter,update, option);
      res.send(result);

      console.log(userDetails)
    })
    //update food item
    app.put('/food/:id',async(req,res)=>{
      const foodID = req.params.id;
      const foodDetails = req.body
      const filter = {_id: ObjectId(foodID)}
      const options = {upset:true}
      const update = {$set:foodDetails}
      const result = await foodCollection.updateOne(filter,update, options)

      console.log(result)
      res.send(result)
      console.log(foodDetails)
    })

    //post order
    app.post('/postOrder',async(req,res)=>{
      const {newOrder} = req.body;
      console.log(newOrder)
      const result = await orderCollection.insertOne(newOrder);
      res.send(result)
      console.log(result)
    })

    //get all order
    app.get('/allOrders',async (req,res)=>{
      const query = {}
      const cursor = await orderCollection.find(query);
      const result = await cursor.toArray()
      res.send(result)
    })

    app.put('/updateRiderOrder',async (req,res)=>{
      const id = req.body.id
      const riderEmail = req.body.riderEmail
      const riderName = req.body.riderName
      const status = req.body.status;
      console.log(id,riderEmail,riderName)
      const filter = {_id: ObjectId(id)}
      const update = {$set:{status:status,riderEmail,riderName}}
      const options = {upset:true}

      const result = await orderCollection.updateOne(filter,update,options)

      console.log(result)
      res.send(result)
    })

    //get all orders of a specific rider
    app.post('/riderOrders',async(req,res)=>{
      const email = req.body.riderEmail;
      console.log(email)
      const filter={riderEmail:email}
      const cursor = await orderCollection.find(filter)
      let result=[];

      if(cursor)
        result = await cursor.toArray()
      res.send(result)
      console.log(result);
    })

    //TODO: get a specific users' order list
    app.post('/findUserOrder',async(req,res)=>{
      const email = req.body.email;
      console.log(email)
      const filter={email:email}
      const cursor = await orderCollection.find(filter)
      let result=[];

      if(cursor)
        result = await cursor.toArray()
      res.send(result)
    })

    //create-payment-intent
    app.post('/create-payment-intent', async(req,res)=>{
      const {total} = req.body
      const amountPay = total*100;

      const paymentIntent = await stripe.paymentIntents.create({
        amount:amountPay,
        currency:'usd',
        automatic_payment_methods:{
          enabled:true
        }
      })
      console.log({ClientSecret:paymentIntent.client_secret})
      res.send({ClientSecret:paymentIntent.client_secret})
    })

    //TODO: get food item by category
    //TODO: get all order list
    
    //TODO: update an order when rider accept the order and complete the order
  } finally {
  }
}
run().catch(console.dir)
app.get('/', (req, res) => {
  res.send('Welcome to Jom Tapau');
});
app.listen(port, () => {
  console.log('Listening on port', port);
});


