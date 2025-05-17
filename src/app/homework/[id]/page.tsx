"use client";

import { getHomeworkDetails } from "@/app/actions";
import PDFPreview from "@/components/PDFPreview";
import { Homework } from "@/types/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomeworkPage() {
    const [homework, setHomework] = useState<Homework | null>(null);
    const params = useParams();

    useEffect(() => {
        async function fetchHomeworkDetails() {
            if (typeof params.id === "string") {
                const homework = await getHomeworkDetails(params.id);
                setHomework(homework);
            }
        }
        fetchHomeworkDetails();
    }, [params.id]);          

    return (
        <>
            <h1 className="text-4xl text-center m-4">Homework: <span style={{ fontFamily: 'var(--font-gta-medium)' }}>{homework?.title}</span></h1>
            <p className="text-2xl text-center text-stone-600 mb-4">{homework?.description}</p>
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
        </>
    );
}