const express = require('express');
const cors = require('cors');
// const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()


const app = express();
const port = process.env.PORT || 5000

//middle were
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.taqpwn0.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// function verifyJWT(req, res, next){
//     console.log(req.headers.authorization);
//     const authHeader = req.headers.authorization;
//     if(!authHeader){
//       return  res.status(401).send({message: 'unauthorization access'})
//     }
//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
//         if(err){
//           return  res.status(401).send({message: 'unauthorization access'})
//         }
//         req.decoded = decoded;
//         next()
//     })
// }

async function run(){
    try{
        const servicesCollection = client.db('photosByRts').collection('serviceData')
        const reviewsCollection = client.db('photosByRts').collection('reviews')

        // app.post('/jwt', (req, res)=>{
        //     const user = req.body;
        //     console.log(user);
        //     const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'});
        //     res.send({token})
        // })

        app.get('/services', async(req, res)=>{
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        });

        app.get('/servicesHome', async(req, res)=>{
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services)
        });

        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const services = await servicesCollection.findOne(query);
            res.send(services)
        });

        app.get('/reviews/:id', async(req, res)=>{
            
            const cursor =  reviewsCollection.find({service: req.params.id});
            const reviews = await cursor.toArray()
            res.send(reviews)
        });

        app.post('/reviews', async(req, res)=>{
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.send(result)
        })

        app.get('/reviews', async(req, res)=>{
            
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewsCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews)
        });

        

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewsCollection.deleteOne(query);
            res.send(result);
        })

        // app.get('/reviews', verifyJWT, async(req, res)=>{
        //     const decoded = req.decoded;
        //     console.log('inside api', decoded);
        //     if(decoded.email !== req.query.email){
        //         res.status(403).send({message: 'unauthorization access'})
        //     }
        //     let query = {};
        //     if (req.query.email) {
        //         query = {
        //             email: req.query.email
        //         }
        //     }
        //     const cursor = reviewsCollection.find(query);
        //     const orders = await cursor.toArray();
        //     res.send(orders)
        // });

        // app.post('/reviews', async (req, res)=>{
        //     const review = req.body;
        //     const result = await reviewsCollection.insertOne(review);
        //     res.send(result);
        // });

        // app.patch('/reviews/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const status = req.body.status
        //     const query = { _id: ObjectId(id) }
        //     const updatedDoc = {
        //         $set:{
        //             status: status
        //         }
        //     }
        //     const result = await reviewsCollection.updateOne(query, updatedDoc);
        //     res.send(result);
        // })


        // app.delete('/reviews/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await reviewsCollection.deleteOne(query);
        //     res.send(result);
        // })
    }
    finally{

    }
}
run().catch(err => console.error(err))




app.get('/', (req, res)=>{
    res.send(' server api running')
})

app.listen(port, ()=>{
    console.log(` server running in port ${port}`);
})