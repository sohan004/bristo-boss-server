const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.User_Id}:${process.env.User_Pass}@cluster0.bitxn0d.mongodb.net/?retryWrites=true&w=majority`;

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
        const items = client.db('bristobossDB').collection('bristoboss-item')

        app.get('/items', async (req, res) => {
            const result = items.find()
            const toArray = await result.toArray()
            res.send(toArray)

        })
        app.get('/category/:text', async (req, res) => {
            const ctg = req.params.text
            const result = await items.find({ category: { $eq: ctg } })
            const toArray = await result.toArray()
            res.send(toArray)

        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('bristo boss aitase')
})

app.listen(port)

// bristoboss
// mMcUQ6ONb4KKiLgj