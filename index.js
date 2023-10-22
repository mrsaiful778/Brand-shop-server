require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5010;


app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zvc5ptn.mongodb.net/?retryWrites=true&w=majority`;





// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const userCollection = client.db('EcommerceDB').collection('user');
    const detailsCollection = client.db('detailsDB').collection('details');

   

    app.post('/products', async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    })
    app.get('/products', async(req, res)=>{
      const result = await userCollection.find().toArray()
      res.send(result)
    })
   app.get('/products/:id', async(req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await userCollection.findOne(query);
    res.send(result);
    
   })

   app.put('/products/:id', async(req, res) => {
    const id = req.params.id;
    const itemes = req.body
    const filter = { _id: new ObjectId(id)};
    const options = { upsert: true };
    const updateItem = { 
      $set: {
        name: itemes.name,
        photo: itemes.photo,
        price: itemes.price,
        rating: itemes.rating,
        brand: itemes.brand,
        category: itemes.category,
      }
    }
    const  result = await userCollection.updateOne(filter, updateItem, options)
    res.send(result)


   })

    app.post('/carts', async (req, res) => {
      const cart = req.body;
      console.log(cart);
      const result = await detailsCollection.insertOne(cart);
      res.send(result);
  })
  
  app.get('/carts', async (req, res) => {
      const result = await detailsCollection.find().toArray();
      res.send(result);
  })

   app.delete('/carts/:id', async (req, res) => {
        const id = req.params.id
        const query = { _id: new ObjectId(id) };
        const result = await detailsCollection.deleteOne(query)
        res.send(result)
        console.log(result);

   })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
  res.send('server is running ')
})
app.listen(port, () => {
  console.log(`E-commerce based site is running on PORT: ${port}`)
})