const express =require('express')
const app=express()
const dbConnect = require('./config/dbConnect')
const dotenv=require('dotenv').config();
const PORT=process.env.PORT || 4000;

dbConnect();

app.listen(PORT, () => {
    console.log(`Server is running  at PORT ${PORT}`);
  });