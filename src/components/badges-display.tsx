"use client";

import { getUserBadges } from "@/app/actions";
import { Badge } from "@/types/types";
import { CalendarFold, Check, Flame, PartyPopper } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

export function BadgesDisplay({ userId }: { userId: string }) {
    const [badges, setBadges] = useState<Badge[]>([]);

    useEffect(() => {
        async function fetchBadges() {
            try {
                const badges = await getUserBadges(userId);
                setBadges(badges);
            } catch (error) {
                console.error("Error fetching badges:", error);
            }
        }
        fetchBadges();
    }, [userId]);

    return (
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {badges.map((badge) => {
                const progressObj = Array.isArray(badge.badges_progress)
                    ? badge.badges_progress[0]
                    : badge.badges_progress;

                const progress = progressObj ? Math.round(progressObj.progress_value / badge.condition_value * 100) : 0;

                return (
                    <Card key={badge.id} className="bg-background border-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{badge.name}</CardTitle>
                            {badge.type === "event" ?
                                <CalendarFold className="h-4 w-4 text-muted-foreground" />
                                : badge.type === "one_time" ?
                                    <Check className="h-4 w-4 text-muted-foreground" />
                                    : badge.type === "streak" ?
                                        <Flame className="h-4 w-4 text-muted-foreground" />
                                        : <PartyPopper className="h-4 w-4 text-muted-foreground" />
                            }
                        </CardHeader>
                        <CardContent className="flex flex-col items-center space-y-2">
                            <img
                                src={badge.icon_url}
                                alt={badge.name}
                                style={{
                                    filter: !progressObj || progressObj.progress_value < badge.condition_value ? "grayscale(100%)" : undefined,
                                }}
                                className="mt-2 w-25 h-25 object-cover"
                            />
                            <div className="text-sm text-muted-foreground">{badge.description}</div>
                            <Progress value={progress} indicatorColor="bg-green-500" />
                        </CardContent>
                    </Card>
                );
            })}
        </CardContent>
    );
}