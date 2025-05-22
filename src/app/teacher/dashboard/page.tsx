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
            <h1 className="text-4xl max-sm:text-2xl max-sm:mt-16 text-center m-4">Teacher Dashboard</h1>
            <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-4 p-32 max-sm:p-5">
                <Button onClick={handleCreateHomeworkRedirect} className="text-xl cursor-pointer">Create Homework</Button>
                <Button onClick={handleCreateClassRedirect} className="text-xl cursor-pointer">Create Class</Button>
                <Button onClick={handleManageClass} className="text-xl cursor-pointer">Manage Classes</Button>
            </div>
        </RoleGate>
    );
}