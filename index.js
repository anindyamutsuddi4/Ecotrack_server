const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
//VSQ8UZjOIuq3vmjH
app.use(cors())
app.use(express.json())
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Ecotrack:VSQ8UZjOIuq3vmjH@cluster0.yj7cq3y.mongodb.net/?appName=Cluster0";

app.get('/', (req, res) => {
    res.send('Hello World!')
})
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
        await client.connect();
        const db = client.db('eco_track')
        const challenge = db.collection('allchallenges')
        const categorydescription = db.collection('categorydescription')
        app.get('/challenges', async (req, res) => {
            const cursor = challenge.find().limit(6)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/allchallenges', async (req, res) => {
            const cursor = challenge.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        app.post('/challenges', async (req, res) => {
            const newchallenge = req.body
            const result = await challenge.insertOne(newchallenge)
            res.send(result)
        })
        app.post('/categorydescription', async (req, res) => {
            const newchallenge = req.body
            const result = await categorydescription.insertOne(newchallenge)
            res.send(result)
        })
        app.get('/categorydescription', async (req, res) => {
            const cursor = categorydescription.find()
            const result = await cursor.toArray()
            res.send(result)
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
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
