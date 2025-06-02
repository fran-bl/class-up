import { getChallengesForClass, getClassDetailsTeacher, getHomeworkForClass } from "@/app/actions";
import AddStudentToClassForm from "@/components/add-student-to-class-form";
import AnimatedHomeworkGrid from "@/components/animated-homework-grid";
import ChallengesBox from "@/components/challenges-box";
import CreateChallengeForm from "@/components/create-challenge-form";
import RoleGate from "@/components/role-gate";
import StudentList from "@/components/student-list";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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

    const homeworks = [...homeworksRaw].sort((a: Homework, b: Homework) => {
        return new Date(a.due_date ?? "").getTime() - new Date(b.due_date ?? "").getTime();
    });

    return (
        <RoleGate allowedRoles={["admin", "teacher"]}>
            <div className="flex flex-col items-center justify-center gap-4">
                <h1 className="text-4xl max-sm:text-2xl text-center max-sm:mt-16 m-4">Manage <span style={{ fontFamily: 'var(--font-gta-medium)' }}>{classDetails?.name}</span></h1>
                {homeworks.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full mx-auto mb-8 px-5">
                        <AccordionItem value="homeworks">
                            <AccordionTrigger className="text-3xl font-bold hover:no-underline cursor-pointer">Your homeworks</AccordionTrigger>
                            <AccordionContent>
                                <AnimatedHomeworkGrid homeworks={homeworks} isTeacher={true} />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                ) : (
                    <div className="text-xl">No homeworks assigned to this class</div>
                )}
                {challenges.length > 0 ? (
                    <ChallengesBox challenges={challenges} />
                ) : (
                    <div className="text-xl">No challenges created for this class</div>
                )}
                <div className="text-2xl max-sm:text-xl">Additional info:</div>
                <Accordion type="single" collapsible className="w-full mx-auto mb-8 px-5">
                    <AccordionItem value="students">
                        <AccordionTrigger className="text-3xl font-bold hover:no-underline cursor-pointer">Students</AccordionTrigger>
                        <AccordionContent className="flex flex-col items-center justify-center gap-4">
                            <StudentList classDetails={classDetails} />
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="add-student">
                        <AccordionTrigger className="text-3xl font-bold hover:no-underline cursor-pointer">Add Student</AccordionTrigger>
                        <AccordionContent className="flex flex-col items-center justify-center gap-4">
                            <AddStudentToClassForm classDetails={classDetails} />
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="create-challenge">
                        <AccordionTrigger className="text-3xl font-bold hover:no-underline cursor-pointer">Create Challenge</AccordionTrigger>
                        <AccordionContent className="flex flex-col items-center justify-center gap-4">
                            <CreateChallengeForm classDetails={classDetails} />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </RoleGate>
    );
}