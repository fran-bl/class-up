import { getClassDetailsTeacher, getFormattedDate, getHomeworkForClass } from "@/app/actions";
import AddStudentToClassForm from "@/components/add-student-to-class-form";
import RoleGate from "@/components/role-gate";
import StudentList from "@/components/student-list";
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
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });

    const homeworks = await Promise.all(
        sortedHomeworksRaw.map(async (homework: Homework) => ({
            ...homework,
            due_date: homework.due_date ? await getFormattedDate(homework.due_date) : "",
        }))
    );


    return (
        <RoleGate allowedRoles={["admin", "teacher"]}>
            <div className="flex flex-col items-center justify-center gap-4">
                <h1 className="text-4xl text-center m-4" style={{ fontFamily: 'var(--font-gta-medium)' }}>Manage {classDetails?.name}</h1>
                <div className="flex flex-col items-center justify-center gap-4">
                    {homeworks.length > 0 ? (
                        homeworks.map((homework, index) => (
                            <div className="grid grid-cols-3 justify-center items-center gap-5 w-full" key={index}>
                                <div className="text-xl">{homework.title}</div>
                                <div className="text-xl">Due {homework.due_date}</div>
                                <a href={`/teacher/homework/grade/${homework.id}`}>
                                    <Button className="text-xl cursor-pointer">Details</Button>
                                </a>
                            </div>
                        ))
                    ) : (
                        <div className="text-xl">No homeworks assigned to this class</div>
                    )}
                </div>
                <StudentList classDetails={classDetails} />
                <AddStudentToClassForm classDetails={classDetails} />
            </div>
        </RoleGate>
    );
}