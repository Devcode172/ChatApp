import React from 'react'
import { useSelector } from 'react-redux'

const getAvatarPath = (user) => {
  if (!user) return '/AV1.png'

  if (user.gender.toLowerCase() === 'male') {
    const num = (user.user_id % 50) + 1
    return `/AV${num}.png`
  }

  return '/AV1.png'
}

const Message = ({ message }) => {
  const { userProfile, selectedUser } = useSelector((state) => state.user)

  if (!userProfile || !selectedUser || !message) return null

  const senderAvatarPath = getAvatarPath(userProfile)
  const receiverAvatarPath = getAvatarPath(selectedUser)
  const messageTime = message.created_at
    ? new Date(message.created_at).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : ''

  return (
    <div className='pl-3 pt-3'>
      <div className={`chat ${message.sender_id === userProfile.user_id ? 'chat-end' : 'chat-start'}`}>
        <div className="chat-image avatar">
          <div className="w-10 rounded-full ">
            <img
              alt="user avatar"
              src={message.sender_id === userProfile.user_id ? senderAvatarPath : receiverAvatarPath}
            />
          </div>
        </div>
        <div className="chat-header">
          <time className="text-xs opacity-50">{messageTime}</time>
        </div>
        <div className="chat-bubble">{message.content}</div>
      </div>
    </div>
  )
}

export default Message
