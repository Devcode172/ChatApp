import pool from "../db/db.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { getAuthCookieOptions, getClearedAuthCookieOptions, serverUrl } from '../config/app.config.js'

export const register = (req, res) => {
    const { fullname, username, password, gender } = req.body
    if (!fullname || !username || !password || !gender) {
        return res.status(400).json({
            message: 'All fields are required!!!'
        })
    }
    console.log(fullname, username, password, gender)
    let avatar = ''
    if (gender.toLowerCase() === 'male') {
        let num = Math.floor(Math.random() * 50) + 1;
        avatar = `${serverUrl}/images/boy/AV${num}.png`
    } else if (gender.toLowerCase() === 'female') {
        avatar = `${serverUrl}/images/boy/AV1.png`
    }
    console.log(avatar)
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return res.status(500).json({ message: 'Error generating salt' })
        }
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
                return res.status(500).json({ message: 'Error hashing password' })
            }
            console.log(hash)
            const query = 'INSERT INTO USERS(full_name, username, user_password, gender, avatar) VALUES($1,$2,$3,$4,$5) RETURNING *'
            pool.query(query, [fullname, username, hash, gender, avatar], (err, result) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({
                        message: 'Internal Server Error'
                    })
                }
                const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES })
                console.log(result)
                console.log(token)
                res.status(201).cookie('token', token, getAuthCookieOptions())
                    .json({
                        message: 'user created',
                        token,
                        data: result.rows[0]
                    })
            })
        });
    });

}

export const login = (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).json({
            message: 'All fields are required!!!'
        })
    }
    console.log(username, password)

    const query = "SELECT * FROM USERS WHERE username = $1"
    pool.query(query, [username], (err, result) => {
        // console.log(result)
        if (err) {
            console.log(err)
            return res.status(500).json({
                message: 'Internal Server Error'
            })
        }
        if (result.rows.length === 0) {
            return res.status(401).json({
                message: 'Invalid username or password'
            })
        }
        console.log(result)
        bcrypt.compare(password, result.rows[0].user_password, (err, bres) => {
            console.log("bcrypt result", bres)
            if (err) {
                console.log(err)
                return res.status(500).json({

                    message: 'Internal Server Error'
                })
            }
            if (bres) {
                const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES })
                return res.status(200).cookie('token', token, getAuthCookieOptions())
                    .json({
                        message: 'Login successful',
                        token,
                        data: result.rows[0]
                    })
            } else {
                return res.status(401).json({
                    message: 'Invalid username or password'
                })
            }
        })
    })
}

export const logout = (req, res) => {
    res.status(200).cookie("token", "", getClearedAuthCookieOptions()).json({
        message: 'Logout Successfully'
    })
}

export const getProfile = (req, res) => {
    const username = req.user
    const query = 'SELECT * FROM USERS WHERE username = $1'
    pool.query(query, [username], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            })
        }
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'User not exists'
            })
        }
        return res.status(200).json({
            message: 'user profile',
            data: result.rows[0]
        })
    })
}

export const getOtherUsers = async (req, res) => {
    try {
        const username = req.user

        const currentUserResult = await pool.query(
            'SELECT user_id FROM users WHERE username = $1',
            [username]
        )

        if (currentUserResult.rows.length === 0) {
            return res.status(404).json({
                message: 'User not exists'
            })
        }

        const currentUserId = currentUserResult.rows[0].user_id

        const query = `
            SELECT 
                users.*,
                latest_message.content AS last_message,
                latest_message.created_at AS last_message_at,
                latest_message.sender_id AS last_message_sender_id
            FROM users
            INNER JOIN LATERAL (
                SELECT messages.content, messages.created_at, messages.sender_id
                FROM conversations
                JOIN messages ON messages.conversation_id = conversations.id
                WHERE (
                    conversations.user1_id = $1 AND conversations.user2_id = users.user_id
                ) OR (
                    conversations.user1_id = users.user_id AND conversations.user2_id = $1
                )
                ORDER BY messages.created_at DESC, messages.id DESC
                LIMIT 1
            ) latest_message ON true
            WHERE users.user_id != $1
            ORDER BY latest_message.created_at DESC NULLS LAST, users.full_name ASC
        `

        const result = await pool.query(query, [currentUserId])

        return res.status(200).json({
            message: 'Other users',
            data: result.rows
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

export const searchUsers = async (req, res) => {
    try {
        const username = req.user
        const searchQuery = req.query.q

        if (!searchQuery) {
            return res.status(200).json({ message: 'Search query is required', data: [] })
        }

        const currentUserResult = await pool.query(
            'SELECT user_id FROM users WHERE username = $1',
            [username]
        )

        if (currentUserResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not exists' })
        }

        const currentUserId = currentUserResult.rows[0].user_id

        const query = `
            SELECT user_id, full_name, username, gender, avatar
            FROM users
            WHERE user_id != $1 AND username ILIKE $2
            LIMIT 20
        `
        const result = await pool.query(query, [currentUserId, searchQuery])

        return res.status(200).json({
            message: 'Search results',
            data: result.rows
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}
