const {MongoClient,ServerApiVersion} = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = 5000;

const app = express();
app.use(express.json());
app.use(cors());

//user=dbuser2;
//password=AnOyXN8v59bGpYJE

const uri = 'mongodb+srv://dbuser2:AnOyXN8v59bGpYJE@cluster0.in8lp.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1
})

async function run (){
    try{
        await client.connect();
        const foodCollection = client.db("Jom-tapau").collection("food");

        app.get('/', (req, res)=>{
            res.send('Hello World');
        });

    }finally{
    }
}
run().catch(console.dir);
app.listen(port,()=>{
    console.log('Listening on port',port);
})