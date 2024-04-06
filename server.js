require('dotenv').config()

const express = require('express')
const userRouter = require('./routes/ticketRoute');
const mongoose = require('mongoose')
const cors = require('cors');

const app = express()

app.use((req,res,next)=> {
    console.log(req.path, req.method)
    next()
})

app.use(cors());

app.use(express.json());

//routes
app.use('/', userRouter);

mongoose.connect(process.env.MONGO_URL).then(()=> {
    //listen for requests
    app.listen(process.env.PORT, ()=> {
        console.log("API started on port 3000 * connected to MongoDB", process.env.PORT)
    })
}).catch((error)=>{
    console.log(error);
})