import { getClassDetailsTeacher, getFormattedDate, getHomeworkForClass } from "@/app/actions";
import AddStudentToClassForm from "@/components/add-student-to-class-form";
import RoleGate from "@/components/role-gate";
import StudentList from "@/components/student-list";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
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

    const sortedHomeworksRaw = [...homeworksRaw].sort((a: Homework, b: Homework) => {
        if (!a.created_at) return 1;
        if (!b.created_at) return -1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    const homeworks = await Promise.all(
        sortedHomeworksRaw.map(async (homework: Homework) => ({
            ...homework,
            due_date: homework.due_date ? await getFormattedDate(homework.due_date) : "",
            created_at: homework.created_at ? await getFormattedDate(homework.created_at) : "",
        }))
    );


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
                <StudentList classDetails={classDetails} />
                <AddStudentToClassForm classDetails={classDetails} />
            </div>
        </RoleGate>
    );
}