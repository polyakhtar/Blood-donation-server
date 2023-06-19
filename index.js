
const { MongoClient, ServerApiVersion } = require('mongodb');
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
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
const donorCollection=client.db('bloodDonor').collection('donor');
app.post('/donor',async(req,res)=>{
    const donor=req.body;
    const result=await donorCollection.insertOne(donor);
    res.send(result)
})
app.get('/donors',async(req,res)=>{
  const query={};
  const result=await donorCollection.find(query).toArray();
  res.send(result)
})
   
  } finally {
    
  }
}
run().catch(console.log);



app.get('/',(req,res)=>{
    res.send('blood dontaion api running')
})
app.listen(port,()=>{
    console.log(`blood donation port running on port ${port}`)
})