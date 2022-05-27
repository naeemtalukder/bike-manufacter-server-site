const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// app.use(cors());
app.use(express.json());
app.use(
    cors({
        origin: true,
        optionsSuccessStatus: 200,
        credentials: true,
    })
);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ao6h9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uiw7b.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        console.log('db connect');
        const productCollection = client.db('bikeMenufacture').collection('products');
        const orderCollection = client.db('bike_orders').collection('orders');
        const reviewCollection = client.db('bike_reviews').collection('reviews');
        const userCollection = client.db('bike_user').collection('users');

        //PUT users API
        app.put('/user/:email', (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })s

        // GET products API
        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })
        // GET products API
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id) };
            const result = await productCollection.findOne(query);
            res.send(result);
        })
        // POST product API
        app.post('/product', async (req, res) => {
            const data = req.body;
            const result = await productCollection.insertOne(data);
            res.send(result);
        });

        //DELETE product API
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            console.log(result)
            res.send(result);
        });

        // POST product API
        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        });

        //GET order api
        app.get('/order', async (req, res) => {
            const user = req.query.user;
            const query = { user: user };
            const orders = await orderCollection.find(query).toArray();
            res.send(orders);
        })


        // GET reviews API
        app.get('/review', async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        // POST reviews API
        app.post('/review', async (req, res) => {
            const data = req.body;
            const result = await reviewCollection.insertOne(data);
            res.send(result);
        });

    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})