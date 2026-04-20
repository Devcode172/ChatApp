import React from 'react'
import { LuSend } from "react-icons/lu";
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessageThunk } from '../../store/slice/message/message.thunk';
import { updateConversationPreview } from '../../store/slice/user/user.slice';
const SendMessage = () => {
    const [message, setMessage] = useState('')
    const dispatch = useDispatch()
    const {selectedUser} = useSelector((state) => state.user)
    const { buttonLoading } = useSelector((state) => state.message)
    
    const handleSendMessage = async (event) => {
        event?.preventDefault()
        if (!message.trim()) return
        if (!selectedUser?.user_id) return
        
        const result = await dispatch(sendMessageThunk({ receiverId: selectedUser.user_id , message }))

        if (sendMessageThunk.fulfilled.match(result)) {
          dispatch(updateConversationPreview({
            userId: selectedUser.user_id,
            lastMessage: result.payload.data.content,
            lastMessageAt: result.payload.data.created_at,
            lastMessageSenderId: result.payload.data.sender_id,
          }))
          setMessage('')
        }
    }
    
  return (
    <div>
      <form onSubmit={handleSendMessage} className='w-full flex px-5 gap-5 items-center'>
        <div className='w-full'>
        <fieldset className="fieldset">
        <input type="text" className="input w-full focus:border-[#2b80ff] outline-none" placeholder="Type here" value={message} onChange={(e)=>{setMessage(e.target.value)}} />
      </fieldset>

        </div>

      <button type="submit" disabled={buttonLoading} className="btn btn-square active:bg-[#2b80ff] hover:border-[#2b80ff]"><LuSend /></button>
      </form>
    </div>
  )
}

export default SendMessage
