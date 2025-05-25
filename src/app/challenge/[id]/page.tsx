import { getChallengeById, getParticipants } from "@/app/actions";
import ChallengeLeaderboard from "@/components/challenge-leaderboard";
import RoleGate from "@/components/role-gate";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// @ts-expect-error Server Component
export default async function ChallengePage({ params }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { id } = await params;
    const challenge = await getChallengeById(id);
    const participants = await getParticipants(id);

    return (
        <RoleGate allowedRoles={["student", "admin"]}>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">{challenge.title}</h1>
                <p className="mb-4">{challenge.description}</p>
                <ChallengeLeaderboard participants={participants} />
            </div>
        </RoleGate>
    );
}