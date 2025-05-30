"use client";

import { deleteStudentFromClass, getStudentsInClass } from "@/app/actions";
import { Class } from "@/types/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

type Student = {
    username: string;
    id: string;
}

export default function StudentList({ classDetails }: { classDetails: Class | null }) {
    const [students, setStudents] = useState<Student[]>([]);
    const [studentsLoading, setStudentsLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchStudentsInClass() {
            setStudentsLoading(true);
            if (classDetails?.id) {
                const students = await getStudentsInClass(classDetails.id);
                setStudents(students);
            }
            setStudentsLoading(false);
        }

        fetchStudentsInClass();
    }, [classDetails]);

    const handleRemoveStudent = async (id: string) => {
        setStudents((prevStudents) => prevStudents.filter((student) => student.id !== id));

        const res = await deleteStudentFromClass(classDetails?.id, id);
        if (!res) {
            toast.error("Error removing student!");
            return;
        }
        toast.success("Student removed successfully!");
    }

    return (
        <div className="my-5">
            <h1 className="text-2xl max-sm:text-xl text-center">Students in this class:</h1>
            <div className="grid gap-4 p-5">
                {studentsLoading ? (
                    Array.from({ length: 5 }, (_, index) => (
                        <Skeleton className="h-8" key={index} />
                    ))
                ) : students.length > 0 ? (
                    students.map((student, index) => (
                        <div className="grid grid-cols-3 gap-5" key={index}>
                            <div key={index} className="text-xl col-span-1">{student.username}</div>
                            <Button onClick={() => router.push(`/profile/${student.id}`)} className="text-xl max-sm:text-sm cursor-pointer">View Profile</Button>
                            <Button onClick={() => handleRemoveStudent(student.id)} className="text-xl max-sm:text-sm cursor-pointer">Remove</Button>
                        </div>
                    ))
                ) : (
                    <div className="text-xl">No students in this class</div>
                )}
            </div>
        </div>
    );
}