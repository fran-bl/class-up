import { getHomeworkDetails } from "@/app/actions";
import HomeworkSubmission from "@/components/homework-submission";
import PDFPreview from "@/components/pdf-preview";
import RoleGate from "@/components/role-gate";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// @ts-expect-error Server Component
export default async function HomeworkPage({ params }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { id } = await params;
    const homework = await getHomeworkDetails(id);

    return (
        <RoleGate allowedRoles={["admin", "student"]}>
            <h1 className="text-4xl text-center m-4">Homework: <span style={{ fontFamily: 'var(--font-gta-medium)' }}>{homework?.title}</span></h1>
            <p className="text-2xl text-center text-stone-600 mb-4">{homework?.description}</p>
            <HomeworkSubmission hwId={homework.id} />
            <div className="grid justify-center mt-16">
                {homework && (
                    <div>
                        {homework.file_url && homework.file_url.endsWith("pdf") && (
                            <PDFPreview
                                fileUrl={homework.file_url}
                                fileName={homework.file_url.match(/\/([^\/?#]+)$/)?.[1]}
                            />
                        )}
                    </div>
                )}
            </div>
        </RoleGate>
    );
}