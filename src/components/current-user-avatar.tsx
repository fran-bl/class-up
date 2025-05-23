'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useCurrentUserImage } from '@/hooks/use-current-user-image'
import Image from 'next/image'

export const CurrentUserAvatar = ({ initials, level }: { initials: string | null, level: number | null }) => {
  const profileImage = useCurrentUserImage()

  return (
    <div className='relative w-12 h-14'>
      <Avatar className='w-10 h-10 absolute top-2 left-[3]'>
        {profileImage && <AvatarImage src={profileImage} />}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      {level && (
        <Image
          src={`/images/levels/lvl${level < 9 ? level : "endgame"}.png`}
          alt={`Level ${level} border`}
          width={48}
          height={56}
          className="absolute inset-0 pointer-events-none object-contain"
        />
      )}
    </div>
  )
}
