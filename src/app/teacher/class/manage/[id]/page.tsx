import { getChallengesForClass, getClassDetailsTeacher, getHomeworkForClass } from "@/app/actions";
import AddStudentToClassForm from "@/components/add-student-to-class-form";
import ChallengesBox from "@/components/challenges-box";
import CreateChallengeForm from "@/components/create-challenge-form";
import RoleGate from "@/components/role-gate";
import StudentList from "@/components/student-list";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { getFormattedDate } from "@/lib/utils";
import { Homework } from "@/types/types";
import { createClient } from "@/utils/supabase/server";
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
                    <ChallengesBox challenges={challenges} />
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