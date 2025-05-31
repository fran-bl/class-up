import { getChallengesForClass, getClassDetailsTeacher, getHomeworkForClass } from "@/app/actions";
import AddStudentToClassForm from "@/components/add-student-to-class-form";
import CreateChallengeForm from "@/components/create-challenge-form";
import RoleGate from "@/components/role-gate";
import StudentList from "@/components/student-list";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { calculateTime, getFormattedDate } from "@/lib/utils";
import { Homework } from "@/types/types";
import { createClient } from "@/utils/supabase/server";
import { CalendarFold, UserRound, Users } from "lucide-react";
import { redirect } from "next/navigation";

// @ts-expect-error Server Component
export default async function ManageClass({ params }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { id } = await params;
    const classDetails = await getClassDetailsTeacher(id);
    const homeworksRaw = await getHomeworkForClass(id);
    const challenges = await getChallengesForClass(id);

    const sortedHomeworksRaw = [...homeworksRaw].sort((a: Homework, b: Homework) => {
        if (!a.created_at) return 1;
        if (!b.created_at) return -1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    const homeworks = sortedHomeworksRaw.map((homework: Homework) => ({
        ...homework,
        due_date: homework.due_date ? getFormattedDate(homework.due_date) : "",
        created_at: homework.created_at ? getFormattedDate(homework.created_at) : "",
    }));

    return (
        <RoleGate allowedRoles={["admin", "teacher"]}>
            <div className="flex flex-col items-center justify-center gap-4">
                <h1 className="text-4xl max-sm:text-2xl text-center max-sm:mt-16 m-4">Manage {classDetails?.name}</h1>
                {homeworks.length > 0 ? (
                    <>
                        <div className="text-2xl max-sm:text-xl">Homeworks:</div>
                        <Accordion type="multiple" className="w-1/2 max-sm:w-full max-sm:px-4">
                            {homeworks.map((homework, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger className="text-xl">{homework.title}</AccordionTrigger>
                                    <AccordionContent className="flex flex-col items-center justify-center gap-4">
                                        <div className="text-xl">Due {homework.due_date}</div>
                                        <div className="text-xl">Created {homework.created_at}</div>
                                        <a href={`/teacher/homework/grade/${homework.id}`}>
                                            <Button className="text-xl cursor-pointer">Details</Button>
                                        </a>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </>
                ) : (
                    <div className="text-xl">No homeworks assigned to this class</div>
                )}
                {challenges.length > 0 ? (
                    <Accordion type="multiple" className="w-1/2 max-sm:w-full max-sm:px-4">
                        <AccordionItem value="challenges" className="text-center mb-4">
                            <AccordionTrigger className="text-2xl max-sm:text-xl">Challenges:</AccordionTrigger>
                            <AccordionContent className="flex flex-col items-center justify-center gap-4">
                                {challenges.map((challenge, index) => (
                                    <Card key={index} className={`flex flex-col h-full w-1/2 max-sm:w-full p-4 ${challenge.progress >= challenge.target_value ? 'bg-green-100 dark:bg-green-900 border-green-500 ' : 'bg-yellow-100 dark:bg-yellow-900 border-yellow-500'} border-b-5 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out pb-0`}>
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
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                ) : (
                    <div className="text-xl">No challenges created for this class</div>
                )}
                <div className="text-2xl max-sm:text-xl">Additional info:</div>
                <Accordion type="single" collapsible className="w-1/2 max-sm:w-full max-sm:px-4">
                    <AccordionItem value="students">
                        <AccordionTrigger className="text-2xl max-sm:text-xl">Students</AccordionTrigger>
                        <AccordionContent className="flex flex-col items-center justify-center gap-4">
                            <StudentList classDetails={classDetails} />
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="add-student">
                        <AccordionTrigger className="text-2xl max-sm:text-xl">Add Student</AccordionTrigger>
                        <AccordionContent className="flex flex-col items-center justify-center gap-4">
                            <AddStudentToClassForm classDetails={classDetails} />
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="create-challenge">
                        <AccordionTrigger className="text-2xl max-sm:text-xl">Create Challenge</AccordionTrigger>
                        <AccordionContent className="flex flex-col items-center justify-center gap-4">
                            <CreateChallengeForm classDetails={classDetails} />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </RoleGate>
    );
}