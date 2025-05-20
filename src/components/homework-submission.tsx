"use client";

import { getSubmission, makeSubmission, uploadSubmissionFile } from "@/app/actions";
import { format, toZonedTime } from "date-fns-tz";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FileInput } from "./file-input";
import { Button } from "./ui/button";

export default function HomeworkSubmission({ hwId }: { hwId: string }) {
    const [file, setFile] = useState<File | null>(null);
    const [submittedDate, setSubmittedDate] = useState<string | null>(null);
    const [graded, setGraded] = useState<boolean>(false);
    const router = useRouter();

    function getFormattedDate(dateString: string) {
        const date = new Date(dateString);
        const timeZone = 'Europe/Berlin';

        const zonedDate = toZonedTime(date, timeZone);
        return format(zonedDate, "dd.MM.yyyy'. at 'HH:mm", { timeZone });
    }

    useEffect(() => {
        const checkSubmissionStatus = async () => {
            const data = await getSubmission(hwId);
            if (data) {
                setSubmittedDate(getFormattedDate(data.submitted_at));
                setGraded(data.graded);
            }
        }
        checkSubmissionStatus();
    }, [hwId]);

    const handleUploadFile = async () => {
        if (!file) {
            toast.error("Please select a file to upload.");
            return;
        }

        const uploadRes = await uploadSubmissionFile(file, hwId);
        if (uploadRes.success && uploadRes.url) {
            const submitRes = await makeSubmission(hwId, uploadRes.url);

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
                        <p className="text-xl">Submitted on: {submittedDate}<Check className="text-green-500 inline-block h-15 w-15 ml-5" /></p>
                        <p className="text-xl">Graded: {graded ? <Check className="text-green-500 inline-block h-15 w-15 ml-5" /> : <X className="text-red-500 inline-block h-15 w-15 ml-5" />}</p>
                    </div>
                )}
            </div>
            <div className="grid grid-cols-2 justify-center w-1/2">
                <FileInput
                    id="file"
                    accept="application/pdf, image/*"
                    onFileSelect={setFile}
                    className="col-span-1"
                />
                <Button onClick={handleUploadFile} className="text-xl cursor-pointer col-span-1 w-32">Upload</Button>
            </div>
        </div>
    );
}