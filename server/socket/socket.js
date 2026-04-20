import dotenv from 'dotenv'
dotenv.config()
import { Server } from 'socket.io'
import http from 'http'
import express from 'express'
import { allowedOrigins } from '../config/app.config.js'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors : {
        origin : allowedOrigins,
        // methods : ['GET','POST'] 
    }
})


const userSocketMap ={}
const getReceiverSocketId = (userId) => userSocketMap[userId]

io.on('connection', (socket) => {
    console.log('a user connected') 
    console.log(socket.id)
    const userId = socket.handshake.query.userId
    if(!userId) return
    userSocketMap[userId]  =  socket.id
    console.log(userSocketMap)
    io.emit("onlineUsers" , Object.keys(userSocketMap))

    socket.on('disconnect' ,()=>{
        if (userSocketMap[userId] === socket.id) {
            delete userSocketMap[userId]
        }
        io.emit("onlineUsers" , Object.keys(userSocketMap))
    })
})

export  {io, app, server, getReceiverSocketId}   
