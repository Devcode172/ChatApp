import React from 'react'
import UserSidebar from './UserSidebar'
import MessageContainer from './MessageContainer'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { initializeSocket, setOnlineUsers } from '../../store/slice/socket/socket.slice'
import { addMessage } from '../../store/slice/message/message.slice'
import { incrementUnreadMessages, updateConversationPreview, addNewConversationUser } from '../../store/slice/user/user.slice'
import { markMessagesAsReadThunk } from '../../store/slice/user/user.thunk'
const Home = () => {

  const {isAuthenticated , userProfile, selectedUser, otherUsers} = useSelector((state) => state.user)
  const { socket } = useSelector((state) => state.socket)
  const dispatch = useDispatch()

  // Helper to convert VAPID key
  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  useEffect(() => {
     if(!isAuthenticated || !userProfile?.user_id) return
     dispatch(initializeSocket(userProfile.user_id))

     // Register Service Worker and subscribe to Web Push
     if ('serviceWorker' in navigator && 'PushManager' in window) {
       navigator.serviceWorker.register('/sw.js').then(async (registration) => {
         try {
           let subscription = await registration.pushManager.getSubscription()
           
           if (!subscription) {
             const publicVapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY
             subscription = await registration.pushManager.subscribe({
               userVisibleOnly: true,
               applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
             })
           }

           // Send subscription to backend
           import('../../componenets/utilities/axiosinstance').then(({ axiosInstance }) => {
             axiosInstance.post('/user/subscribe', { subscription }).catch(console.error)
           })
         } catch (error) {
           console.error('Failed to subscribe to push notifications:', error)
         }
       }).catch(console.error)
     } else {
       // Fallback to standard OS notification permissions if web push is unsupported
       if ("Notification" in window && Notification.permission === "default") {
         Notification.requestPermission()
       }
     }
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

      let senderName = 'someone'
      const sender = otherUsers?.find((user) => user.user_id === newMessage.sender_id)

      if (!sender && newMessage.sender) {
        // It's a brand new conversation with someone not in the sidebar!
        senderName = newMessage.sender.full_name
        dispatch(addNewConversationUser({
          ...newMessage.sender,
          last_message: newMessage.content,
          last_message_at: newMessage.created_at,
          last_message_sender_id: newMessage.sender_id
        }))
      } else if (sender) {
        senderName = sender.full_name
        dispatch(updateConversationPreview({
          userId: newMessage.sender_id,
          lastMessage: newMessage.content,
          lastMessageAt: newMessage.created_at,
          lastMessageSenderId: newMessage.sender_id,
        }))
      }

      const isCurrentChat = selectedUser?.user_id === newMessage.sender_id

      if (isCurrentChat) {
        dispatch(addMessage(newMessage))
        dispatch(markMessagesAsReadThunk(newMessage.sender_id))
        return
      }

      dispatch(incrementUnreadMessages(newMessage.sender_id))
      
      // In-app toast notification
      toast.success(`New message from ${senderName}`)

      // OS-level Desktop/Mobile notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(`Message from ${senderName}`, {
          body: newMessage.content,
          icon: '/TalkNest_logo.png' // Using default logo or fallback since avatar paths are complex
        })
      }
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
