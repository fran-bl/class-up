"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function TeacherDashboard() {
    const router = useRouter();

    const handleCreateRedirect = () => {
        router.push("/teacher/homework/create");
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-4xl text-center m-4" style={{ fontFamily: 'var(--font-gta-medium)' }}>Teacher Dashboard</h1>
            <Button onClick={handleCreateRedirect} className="text-xl cursor-pointer">Create Homework</Button>
        </div>
    );
}