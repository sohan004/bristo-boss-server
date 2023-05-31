const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');

app.use(cors())
app.use(express.json())

const verifyToken = (req, res, next) => {
    const token = req.headers?.authorization
    if (!token) {
        return res.status(401).send({ error: true })
    }
    jwt.verify(token, 'R1GMbkJBXaUITEMYfnywCY86UrqLPRER6J2dwOxejvkosvXqgKkM_8zEXbvp1LXbe5jcqjF6bTLXwIqPDm3bnj-rd4OXXJw5iQJEcghZOTxlMIEQ5U2D3cAIDxFXZqWvk8Z4H78SPRbRmy9BaD9kgjzv64n4u', (err, decoded) => {
        if (err) {
            return res.status(401).send({ error: true })
        }
        req.decoded = decoded
        next()
    });
}


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
        const carts = client.db('bristobossDB').collection('bristoboss-cart')
        const users = client.db('bristobossDB').collection('bristoboss-users')

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
        app.get('/admin', verifyToken, async (req, res) => {
            const email = req.query?.email
            const query = { email: email }
            const result = await users.findOne(query)
            if (result?.role === 'admin') {
                res.send({ admin: true })
            }
            else {
                res.send({ admin: false })

            }

        })

        app.post('/carts', async (req, res) => {
            const body = req.body
            const result = await carts.insertOne(body)
            res.send(result)
        })

        app.post('/users', verifyToken, async (req, res) => {
            const body = req.body
            const quary = { email: body.email }
            const result = await users.findOne(quary)
            if (result) {
                res.send({ insertedId: true })
            } else {
                const added = await users.insertOne(body)
                res.send(added)
            }
        })
        app.get('/users', verifyToken, async (req, res) => {
            const result = users.find()
            const toArray = await result.toArray()
            res.send(toArray)
        })
        app.post('/jwt', async (req, res) => {
            const user = req.body
            const token =
                jwt.sign({
                    data: user
                }, 'R1GMbkJBXaUITEMYfnywCY86UrqLPRER6J2dwOxejvkosvXqgKkM_8zEXbvp1LXbe5jcqjF6bTLXwIqPDm3bnj-rd4OXXJw5iQJEcghZOTxlMIEQ5U2D3cAIDxFXZqWvk8Z4H78SPRbRmy9BaD9kgjzv64n4u', { expiresIn: '1h' });
            res.send({ token })

        })
        app.get('/carts', async (req, res) => {
            const email = req?.query?.email
            if (email) {
                const quary = { email: email }
                const result = await carts.find(quary)
                const toArray = await result.toArray()
                res.send(toArray)
            } else {
                res.send([])

            }
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