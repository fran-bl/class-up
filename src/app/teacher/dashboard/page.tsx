"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function TeacherDashboard() {
    const router = useRouter();

    const handleCreateRedirect = () => {
        router.push("/teacher/homework/create");
    }

    return (
        <div>
            <h1>Teacher Dashboard</h1>
            <p>Details about the teacher dashboard.</p>
            <Button onClick={handleCreateRedirect}>Create Homework</Button>
        </div>
    );
}