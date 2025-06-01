import { getClassDetailsStudent, getHomeworkForClass } from "@/app/actions";
import AnimatedHomeworkGrid from "@/components/animated-homework-grid";
import RoleGate from "@/components/role-gate";
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
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    return (
        <RoleGate allowedRoles={["admin", "student"]}>
            <h1 className="text-4xl max-sm:text-2xl text-center m-4" style={{ fontFamily: 'var(--font-gta-medium)' }}>{classDetails?.name}</h1>
            <p className="text-2xl max-sm:text-lg text-center text-stone-600 mb-4">{classDetails?.description}</p>
            <AnimatedHomeworkGrid homeworks={sorted} />
        </RoleGate>
    );
}