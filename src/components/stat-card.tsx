"use client";

import { getNumberOfActiveHomeworks, getNumberOfClasses, getSubmissionsToGrade } from "@/app/actions";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

export default function StatCard() {
    const [numberOfClasses, setNumberOfClasses] = useState(0);
    const [numberOfActiveHomeworks, setNumberOfActiveHomeworks] = useState(0);
    const [submissionsToGrade, setSubmissionsToGrade] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                setLoading(true);
                const nc = await getNumberOfClasses();
                const nh = await getNumberOfActiveHomeworks();
                const stg = await getSubmissionsToGrade();

                setNumberOfClasses(nc);
                setNumberOfActiveHomeworks(nh);
                setSubmissionsToGrade(stg);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        }

        fetchStats();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center gap-4 p-5">
            <h2 className="text-3xl font-bold">Statistics:</h2>
            {loading ? (
                <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-4 w-3/4 max-sm:w-full">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <Skeleton className="h-20" key={index} />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-4 w-3/4 max-sm:w-full">
                    <div className="p-4 flex justify-between border-r-5 border-[var(--foreground)]">
                        <h3 className="text-xl">Classes: </h3>
                        <span className="text-3xl" style={{ fontFamily: 'var(--font-gta-medium)' }}>{numberOfClasses}</span>
                    </div>
                    <div className="p-4 flex justify-between border-r-5 border-[var(--foreground)]">
                        <h3 className="text-xl">Active homeworks: </h3>
                        <span className="text-3xl" style={{ fontFamily: 'var(--font-gta-medium)' }}>{numberOfActiveHomeworks}</span>
                    </div>
                    <div className="p-4 flex justify-between border-r-5 border-[var(--foreground)]">
                        <h3 className="text-xl">Submissions to grade: </h3>
                        <span className="text-3xl" style={{ fontFamily: 'var(--font-gta-medium)' }}>{submissionsToGrade}</span>
                    </div>
                </div>
            )}
        </div>
    );
}