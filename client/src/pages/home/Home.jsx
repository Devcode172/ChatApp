import React from 'react'
import UserSidebar from './UserSidebar'
import MessageContainer from './MessageContainer'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { initializeSocket, setOnlineUsers } from '../../store/slice/socket/socket.slice'
import { addMessage } from '../../store/slice/message/message.slice'
import { incrementUnreadMessages, updateConversationPreview } from '../../store/slice/user/user.slice'
const Home = () => {

  const {isAuthenticated , userProfile, selectedUser, otherUsers} = useSelector((state) => state.user)
  const { socket } = useSelector((state) => state.socket)
  const dispatch = useDispatch()

  useEffect(() => {
     if(!isAuthenticated || !userProfile?.user_id) return
     dispatch(initializeSocket(userProfile.user_id))
  }, [dispatch, isAuthenticated, userProfile?.user_id])

  useEffect(() => {
    if(!socket) return

    const handleOnlineUsers = (onlineUsers) => {
      dispatch(setOnlineUsers(onlineUsers))
    }

    socket.on('onlineUsers', handleOnlineUsers)

    if (!socket.connected) {
      socket.connect()
    }

    return () => {
      socket.off('onlineUsers', handleOnlineUsers)
      socket.close()
      dispatch(setOnlineUsers([]))
    }
  }, [dispatch, socket])

  useEffect(() => {
    if (!socket || !userProfile?.user_id) return

    const handleNewMessage = (newMessage) => {
      if (newMessage.receiver_id !== userProfile.user_id) return

      dispatch(updateConversationPreview({
        userId: newMessage.sender_id,
        lastMessage: newMessage.content,
        lastMessageAt: newMessage.created_at,
        lastMessageSenderId: newMessage.sender_id,
      }))

      const isCurrentChat = selectedUser?.user_id === newMessage.sender_id

      if (isCurrentChat) {
        dispatch(addMessage(newMessage))
        return
      }

      dispatch(incrementUnreadMessages(newMessage.sender_id))

      const sender = otherUsers?.find((user) => user.user_id === newMessage.sender_id)
      toast.success(`New message from ${sender?.full_name || 'someone'}`)
    }

    socket.on('newMessage', handleNewMessage)

    return () => {
      socket.off('newMessage', handleNewMessage)
    }
  }, [dispatch, otherUsers, selectedUser?.user_id, socket, userProfile?.user_id])

  if(!userProfile) return null
  
  return (
    <div className='flex h-dvh overflow-hidden'>
      <div className={`w-full md:w-1/3 lg:w-1/4 h-full ${selectedUser ? 'hidden md:block' : 'block'}`}>
        <UserSidebar/>
      </div>
      <div className={`w-full md:w-2/3 lg:w-3/4 h-full ${selectedUser ? 'block' : 'hidden md:block'}`}>
        <MessageContainer/>
      </div>
    </div>
  )
}

export default Home
