"use client";

import { Challenge } from "@/types/types";
import { CalendarFold, UserRound, Users } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

export default function ChallengesBox({ challenges }: { challenges: Challenge[] }) {
    function calculateTime(endString: string) {
        const end = new Date(endString);
        const timeDifference = end.getTime() - Date.now();
        const days = Math.floor(timeDifference / (1000 * 3600 * 24));
        const hours = Math.floor((timeDifference % (1000 * 3600 * 24)) / (1000 * 3600));

        return days + " days, " + hours + " hours left";
    }

    return (
        <Accordion type="single" collapsible className="w-full mx-auto mb-8 px-5">
            <AccordionItem value="challenges" className="text-center mb-4">
                <AccordionTrigger className="text-3xl font-bold hover:no-underline cursor-pointer">Challenges</AccordionTrigger>
                <AccordionContent className="flex justify-between text-lg w-1/3 max-lg:w-full mx-auto">
                    <div>
                        <UserRound className="inline-block" />{" - Individual"}
                    </div>
                    <div>
                        <Users className="inline-block" />{" - Class"}
                    </div>
                    <div>
                        <CalendarFold className="inline-block" />{" - Weekly"}
                    </div>
                </AccordionContent>
                <AccordionContent className="grid grid-cols-3 max-sm:grid-cols-1 gap-4 place-items-stretch px-4 text-lg">
                    {challenges.length > 0 ? (challenges.map((challenge, index) => (
                        <Card key={index} className={`flex flex-col h-full p-4 ${challenge.progress >= challenge.target_value ? 'bg-green-100 dark:bg-green-900 border-green-500 ' : 'bg-yellow-100 dark:bg-yellow-900 border-yellow-500'} border-b-5 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out pb-0`}>
                            <CardHeader>
                                <div className="flex justify-between text-left text-lg">
                                    <h1 className="-ml-5">{challenge.class_name}</h1>
                                    {challenge.type === "weekly" ?
                                        <CalendarFold className="-mr-5" />
                                        : challenge.type === "class" ?
                                            <Users className="-mr-5" />
                                            : <UserRound className="-mr-5" />
                                    }
                                </div>
                                <CardTitle className="text-2xl">{challenge.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 p-0">{challenge.description}</CardContent>
                            <Progress value={challenge.progress / challenge.target_value * 100} indicatorColor="bg-green-300" />
                            <div className="text-sm -mt-5">{challenge.progress}/{challenge.target_value}</div>
                            <div>Reward: <span className="text-2xl font-bold text-green-500">{challenge.xp_reward}</span> XP</div>
                            <div className="text-xl">{challenge.end_date && calculateTime(challenge.end_date)}</div>
                            <CardFooter className="justify-center bottom-0">
                                <a href={`/challenge/${challenge.id}`}>
                                    <Button className={`text-xl cursor-pointer rounded-b-none shadow-none text-black hover:bg-opacity-0 ${challenge.progress >= challenge.target_value ? 'bg-green-500' : 'bg-yellow-500'}`}>
                                        View Challenge
                                    </Button>
                                </a>
                            </CardFooter>
                        </Card>
                    ))) : (<p>No active challenges.</p>)}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}