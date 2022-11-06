const {MongoClient,ServerApiVersion} = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = 5000|| PROCESS.ENV.PORT;

const app = express();
app.use(express.json());
app.use(cors());

const user = process.env.DB_USER;
const password = process.env.DB_PASS;

const uri = `mongodb+srv://${user}:${password}@cluster0.xpxsbcb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1
})

async function run (){
    try{
        await client.connect();
         const foodCollection = client.db("Jom-tapau").collection("foodCollection");
          app.post("/user", (req,res)=>{
            const newFood = req.body;
            console.log("adding new food" , newFood);
           res.send("received");


          });
       
   

    }finally{
    }
}
run().catch(console.dir);
app.get('/', (req, res)=>{
    res.send('Hello World');
});
app.listen(port,()=>{
    console.log('Listening on port',port);
})