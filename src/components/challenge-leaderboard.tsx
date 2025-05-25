"use client";

import { ChallengeParticipant } from "@/types/types";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function ChallengeLeaderboard({ participants }: { participants: ChallengeParticipant[] }) {
    function getLevel(xp: number) {
        if (xp < 0) xp = 0;

        const level = Math.floor(Math.sqrt(xp / 50) + 1);
        const totalXpForNextLevel = 50 * Math.pow(level, 2);

        return [level, xp, totalXpForNextLevel];
    }

    const sortedParticipants = participants
        .sort((a, b) => b.contribution - a.contribution)
        .map(participant => ({
            ...participant,
            level: getLevel(participant.profile.xp)[0],
        }));

    return (
        <div className="flex flex-col items-center justify-center p-5">
            {sortedParticipants.map((participant, index) => (
                <div key={participant.profile_id} className="flex items-center justify-between w-full max-w-md mb-2rounded-lg">
                    <div className="grid grid-cols-3 items-center gap-4 w-1/2">
                        <span className="text-3xl">{index + 1}.</span>
                        <div className='relative w-12 h-14 -ml-5'>
                            <Avatar className='w-10 h-10 absolute top-2 left-[3]'>
                                {participant.profile.avatar_url && <AvatarImage src={participant.profile.avatar_url} />}
                                <AvatarFallback>{participant.profile.username[0]}</AvatarFallback>
                            </Avatar>
                            <Image
                                src={`/images/levels/lvl${participant.level < 9 ? participant.level : "endgame"}.png`}
                                alt={`Level ${participant.level} border`}
                                width={48}
                                height={56}
                                className="absolute inset-0 pointer-events-none object-contain"
                            />
                        </div>
                        <span className="text-lg sm:-ml-5">{participant.profile.username}</span>
                    </div>
                    <span className="text-lg font-bold">{participant.contribution} points</span>
                </div>
            ))}
        </div>
    );
}