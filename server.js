import express from'express';
const app = express();

import http from 'http'
import device from 'express-device'
import useragent from 'express-useragent'
// import Server from 'socket.io'
import dotenv from 'dotenv'
dotenv.config()
import mongoose  from'mongoose'
import cors from 'cors'
import router  from './routes/authroute.js'
import connectDB from './database.js'
import rateLimitMiddleware from "./ratelimiter.js"
import { initNwc } from './utils/webln.js'


let interval;
// const getApiAndEmit = "TODO";

app.use(cors())
app.use(express.json());
app.use(device.capture());
app.use(useragent.express());
// app.use(rateLimitMiddleware);
const server=http.createServer(app)


connectDB()
initNwc()




const port = process.env.PORT || 5000;

server.listen(port, () => { console.log(`server run at ${port}`) })
app.use(router)
