const {MongoClient} = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = 5000;

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res)=>{
    res.send('Hello World');
});

app.listen(port,()=>{
    console.log('Listening on port',port);
})