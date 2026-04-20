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
    <div className='h-screen border-r-[0.1px] border-gray-600  p-2 relative flex flex-col'>
      <div className='text-blue-500 text-center text-2xl font-bold'>
        Talk Nest
      </div>

      <div className='my-2'>

        <input type="text" placeholder="Search Contact" className="input w-full " />
      </div>
      <p className='mb-3 text-sm text-gray-400'>
        {onlineUsers?.length -1 || 'No'} {onlineUsers.length - 1 > 1 ? 'users online' : 'user online'}
      </p>
      <div className='h-screen overflow-y-scroll flex flex-col gap-5'>
        {sortedUsers.map((user) => <User key={user.user_id} user={user} />)}
      </div>
      <div className=' border-t-1 h-[16vh] flex items-center gap-15 pl-5 rounded-lg'>
        <div className='flex items-center gap-5'>
          <div className="avatar ">
            <div className="ring-primary ring-offset-base-100 w-14 rounded-full ring-2 ring-offset-2">
              <img src={avatarPath} />
            </div>
          </div>
          <h1 className='w-[8vw] whitespace-nowrap text-ellipsis overflow-hidden text-[25px] italic'>{userProfile?.full_name}</h1>
        </div>


        <div>
          <input type="button" onClick={handleLogout} value="LogOut" className="btn  border-1 border-[#2b80ff] mr-2" />
        </div>
      </div>
    </div>
  )
}

export default UserSidebar
