"use client";

import RoleGate from "@/components/role-gate";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function TeacherDashboard() {
    const router = useRouter();

    const handleCreateHomeworkRedirect = () => {
        router.push("/teacher/homework/create");
    }

    const handleCreateClassRedirect = () => {
        router.push("/teacher/class/create");
    }

    const handleManageClass = () => {
        router.push("/teacher/class");
    }

    return (
        <RoleGate allowedRoles={["admin", "teacher"]}>
            <div className="flex flex-col items-center justify-center gap-4">
                <h1 className="text-4xl text-center m-4" style={{ fontFamily: 'var(--font-gta-medium)' }}>Teacher Dashboard</h1>
                <Button onClick={handleCreateHomeworkRedirect} className="text-xl cursor-pointer">Create Homework</Button>
                <Button onClick={handleCreateClassRedirect} className="text-xl cursor-pointer">Create Class</Button>
                <Button onClick={handleManageClass} className="text-xl cursor-pointer">Manage Classes</Button>
            </div>
        </RoleGate>
    );
}