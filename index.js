const { MongoClient, ServerApiVersion } = require('mongodb')
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const port = 5000 || PROCESS.ENV.PORT

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
    const foodCollection = client.db('Jom-tapau').collection('foodCollection')

    //get data from the food collection
    app.get('/food',async(req,res)=>{
        const query ={};
        const cursor = await foodCollection.find(query);
        const result = await cursor.toArray();

        res.send(result);
    })

    // get food by id 
    app.get('/food/:id',async(req,res)=>{
        const id = req.params.id;
        const query ={_id:ObjectId(id)}
        const result = await foodCollection.find(query);

        res.send(result);
        console.log(id);
    })

    app.post('/food', async (req, res) => {
      const newFood = req.body
      console.log('adding new food', newFood)
      const result = await foodCollection.insertOne(newFood)
      res.send(result)
    })
  } finally {
  }
}
run().catch(console.dir)
app.get('/', (req, res) => {
  res.send('Hello World')
})
app.listen(port, () => {
  console.log('Listening on port', port)
})
