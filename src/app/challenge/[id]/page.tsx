import { getChallengeById, getFormattedDate, getParticipants } from "@/app/actions";
import ChallengeLeaderboard from "@/components/challenge-leaderboard";
import RoleGate from "@/components/role-gate";
import { Progress } from "@/components/ui/progress";
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

    const start = await getFormattedDate(challenge.start_date);
    const end = await getFormattedDate(challenge.end_date);

    return (
        <RoleGate allowedRoles={["student", "admin"]}>
            <div className="flex flex-col items-center justify-center p-4">
                <h1 className="text-4xl font-bold mb-4 max-sm:text-2xl max-sm:mt-16">{challenge.title}</h1>
                <p className="mb-4 text-xl max-sm:text-lg">{challenge.description}</p>
                <div>Reward: <span className="text-2xl font-bold text-green-500">{challenge.xp_reward}</span> XP</div>
                <p className="text-lg text-gray-500 max-sm:text-sm">
                    {start} - {end}
                </p>
                <Progress value={challenge.progress / challenge.target_value * 100} indicatorColor="bg-green-500" className="w-1/2 mt-10 max-sm:w-3/4" />
                <p className="text-lg text-gray-500 mt-2">
                    Progress: {challenge.progress} / {challenge.target_value}
                </p>
            </div>
            <ChallengeLeaderboard participants={participants} />
        </RoleGate>
    );
}