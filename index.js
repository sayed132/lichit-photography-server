const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config()


const app = express();
const port = process.env.PORT || 5000

//middle were
app.use(cors());
app.use(express.json());




app.get('/', (req, res)=>{
    res.send(' api running')
})

app.listen(port, ()=>{
    console.log(` server running in port ${port}`);
})