const bodyParser = require('body-parser');
const express =require('express')
const app=express()
const dbConnect = require('./config/dbConnect')
const dotenv=require('dotenv').config();
const PORT=process.env.PORT || 4000;
const authRouter=require('./routes/authRoute')
const cors = require("cors");
dbConnect();
app.use(cors());
const { errorHandler, notFound } = require('./middlewares/errorHandler');
app.use(bodyParser.json());

app.use("/api/user", authRouter);

app.use(notFound)
app.use(errorHandler)
app.listen(PORT, () => {
    console.log(`Server is running  at PORT ${PORT}`);
  });