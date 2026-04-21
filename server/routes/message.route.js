import express from 'express'
import { isAuthenticated } from '../middlewares/auth.middleware.js'
import { sendMessage, getMessage, markMessagesAsRead } from '../controllers/message.controller.js'

const router = express.Router()
router.post('/send/:receiverId', isAuthenticated, sendMessage)
router.get('/get/:receiverId', isAuthenticated, getMessage)
router.post('/mark-read/:senderId', isAuthenticated, markMessagesAsRead)

export default router