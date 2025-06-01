import { getClassesTeacher } from "@/app/actions";
import AnimatedClassGrid from "@/components/animated-class-grid";
import RoleGate from "@/components/role-gate";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ClassList() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const classes = await getClassesTeacher();

    return (
        <RoleGate allowedRoles={["admin", "teacher"]}>
            <h1 className="text-4xl max-sm:text-2xl text-center max-sm:mt-16 m-4">Manage classes</h1>
            <AnimatedClassGrid classes={classes} />
        </RoleGate>
    );
}