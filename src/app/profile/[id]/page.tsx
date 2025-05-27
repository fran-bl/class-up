"use client";

import { getHomeworksForStudent, getUserProfileById } from "@/app/actions";
import RoleGate from "@/components/role-gate";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { getFormattedDate, getLevel } from "@/lib/utils";
import { HomeworkSubmission } from "@/types/types";
import { Award, BookOpen, Calendar, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";


type Profile = {
    id: string;
    username: string;
    xp: number;
    avatar_url: string | null;
    created_at: string;
}

export default function ProfilePage() {
    const [profileData, setProfileData] = useState<Profile | null>(null);
    const [level, setLevel] = useState<number>(1);
    const [homeworks, setHomeworks] = useState<HomeworkSubmission[]>([]);
    const params = useParams();

    useEffect(() => {
        async function fetchHomeworks() {
            if (typeof params.id === "string") {
                const fetchedHomeworks = await getHomeworksForStudent(params.id);
                setHomeworks(fetchedHomeworks);
            }
        }
        async function fetchProfileData() {
            if (typeof params.id === "string") {
                const fetchedProfile = await getUserProfileById(params.id);
                setProfileData(fetchedProfile);
                setLevel(getLevel(fetchedProfile.xp)[0]);
            }
        }
        fetchProfileData();
        fetchHomeworks();
    }, []);

    const chartData = homeworks
        .sort((a, b) => new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime())
        .map(hw => ({
            assignment: hw.homework?.title || "Unknown Assignment",
            score: hw.grade,
            percentage: hw.grade,
            title: hw.homework?.title || "Unknown Assignment",
            date: getFormattedDate(hw.submitted_at),
        }));

    const averageScore =
        homeworks.length > 0
            ? Math.round(homeworks.reduce((sum, hw) => sum + hw.grade, 0) / homeworks.length)
            : 0

    const highestScore =
        homeworks.length > 0 ? Math.max(...homeworks.map((hw) => hw.grade)) : 0

    const totalAssignments = homeworks.length

    return (
        <RoleGate allowedRoles={["admin", "teacher", "student"]}>
            <div className="flex items-center space-x-4 ml-[15%] my-16">
                <div className='relative w-20 h-20'>
                    <Avatar className='w-15 h-15 absolute top-3 left-[4]'>
                        {profileData?.avatar_url && <AvatarImage src={profileData.avatar_url} />}
                        <AvatarFallback>{profileData?.username[0]}</AvatarFallback>
                    </Avatar>

                    {level && (
                        <Image
                            src={`/images/levels/lvl${level < 9 ? level : "endgame"}.png`}
                            alt={`Level ${level} border`}
                            width={70}
                            height={82}
                            className="absolute inset-0 pointer-events-none object-contain"
                        />
                    )}
                </div>
                <div>
                    <h1 className="text-3xl font-bold">{profileData?.username}</h1>
                    <p className="text-muted-foreground">{profileData && "Joined: " + getFormattedDate(profileData?.created_at)}</p>
                    <Badge variant="secondary" className="mt-1">Level {level}</Badge>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:mx-15">
                <Card className="bg-background m-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{averageScore}%</div>
                        <p className="text-xs text-muted-foreground">Across all assignments</p>
                    </CardContent>
                </Card>
                <Card className="bg-background m-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{highestScore}%</div>
                        <p className="text-xs text-muted-foreground">Best performance</p>
                    </CardContent>
                </Card>
                <Card className="bg-background m-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalAssignments}</div>
                        <p className="text-xs text-muted-foreground">Completed submissions</p>
                    </CardContent>
                </Card>
            </div>
            <Card className="bg-background m-1 max-lg:hidden lg:mx-15">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Score Trends
                    </CardTitle>
                    <CardDescription>Your homework scores over time</CardDescription>
                </CardHeader>
                <CardContent>
                    {homeworks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Recent Data</h3>
                            <p className="text-sm text-muted-foreground max-w-sm">
                                No homework submissions found. Complete and submit assignments to see your progress here.
                            </p>
                        </div>
                    ) : (
                        <ChartContainer
                            config={{
                                score: {
                                    label: "Score (%)",
                                    color: "hsl(var(--chart-1))",
                                },
                            }}
                            className="h-64"
                        >
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="assignment" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                <ChartTooltip
                                    content={
                                        <ChartTooltipContent
                                            labelFormatter={(label, payload) => {
                                                const data = payload?.[0]?.payload
                                                return data ? `${data.title} (${data.date})` : label
                                            }}
                                            formatter={(value) => [`${value}%`]}
                                        />
                                    }
                                />
                                <Line
                                    type="monotone"
                                    dataKey="percentage"
                                    stroke="var(--color-chart-1)"
                                    strokeWidth={3}
                                    dot={{ fill: "var(--color-chart-1)", strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, stroke: "var(--foreground)", strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ChartContainer>
                    )}
                </CardContent>
            </Card>
            {homeworks.length > 0 && (
                <Card className="bg-background m-1 lg:mx-15">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            Recent Assignments
                        </CardTitle>
                        <CardDescription>Your latest homework submissions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {homeworks
                                .slice(-5)
                                .reverse()
                                .map((homework) => (
                                    <div key={homework.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex-1">
                                            <h4 className="font-semibold">{homework.homework?.title}</h4>
                                            <p className="text-xs text-muted-foreground">
                                                Submitted: {getFormattedDate(homework.submitted_at)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold">
                                                {homework.grade}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </RoleGate>
    );
}