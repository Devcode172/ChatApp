import {app, server} from './socket/socket.js'
import express from 'express'
import userRouter from './routes/user.route.js'
import messageRouter from './routes/message.route.js'

import cookieParser from 'cookie-parser'
import cors from 'cors'
import { allowedOrigins } from './config/app.config.js'

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1)
}

// const app = express()
// console.log(process.env.CLIENT_URL)
app.use(express.json())
app.use(cors({
    origin : (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true)
        }

        return callback(new Error('CORS origin not allowed'))
    },
    credentials : true,
    // allowedHeaders : ['Content-Type','Authorization'],
    methods :['GET','POST','PUT','DELETE']
}))
app.use('/images', express.static('images'))
app.use(cookieParser())

import pool from './db/db.js'

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.use('/api/v4/user' , userRouter)
app.use('/api/v4/message' , messageRouter)

// app.get('/',(req,res)=>{
//     res.send("Abdul Basit")
// })
const port = process.env.PORT || 3000
server.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})
