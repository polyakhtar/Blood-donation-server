const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const express=require('express');
const app=express();
require('dotenv').config();
const cors=require('cors');
const port=process.env.PORT||5000;


// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mjqzqbo.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
    
    }
    finally{

    }
}
run().catch(err=>console.error(err))

app.get('/',(req,res)=>{
    res.send('blood dontaion api running')
})
app.listen(port,()=>{
    console.log(`blood donation port running on port ${port}`)
})