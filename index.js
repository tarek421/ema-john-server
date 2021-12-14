const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express();
const port = 5000;
const databaseUser = (process.env.DB_USER);
const password = process.env.DB_PASS;


const nodemailer = require("nodemailer");

const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${databaseUser}:${password}@cluster0.kwnsg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// ====================


let transporter = nodemailer.createTransport({
   service: "gmail",
   auth: {
     user: process.env.EMAIL_USER, // TODO: your gmail account
     pass: process.env.PASSWORD, // TODO: your gmail password
   },
 });


// ====================

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("emaJohnStore").collection("products");
  const orderCollection = client.db("emaJohnStore").collection("products");
  
  app.post('/addProduct',(req, res) => {
     const product = req.body;
     collection.insertMany(product)
     .then(result => {
        res.send(insertedId)
     })
  })

  app.get('/products', (req, res)=>{
     collection.find({})
     .toArray((err, result)=>{
        res.send(result);
     })
  })

  app.get('/product/:key', (req, res)=>{
     collection.find({key:req.params.key})
     .toArray((err, result)=>{
        res.send(result[0]);
     })
  })

  app.post('/productsByKeys', (req, res) => {
   const productKeys = req.body;
   collection.find({key: { $in: productKeys} })
   .toArray( (err, documents) => {
       res.send(documents);
   })
})
  
app.post('/addOrder', (req, res) =>{
   const orderDetail = req.body;
   const email = orderDetail.email;
   orderCollection.insertOne(orderDetail)
   .then(result => {
      res.send(result);
      


      let mailOptions = {
         from: "tarekmahmud319@gmail.com", // TODO: email sender
         to: email, // TODO: email receiver
         subject: "Order Confirm",
         text: JSON.stringify(orderDetail),
       };


      transporter.sendMail(mailOptions, (err, data) => {
         if (err) {
           console.log("Error occurs", err);
         } else {
           console.log("Email sent successfully!!!");
         }
       });
   })
})


});



app.listen(process.env.PORT || port)