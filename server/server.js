// const express = require('express');
import express from 'express';  // esm pakage is installed so this works
import { readdirSync } from 'fs';  // filesystem pkg already comes with node
const morgan = require('morgan');
import cors from 'cors';
import mongoose from 'mongoose';
require('dotenv').config();

const app = express();

// db connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB Error => ", err));


// middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());


readdirSync("./routes").map((r) => 
    app.use("/api", require(`./routes/${r}`))
);
// route middleware
// app.use('/api',router);

const port = process.env.PORT ||  8000;
app.listen(port,() =>{
    console.log(`server is running on port ${port}`);
});