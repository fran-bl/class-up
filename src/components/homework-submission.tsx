"use client";

import { addXpToUser, getSubmission, makeSubmission, updateXpGainChallenges, uploadSubmissionFile } from "@/app/actions";
import { useXpToast } from "@/hooks/use-xp-toast";
import { getFormattedDate } from "@/lib/utils";
import { Homework } from "@/types/types";
import { Check, ExternalLink, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FileInput } from "./file-input";
import { Button } from "./ui/button";
import XpToast from "./xp-toast";

export default function HomeworkSubmission({ homework }: { homework: Homework }) {
    const [file, setFile] = useState<File | null>(null);
    const [submittedFile, setSubittedFile] = useState<string | null>(null);
    const [submittedDate, setSubmittedDate] = useState<string | null>(null);
    const [graded, setGraded] = useState<boolean>(false);
    const [grade, setGrade] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { xpToastState, showXpToast, hideXpToast } = useXpToast();
    const router = useRouter();

    useEffect(() => {
        const checkSubmissionStatus = async () => {
            if (!homework.id) {
                toast.error("Homework ID is missing.");
                return;
            }
            const data = await getSubmission(homework.id);
            if (data) {
                setSubmittedDate(getFormattedDate(data.submitted_at));
                setGraded(data.graded);
                setGrade(data.grade);
                setSubittedFile(data.file_url);
            }
            setLoading(false);
        }
        checkSubmissionStatus();
    }, []);

    const handleUploadFile = async () => {
        if (!file) {
            toast.error("Please select a file to upload.");
            return;
        }

        if (!homework.id || !homework.class_id) {
            toast.error("Homework data is missing.");
            return;
        }

        const uploadRes = await uploadSubmissionFile(file, homework.id);
        if (uploadRes.success && uploadRes.url) {
            const submitRes = await makeSubmission(homework.id, homework.class_id, uploadRes.url);

            if (!submittedDate) {
                let early = null;
                if (homework.due_date && new Date(homework.due_date).getTime() > new Date().getTime()) {
                    early = await addXpToUser(25);
                }

                const submissionXpRes = await addXpToUser(50);

                if (submissionXpRes) {
                    if (early) {
                        showXpToast("You submitted early! You earned bonus 25 XP!", 75);
                        await updateXpGainChallenges(homework.class_id, 75);
                    } else {
                        showXpToast("You submitted your homework! You earned 50 XP!", 50);
                        await updateXpGainChallenges(homework.class_id, 50);
                    }
                }
            }

            if (submitRes) {
                toast.success("Successfully submitted homework!");
                setTimeout(() => {
                    router.back();
                }, 3000);
            } else {
                toast.error("Error submitting homework!");
            }
            setFile(null);
        } else {
            toast.error("Error uploading file!");
        }
    }

    return (
        <div className="flex flex-col">
            <div>
                {submittedDate && (
                    <div>
                        <p className="text-xl max-sm:text-sm">Submitted: {submittedDate}<Check className="text-green-500 inline-block h-15 w-15 ml-5" /></p>
                        <div className="text-xl max-sm:text-sm">Graded: {graded ?
                            <>
                                <p className="inline-block text-2xl">{grade}</p>
                                <Check className="text-green-500 inline-block h-15 w-15 ml-5" />
                            </>
                            : <X className="text-red-500 inline-block h-15 w-15 ml-5" />}
                        </div>
                        <p></p>
                        <a href={submittedFile ?? undefined} target="_blank" rel="noopener noreferrer" className="text-xl max-sm:text-sm">
                            Your submission:{" "}
                            <Button variant="outline" size="icon">
                                <ExternalLink className="h-4 w-4" />
                            </Button>
                        </a>
                    </div>
                )}
            </div>
            {!loading && !graded &&
                <div className="grid grid-cols-2 max-sm:grid-cols-1 items-center gap-4 mt-5">
                    <FileInput
                        id="file"
                        accept="application/pdf, image/*"
                        onFileSelect={setFile}
                        className="col-span-1"
                    />
                    <Button onClick={handleUploadFile} className="text-xl cursor-pointer col-span-1 w-32">Upload</Button>
                </div>
            }
            <XpToast
                xp={xpToastState.xp}
                message={xpToastState.message}
                isVisible={xpToastState.isVisible}
                onClose={hideXpToast}
            />
        </div>
    );
}