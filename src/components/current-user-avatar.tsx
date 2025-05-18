'use client'

import { useCurrentUserImage } from '@/hooks/use-current-user-image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export const CurrentUserAvatar = ({ initials }: { initials: string | null}) => {
  const profileImage = useCurrentUserImage()

  return (
    <Avatar className='w-10 h-10'>
      {profileImage && <AvatarImage src={profileImage} />}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  )
}
