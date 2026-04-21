import pool from "../db/db.js"
import { io, getReceiverSocketId } from "../socket/socket.js"
import webpush from 'web-push'

// Configure web-push
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:test@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

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
        
        // Fetch sender details so the receiver can add them to their sidebar if it's a new conversation
        const senderDetailsResult = await pool.query(
            'SELECT user_id, full_name, username, gender, avatar FROM users WHERE user_id = $1',
            [senderId]
        )
        newMessage.sender = senderDetailsResult.rows[0]

        const receiverSocketId = getReceiverSocketId(receiverId)

        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage)
        } else {
            // Receiver is offline, try to send a web push notification
            try {
                const receiverResult = await pool.query('SELECT push_subscription FROM users WHERE user_id = $1', [receiverId])
                const subscription = receiverResult.rows[0]?.push_subscription
                
                if (subscription) {
                    const senderResult = await pool.query('SELECT full_name FROM users WHERE user_id = $1', [senderId])
                    const senderName = senderResult.rows[0]?.full_name || 'someone'

                    const payload = JSON.stringify({
                        title: `Message from ${senderName}`,
                        body: message,
                        icon: '/TalkNest_logo.png'
                    })

                    await webpush.sendNotification(subscription, payload)
                }
            } catch (pushError) {
                console.log('Error sending push notification:', pushError)
                // We don't fail the message send if push fails
            }
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

export const markMessagesAsRead = async (req, res) => {
    try {
        const senderUsername = req.user
        const otherUserId = req.params.senderId

        if (!otherUserId) {
            return res.status(400).json({ message: 'Sender ID is required' })
        }

        const receiverId = await getSenderId(senderUsername)

        if (!receiverId) {
            return res.status(404).json({ message: 'User not found' })
        }

        const query = `
            UPDATE messages
            SET is_read = true
            WHERE receiver_id = $1 AND sender_id = $2 AND is_read = false
        `
        await pool.query(query, [receiverId, otherUserId])

        return res.status(200).json({
            message: 'Messages marked as read'
        })
    } catch (error) {
        console.log('markMessagesAsRead error:', error)
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}
