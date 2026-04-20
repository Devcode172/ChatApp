import pool from "../db/db.js"
import { io, getReceiverSocketId } from "../socket/socket.js"

const getSenderId = async (username) => {
    const senderIdResult = await pool.query(
        'SELECT user_id FROM users WHERE username = $1',
        [username]
    )

    return senderIdResult.rows[0]?.user_id
}

const getConversationId = async (senderId, receiverId) => {
    const conversationResult = await pool.query(
        `SELECT id
         FROM conversations
         WHERE (user1_id = $1 AND user2_id = $2)
            OR (user1_id = $2 AND user2_id = $1)
         LIMIT 1`,
        [senderId, receiverId]
    )

    return conversationResult.rows[0]?.id
}

export const sendMessage = async (req, res) => {
    try {
        const senderUsername = req.user
        const receiverId = req.params.receiverId
        const message = req.body.message?.trim()

        if (!receiverId || !message) {
            return res.status(400).json({
                message: 'All fields are required'
            })
        }

        const senderId = await getSenderId(senderUsername)

        if (!senderId) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        let conversationId = await getConversationId(senderId, receiverId)

        if (!conversationId) {
            const conversationResult = await pool.query(
                'INSERT INTO conversations(user1_id, user2_id) VALUES($1, $2) RETURNING id',
                [senderId, receiverId]
            )
            conversationId = conversationResult.rows[0].id
        }

        const messageResult = await pool.query(
            'INSERT INTO messages(conversation_id, sender_id, receiver_id, content) VALUES($1, $2, $3, $4) RETURNING *',
            [conversationId, senderId, receiverId, message]
        )

        const newMessage = messageResult.rows[0]
        const receiverSocketId = getReceiverSocketId(receiverId)

        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage)
        }

        return res.status(201).json({
            message: 'Message sent successfully',
            data: newMessage
        })
    } catch (error) {
        console.log('sendMessage error:', error)
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}


export const getMessage = async (req, res) => {
    try {
        const senderUsername = req.user
        const receiverId = req.params.receiverId

        if (!receiverId) {
            return res.status(400).json({
                message: 'All fields are required'
            })
        }

        const senderId = await getSenderId(senderUsername)

        if (!senderId) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        const conversationId = await getConversationId(senderId, receiverId)

        if (!conversationId) {
            return res.status(200).json({
                message: 'Messages fetched successfully',
                data: []
            })
        }

        const messageResult = await pool.query(
            'SELECT * FROM messages WHERE conversation_id = $1 ORDER BY id ASC',
            [conversationId]
        )

        return res.status(200).json({
            message: 'Messages fetched successfully',
            data: messageResult.rows
        })
    } catch (error) {
        console.log('getMessage error:', error)
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}
