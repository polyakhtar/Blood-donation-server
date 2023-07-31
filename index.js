const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
const stripe = require("stripe")('sk_test_51M66GGIo1LJSizd52lmGNVzhlq6Zg9xPhKmCDiFs0O0JWW4QSCnJcMAPuN0Lkaaj3vJn5KrUuRsJnDvpLXDeMNSX00HO7rHyvl');
require('dotenv').config();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mjqzqbo.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const donorCollection = client.db('bloodDonor').collection('donor');
    const usersCollection = client.db('bloodDonor').collection('users');
    const approvedDonorCollection = client.db('bloodDonor').collection('approvedDoonr');
    const blogCollection = client.db('bloodDonor').collection('blogCollection');
    const commentCollection = client.db('bloodDonor').collection('comments');
    const reviewCollection = client.db('bloodDonor').collection('reviews');
    const paymentCollection = client.db('bloodDonor').collection('payments');

    app.post('/donor', async (req, res) => {
      const donor = req.body;
      const result = await donorCollection.insertOne(donor);
      res.send(result);
    });

    app.post('/approveddonor', async (req, res) => {
      const apdonor = req.body;
      const result = await approvedDonorCollection.insertOne(apdonor);
      res.send(result);
    });
    

    app.get('/donors', async (req, res) => {
      const query = {};
      const result = await donorCollection.find(query).toArray();
      res.send(result);
    });

    app.get('/approveddonor', async (req, res) => {
      const query = {};
      const result = await approvedDonorCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result=await usersCollection.insertOne(user);
      res.send(result)
  });

    app.get('/users/admin/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isAdmin: user?.role === 'admin' });
    });
    // Payment System
    app.post("/create-payment-intent", async (req, res) => {
      const booking = req.body;
      const price = booking.price;
      const amount = price * 100;
      const paymentIntent = await stripe.paymentIntents.create({
        currency: "usd",
        amount: amount,
        payment_method_types: ["card"],
      });
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });

    app.post('/payment', async (req, res) => {
      const payment = req.body;
      const result = await paymentCollection.insertOne(payment);
      res.send(result);
    });
    app.get('/payments',async(req,res)=>{
      const query={};
      const result=await paymentCollection.find(query).toArray();
      res.send(result)
    })
    app.post('/blogs', async (req, res) => {
      const blog = req.body;
      const result = await blogCollection.insertOne(blog);
      res.send(result);
    });

    app.get('/blogs', async (req, res) => {
      const query = {};
      const result = await blogCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const objectId = new ObjectId(id);
        const query = { _id: objectId };
        const result = await blogCollection.findOne(query);
        res.send(result);
      } catch (error) {
        res.status(400).send({ error: "Invalid ID" });
      }
    });

    app.post('/comments', async (req, res) => {
      const comment = req.body;
      const result = await commentCollection.insertOne(comment);
      res.send(result);
    });

    app.get('/comments', async (req, res) => {
      const query = {};
      const sort = { _id: -1 }; // Sort by the _id field in descending order
      const result = await commentCollection.find(query).sort(sort).toArray();
      res.send(result);
    });
    app.get('/comments/:blogId', async (req, res) => {
      const blogId = req.params.blogId;
      const query = { blogId };
      const result = await commentCollection.find(query).toArray();
      res.set('Cache-Control', 'no-store'); // Add this line to disable caching
      res.send(result);
    });
    
    app.post('/reviews', async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    app.get('/reviews', async (req, res) => {
      const query = {};
      const result = await reviewCollection.find(query).toArray();
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
}

run().catch(console.log);

app.get('/', (req, res) => {
  res.send('blood donation api running');
});

app.listen(port, () => {
  console.log(`blood donation port running on port ${port}`);
});