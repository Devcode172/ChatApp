import express from 'express'
import { getProfile, login, logout, register, getOtherUsers, searchUsers, subscribeToPush } from '../controllers/user.controller.js'
import { isAuthenticated } from '../middlewares/auth.middleware.js'

const router = express.Router()
router.post('/register', register)
router.post('/login', login)
router.get('/getprofile', isAuthenticated, getProfile)
router.get('/getotherusers', isAuthenticated, getOtherUsers)
router.get('/search', isAuthenticated, searchUsers)
router.post('/subscribe', isAuthenticated, subscribeToPush)
router.post('/logout', isAuthenticated, logout)

export default router