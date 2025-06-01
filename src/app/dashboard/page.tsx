import AnimatedClassGrid from "@/components/animated-class-grid";
import ChallengesBox from "@/components/challenges-box";
import RoleGate from "@/components/role-gate";
import { Class } from "@/types/types";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getChallenges, getClassesStudent } from "../actions";

export default async function Dashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const classes: Class[] = (await getClassesStudent()).flat();
    const challenges = await getChallenges();

    return (
        <RoleGate allowedRoles={["admin", "student"]}>
            <h1 className="text-4xl max-sm:text-2xl font-bold text-center m-4 max-sm:pt-12">
                Welcome to{" "}
                <span
                    style={{ fontFamily: "var(--font-gta-medium)", alignItems: "center" }}
                >
                    <img
                        src="/images/logo-c-light.png"
                        alt="C"
                        className="w-20 h-20 inline-block mb-12 -mr-6 dark:hidden"
                    />
                    <img
                        src="/images/logo-c-dark.png"
                        alt="C"
                        className="w-20 h-20 mb-12 -mr-6 hidden dark:inline-block"
                    />
                    lassUp
                </span>
                !
            </h1>
            <ChallengesBox challenges={challenges} />
            <h1 className="px-5 text-3xl font-bold mb-5">Classes</h1>
            <AnimatedClassGrid classes={classes} isTeacher={false} />
        </RoleGate>
    );
}