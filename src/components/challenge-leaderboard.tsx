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

    if (sortedParticipants.length === 0) {
        return (
            <p className="text-center text-lg text-gray-500 mt-10">
                No participants have contributed yet. Be the first to contribute!
            </p>
        );
    }

    return (
        <>
            <div className="relative flex flex-col items-center justify-center mt-[15%] max-sm:mt-[50%]">
                <Image
                    src="/images/podium.webp"
                    alt="Podium image"
                    width={500}
                    height={500}
                    className="object-cover mb-4"
                />
                {sortedParticipants.slice(0, 3).map((participant, idx) => {
                    const positions = [
                        "left-[53%] -translate-x-1/2 -top-[50%] max-sm:left-[62%] max-sm:-top-[75%]",
                        "left-[38%] -top-[25%] max-sm:left-[10%] max-sm:-top-[50%]",
                        "left-[57%] -top-[17%] max-sm:left-[67%] max-sm:-top-[42%]",
                    ];
                    return (
                        <div
                            key={participant.profile_id}
                            className={`absolute flex flex-col items-center ${positions[idx]} z-10`}
                            style={{ transform: idx === 0 ? "translate(-50%, 0)" : undefined }}
                        >
                            <div className="relative w-20 h-20 left-2">
                                <Avatar className="w-15 h-15 top-3 left-[4]">
                                    {participant.profile.avatar_url && <AvatarImage src={participant.profile.avatar_url} />}
                                    <AvatarFallback>{participant.profile.username[0]}</AvatarFallback>
                                </Avatar>
                                <Image
                                    src={`/images/levels/lvl${participant.level < 9 ? participant.level : "endgame"}.png`}
                                    alt={`Level ${participant.level} border`}
                                    width={70}
                                    height={82}
                                    className="absolute inset-0 pointer-events-none object-contain"
                                />
                            </div>
                            <span className="text-lg font-bold">{participant.profile.username}</span>
                            <span className="text-md">{participant.contribution} pts</span>
                        </div>
                    );
                })}
            </div>
            <div className="flex flex-col items-center justify-center p-5">
                {sortedParticipants.slice(3).map((participant, index) => (
                    <div key={participant.profile_id} className="flex items-center justify-between w-full max-w-md mb-2rounded-lg">
                        <div className="grid grid-cols-3 items-center gap-4 w-1/2">
                            <span className="text-3xl">{index + 4}.</span>
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
        </>
    );
}