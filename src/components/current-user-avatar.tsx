'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useCurrentUserImage } from '@/hooks/use-current-user-image'
import Image from 'next/image'

export const CurrentUserAvatar = ({ initials, level }: { initials: string | null, level: number | null }) => {
  const profileImage = useCurrentUserImage()

  return (
    <div className='relative w-14 h-16'>
      <Avatar className='w-10 h-10 absolute top-3 left-[7]'>
        {profileImage && <AvatarImage src={profileImage} />}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      {level && (
        <Image
          src={`/images/levels/lvl${level < 9 ? level : "endgame"}.png`}
          alt={`Level ${level} border`}
          width={55}
          height={65}
          className="absolute inset-0 pointer-events-none object-contain"
        />
      )}
    </div>
  )
}
