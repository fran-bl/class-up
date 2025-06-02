import { getHomeworkDetails } from "@/app/actions";
import HomeworkSubmission from "@/components/homework-submission";
import PDFPreview from "@/components/pdf-preview";
import RoleGate from "@/components/role-gate";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { ExternalLink } from "lucide-react";
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
            <h1 className="text-4xl max-sm:text-2xl text-center m-4">Homework: <span style={{ fontFamily: 'var(--font-gta-medium)' }}>{homework?.title}</span></h1>
            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4 justify-center p-16">
                <div>
                    <p className="text-2xl max-sm:text-lg text-justify mb-4">{homework?.description}</p>
                    <HomeworkSubmission homework={homework} />
                </div>
                <div className="max-sm:hidden">
                    {homework && (
                        <div>
                            {homework.file_url && homework.file_url.endsWith("pdf") && (
                                <PDFPreview
                                    fileUrl={homework.file_url}
                                    fileName={homework.title}
                                />
                            )}
                        </div>
                    )}
                </div>
                <a href={homework.file_url} target="_blank" rel="noopener noreferrer" className="text-sm sm:hidden">
                    Homework file:{" "}
                    <Button variant="outline" size="icon">
                        <ExternalLink className="h-4 w-4" />
                    </Button>
                </a>
            </div>
        </RoleGate>
    );
}