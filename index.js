const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = 3000
//VSQ8UZjOIuq3vmjH
app.use(cors())
app.use(express.json())
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.PROJECT_NAME}:${process.env.PROJECT_PASS}@cluster0.yj7cq3y.mongodb.net/?appName=Cluster0`;


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
        const join = db.collection('joinedchallenges')
        const myactivity = db.collection('myactivities')
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
        //         app.get('/challenges/:id', async (req, res) => {
        //     const id = req.params.id
        //     const query = { _id: id }//specific kaoke khujar jonno
        //     const result = await challenge.findOne(query)
        //     res.send(result)
        // })
        app.get('/challenges/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await challenge.findOne(query)
            res.send(result)

        })
        app.post('/challenges', async (req, res) => {
            const newchallenge = req.body
            const result = await challenge.insertOne(newchallenge)
            res.send(result)
        })
        app.patch('/challenges/:id', async (req, res) => {
            const id = req.params.id
            const existingchallenge = await challenge.findOne({ _id: new ObjectId(id) });
            // const updatedproduct = req.body
            const updatedparticipants = (existingchallenge.participants || 0) + 1;
            const query = { _id: new ObjectId(id) }
            const update = {
                $set: {
                    participants: updatedparticipants,
                    //  price: updatedproduct.price
                }
            }
            const result = await challenge.updateOne(query, update)
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
        app.post('/challenges/join/:id', async (req, res) => {
            const newchallenge = req.body
            const result = await join.insertOne(newchallenge)
            res.send(result)
        })
        app.post('/myactivities/:email', async (req, res) => {
            const newchallenge = req.body
            const result = await myactivity.insertOne(newchallenge)
            res.send(result)
        })
        app.get('/myactivities/:email', async (req, res) => {
            const email = req.params.email
            const query = { userId: email }
            const result = await myactivity.find(query).toArray()
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
