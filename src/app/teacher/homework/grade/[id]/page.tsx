import { getFormattedDate, getSubmissionsForHomework } from "@/app/actions";
import GradeForm from "@/components/grade-form";
import RoleGate from "@/components/role-gate";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { Check, ExternalLink, X } from "lucide-react";
import { redirect } from "next/navigation";

// @ts-expect-error Server Component
export default async function GradeHomework({ params }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { id } = await params;
    const submissions = await getSubmissionsForHomework(id);

    const sortedSubmissions = [...submissions].sort((a, b) => {
        if (!a.submitted_at) return 1;
        if (!b.submitted_at) return -1;
        return new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime();
    });

    const formattedSubmissions = await Promise.all(
        sortedSubmissions.map(async (submission) => ({
            ...submission,
            submitted_at_iso: submission.submitted_at,
            submitted_at: submission.submitted_at ? await getFormattedDate(submission.submitted_at) : "",
        }))
    );

    return (
        <RoleGate allowedRoles={["admin", "teacher"]}>
            {formattedSubmissions.length > 0 ? (
                <div className="flex flex-col items-center justify-center gap-4">
                    <h1 className="text-4xl max-sm:text-2xl text-center max-sm:mt-16 m-4">Grade Homework</h1>
                    <Accordion type="multiple" className="w-3/4 max-sm:w-full p-5">
                        {formattedSubmissions.map((submission, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                style={{ fontFamily: 'var(--font-gta-medium)' }}
                                className={`rounded-md mb-1 border-t-2 ${submission.graded ? "border-green-500" : "border-red-500"}`}
                            >
                                <AccordionTrigger className="cursor-pointer">
                                    <div className="grid grid-cols-2 justify-center items-center text-center gap-5 text-xl w-1/3 max-sm:w-full">
                                        <div className="grid-cols-1">Student: {submission.username}</div>
                                        <div className="grid-cols-1">Graded: {submission.graded ? <Check className="text-green-500 inline-block w-10 h-10" /> : <X className="text-red-500 inline-block w-10 h-10" />}</div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className={`flex flex-col justify-center gap-4 p-5 border-b-2 ${submission.graded ? "border-green-500" : "border-red-500"}`}>
                                    <div className="grid grid-cols-4 max-sm:grid-cols-2 justify-center items-center text-center gap-5">
                                        <div className="text-lg text-left">Submitted: {submission.submitted_at}</div>
                                        {new Date(submission.submitted_at_iso).getTime() > new Date(submission.due_date).getTime() ? (
                                            <div className="text-xl text-red-500">Late</div>
                                        ) : (
                                            <div className="text-xl text-green-500">On Time</div>
                                        )}
                                        <div className="text-xl">Grade: {submission.grade ? <p className="text-2xl max-sm:text-lg">{submission.grade + "/100"}</p> : "-/100"}</div>
                                        <a href={submission.file_url} target="_blank" rel="noopener noreferrer" className="text-xl">
                                            File:{" "}
                                            <Button variant="outline" size="icon">
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </a>
                                    </div>
                                    {!submission.graded && <GradeForm homeworkId={submission.homework_id} studentId={submission.student_id} />}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-4">
                    <h1 className="text-xl mt-16 text-center m-4" style={{ fontFamily: 'var(--font-gta-medium)' }}>No submissions found.</h1>
                </div>
            )}
        </RoleGate>
    );
}