"use client";

import { getFormattedDate, getSubmission, makeSubmission, uploadSubmissionFile } from "@/app/actions";
import { Homework } from "@/types/types";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FileInput } from "./file-input";
import { Button } from "./ui/button";

export default function HomeworkSubmission({ homework }: { homework: Homework }) {
    const [file, setFile] = useState<File | null>(null);
    const [submittedDate, setSubmittedDate] = useState<string | null>(null);
    const [graded, setGraded] = useState<boolean>(false);
    const [grade, setGrade] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkSubmissionStatus = async () => {
            if (!homework.id) {
                toast.error("Homework ID is missing.");
                return;
            }
            const data = await getSubmission(homework.id);
            if (data) {
                setSubmittedDate(await getFormattedDate(data.submitted_at));
                setGraded(data.graded);
                setGrade(data.grade);
            }
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

            if (submitRes) {
                toast.success("Successfully submitted homework!");
                setTimeout(() => {
                    router.back();
                }, 1000);
            } else {
                toast.error("Error submitting homework!");
            }
            setFile(null);
        } else {
            toast.error("Error uploading file!");
        }
    }

    return (
        <div className="flex flex-col m-16">
            <div>
                {submittedDate && (
                    <div>
                        <p className="text-xl">Submitted: {submittedDate}<Check className="text-green-500 inline-block h-15 w-15 ml-5" /></p>
                        <div className="text-xl">Graded: {graded ?
                            <>
                                <Check className="text-green-500 inline-block h-15 w-15 ml-5" />
                                <p className="inline-block text-2xl">{grade}</p>
                            </>
                            : <X className="text-red-500 inline-block h-15 w-15 ml-5" />}
                        </div>
                    </div>
                )}
            </div>
            {!graded && homework.due_date && new Date(homework.due_date) > new Date(Date.now()) &&
                <div className="grid grid-cols-2 justify-center w-1/2">
                    <FileInput
                        id="file"
                        accept="application/pdf, image/*"
                        onFileSelect={setFile}
                        className="col-span-1"
                    />
                    <Button onClick={handleUploadFile} className="text-xl cursor-pointer col-span-1 w-32">Upload</Button>
                </div>
            }
        </div>
    );
}