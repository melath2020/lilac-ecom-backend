const bodyParser = require('body-parser');
const express =require('express')
const app=express()
const dbConnect = require('./config/dbConnect')
const dotenv=require('dotenv').config();
const PORT=process.env.PORT || 4000;
const authRouter=require('./routes/authRoute')
const productRouter=require('./routes/productRoute')
const cors = require("cors");
const cookieParser= require('cookie-parser');
const { errorHandler, notFound } = require('./middlewares/errorHandler');

dbConnect();
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/user", authRouter);
app.use("/api/product", productRouter);


app.use(notFound)
app.use(errorHandler)
app.listen(PORT, () => {
    console.log(`Server is running  at PORT ${PORT}`);
  });