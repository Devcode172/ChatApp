import React from 'react'
import Message from './Message'

import User from './User'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux';
import { useEffect, useRef } from 'react';
import { getMessageThunk } from '../../store/slice/message/message.thunk';
import { clearMessages } from '../../store/slice/message/message.slice';
import SendMessage from './SendMessage';
import { setSelectedUser } from '../../store/slice/user/user.slice';
import { FaArrowLeft } from 'react-icons/fa';

const MessageContainer = () => {
  const {selectedUser} = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const {messages} = useSelector((state) => state.message)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (selectedUser?.user_id) {
      dispatch(getMessageThunk({ receiverId: selectedUser.user_id }))
      return
    }

    dispatch(clearMessages())
  }, [dispatch, selectedUser?.user_id])

  useEffect(() => {
    if (!selectedUser?.user_id) return

    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [messages, selectedUser?.user_id])

  return (
    <>
    {!selectedUser ? (
      <div className='w-full h-screen flex items-center justify-center'>
        <h1 className='text-2xl'>Select a user to start chatting</h1>
      </div>
    ) : (
      <div className='w-full flex flex-col h-screen'>

      <div className='flex items-center p-2 border-b border-gray-700 bg-base-100'>
        <button 
          className='md:hidden btn btn-ghost btn-circle mr-2'
          onClick={() => dispatch(setSelectedUser(null))}
        >
          <FaArrowLeft size={20} />
        </button>
        <div className='flex-1'>
          <User user={selectedUser} showChatMeta={false} />
        </div>
      </div>
      




      <div className='h-full overflow-y-auto px-5'>
        {messages.map((message) => <Message key={message.id}  message={message} />)}
        <div ref={messagesEndRef} />
      </div>
      
      <SendMessage/>
    </div>
    )}
          </>
  )
}

export default MessageContainer
