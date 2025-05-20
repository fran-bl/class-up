import { getClassDetailsStudent, getFormattedDate, getHomeworkForClass } from "@/app/actions";
import RoleGate from "@/components/role-gate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// @ts-expect-error Server Component
export default async function ClassPage({ params }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }
    
    const { id } = await params;
    const classDetails = await getClassDetailsStudent(id);
    const homework = await getHomeworkForClass(id);
    const sorted = homework.sort((a, b) =>
        new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    );

    function getDueDateColor(dueDate: string) {
        const now = new Date();
        const due = new Date(dueDate);
        const diffMs = due.getTime() - now.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        if (diffDays < 0) return "text-red-600";
        if (diffDays < 1) return "text-orange-500";
        if (diffDays < 3) return "text-yellow-500";
        return "text-green-600";
    }

    return (
        <RoleGate allowedRoles={["admin", "student"]}>
            <h1 className="text-4xl text-center m-4" style={{ fontFamily: 'var(--font-gta-medium)' }}>{classDetails?.name}</h1>
            <p className="text-2xl text-center text-stone-600 mb-4">{classDetails?.description}</p>
            <div className="flex flex-col items-center justify-center mt-32 gap-4">
                {sorted.map((hw) => (
                    <Card key={hw.id} className="w-1/2">
                        <CardHeader className="grid grid-cols-2">
                            <CardTitle className="text-xl">{hw.title}</CardTitle>
                            <CardDescription className="text-right">
                                {hw.due_date && <p className={`text-2xl ${getDueDateColor(hw.due_date)}`}>{getFormattedDate(hw.due_date)}</p>}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-center text-lg">{hw.description}</CardDescription>
                        </CardContent>
                        <CardFooter className="justify-center">
                            <a href={`/homework/${hw.id}`}>
                                <Button className="text-xl cursor-pointer">Details</Button>
                            </a>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </RoleGate>
    );
}