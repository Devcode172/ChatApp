import React from 'react'
import User from './User'
import { useDispatch } from 'react-redux'
import { userLogoutThunk } from '../../store/slice/user/user.thunk'
import { useSelector } from 'react-redux'
import { getOtherUserProfileThunk } from '../../store/slice/user/user.thunk'
import { useEffect, useMemo } from 'react'


const UserSidebar = () => {
  const dispatch = useDispatch()
  const { otherUsers, userProfile, unreadMessages } = useSelector((state) => state.user)
  const { onlineUsers } = useSelector((state) => state.socket)
  const handleLogout = async () => {
    await dispatch(userLogoutThunk())
    //  navigate('/login')
  }

  let avatarPath = '/AV1.png'
  if (userProfile && userProfile.gender.toLowerCase() === 'male') {
    const num = (userProfile.user_id % 50) + 1
    avatarPath = `/AV${num}.png`
  }

  useEffect(() => {

    dispatch(getOtherUserProfileThunk())
  }, [dispatch])

  const sortedUsers = useMemo(() => {
    if (!otherUsers) return []

    return [...otherUsers].sort((firstUser, secondUser) => {
      const firstUserUnreadCount = unreadMessages?.[firstUser.user_id] || 0
      const secondUserUnreadCount = unreadMessages?.[secondUser.user_id] || 0

      if (secondUserUnreadCount !== firstUserUnreadCount) {
        return secondUserUnreadCount - firstUserUnreadCount
      }

      const firstUserLastMessageAt = firstUser.last_message_at ? new Date(firstUser.last_message_at).getTime() : 0
      const secondUserLastMessageAt = secondUser.last_message_at ? new Date(secondUser.last_message_at).getTime() : 0

      if (secondUserLastMessageAt !== firstUserLastMessageAt) {
        return secondUserLastMessageAt - firstUserLastMessageAt
      }

      const firstUserOnline = onlineUsers?.includes(String(firstUser.user_id)) ? 1 : 0
      const secondUserOnline = onlineUsers?.includes(String(secondUser.user_id)) ? 1 : 0

      return secondUserOnline - firstUserOnline
    })
  }, [otherUsers, onlineUsers, unreadMessages])

  return (
    <div className='h-full border-r-[0.1px] border-gray-600  p-2 relative flex flex-col'>
      <div className='text-blue-500 text-center text-2xl font-bold'>
        Talk Nest
      </div>

      <div className='my-2'>

        <input type="text" placeholder="Search Contact" className="input w-full " />
      </div>
      <p className='mb-3 text-sm text-gray-400'>
        {onlineUsers?.length -1 || 'No'} {onlineUsers.length - 1 > 1 ? 'users online' : 'user online'}
      </p>
      <div className='flex-1 overflow-y-auto flex flex-col gap-5'>
        {sortedUsers.map((user) => <User key={user.user_id} user={user} />)}
      </div>
      <div className='border-t border-gray-600 h-[16vh] flex items-center justify-between px-2 rounded-lg'>
        <div className='flex items-center gap-3 overflow-hidden'>
          <div className="avatar shrink-0">
            <div className="ring-primary ring-offset-base-100 w-12 rounded-full ring-2 ring-offset-2">
              <img src={avatarPath} alt="avatar" />
            </div>
          </div>
          <h1 className='flex-1 truncate text-lg font-semibold italic'>{userProfile?.full_name}</h1>
        </div>

        <div className="shrink-0">
          <input type="button" onClick={handleLogout} value="LogOut" className="btn btn-sm border-1 border-[#2b80ff]" />
        </div>
      </div>
    </div>
  )
}

export default UserSidebar
