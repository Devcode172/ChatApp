import React from 'react'
import { useDispatch } from 'react-redux'
import { setSelectedUser } from '../../store/slice/user/user.slice'
import { markMessagesAsReadThunk } from '../../store/slice/user/user.thunk'
import { useSelector } from 'react-redux'

const formatLastMessageTime = (value) => {
  if (!value) return ''

  const date = new Date(value)
  const now = new Date()

  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
    })
  }

  return date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const User = ({ user, showChatMeta = true }) => {
  const dispatch = useDispatch()
  const { selectedUser, unreadMessages, userProfile } = useSelector((state) => state.user)
  const { onlineUsers } = useSelector((state) => state.socket)

  if (!user) return null

  const isOnline = onlineUsers?.includes(String(user.user_id))
  const unreadCount = unreadMessages?.[user.user_id] || 0

  let avatarPath = '/AV1.png'
  if (user.gender.toLowerCase() === 'male') {
    const num = (user.user_id % 50) + 1
    avatarPath = `/AV${num}.png`
  }

  const previewText = user.last_message
    ? `${user.last_message_sender_id === userProfile?.user_id ? 'You: ' : ''}${user.last_message}`
    : `[${user.username.toLowerCase()}]`

  const handleUseClick = () => {
    dispatch(setSelectedUser(user))
    dispatch(markMessagesAsReadThunk(user.user_id))
  }

  return (
    <div
      onClick={handleUseClick}
      className={`flex gap-5 items-center hover:bg-gray-700 pointer-events-auto cursor-pointer rounded-lg p-1 ${user && selectedUser && user.user_id === selectedUser.user_id ? 'bg-gray-700' : ''}`}
    >
      <div className={`avatar ${isOnline ? 'avatar-online' : ''}`}>
        <div className="w-14 rounded-full">
          <img src={avatarPath} />
        </div>
      </div>
      {showChatMeta ? (
        <div className='flex w-full items-start justify-between gap-3 overflow-hidden'>
          <div className='min-w-0 flex-1'>
            <p className='truncate'>{user.full_name}</p>
            <p className='truncate text-sm text-gray-400'>
              {previewText}
            </p>
          </div>
          <div className='flex min-w-fit flex-col items-end gap-2'>
            {user.last_message_at && (
              <p className='text-xs text-gray-400'>{formatLastMessageTime(user.last_message_at)}</p>
            )}
            {unreadCount > 0 && (
              <div className='min-w-6 rounded-full bg-[#2b80ff] px-2 py-1 text-center text-xs font-semibold text-white'>
                {unreadCount}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className='min-w-0 flex-1 overflow-hidden'>
          <p className='truncate'>{user.full_name} <span className='text-gray-400 italic'>{`[${user.username.toLowerCase()}]`}</span></p>
          <p className='truncate italic text-gray-400'>
            {isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      )}
    </div>
  )
}

export default User
