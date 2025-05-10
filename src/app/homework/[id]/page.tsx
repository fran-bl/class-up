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
        <div>
            <h1>Homework {params.id}</h1>
            {homework ? (
                <div>
                    <h2>{homework.title}</h2>
                    <p>{homework.description}</p>
                    {homework.file_url && (
                        <PDFPreview
                            fileUrl={homework.file_url}
                            fileName={homework.file_url.match(/\/([^\/?#]+)$/)?.[1]}
                        />
                    )}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}