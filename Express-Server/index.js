const express = require('express');
const app = express()
const dotenv = require('dotenv')
const userRoute = require('./routes/users')

app.use(express.json())

app.use('/api/users', userRoute)

dotenv.config()
app.listen(5000,()=>{
     console.log("server is running 5000 port");
})    