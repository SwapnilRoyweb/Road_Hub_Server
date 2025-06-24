require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ad0f77m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        //await client.connect();

        const userCollection = client.db("Road_Hub").collection("users");
        const itemCollection = client.db("Road_Hub").collection("items");
        const joinedItemsCollection = client.db("Road_Hub").collection("joinedItems");

        // users
        app.get('/users', async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result);
        })

        app.post('/users', async (req, res) => {
            const user = req.body;

            const query = {email: user.email};
            const existingUser = await userCollection.findOne(query);
            console.log(existingUser);
            if(existingUser){
                return res.send({message : 'user already exist'})
            }

            const result = await userCollection.insertOne(user);
            console.log(user);
            res.send(result);
        })

        // RoadHub items
        app.get('/items', async (req, res) => {
            const result = await itemCollection.find().toArray();
            res.send(result);
        })

        app.post('/items', async (req, res) => {
            const item = req.body;

            const query = {name : item.name};
            const existingItem = await itemCollection.findOne(query);
            if(existingItem){
                return res.send({message: 'Item already exist'})
            }

            const result = await itemCollection.insertOne(item);
            res.send(result);
        })

        // upvote routes
        app.get('/joins', async (req, res) => {
            const result = await joinedItemsCollection.find().toArray();
            res.send(result);
        })

        app.post('/joins', async (req, res) => {
            const joinedUser = req.body;
            const result = await joinedItemsCollection.insertOne(joinedUser);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        //await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Road_Hub Started");
})

app.listen(port, () => {
    console.log(`Road_Hub is running at port ${port}`);
})