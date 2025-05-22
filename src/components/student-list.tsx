"use client";

import { deleteStudentFromClass, getStudentsInClass } from "@/app/actions";
import { Class } from "@/types/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export default function StudentList({ classDetails }: { classDetails: Class | null }) {
    const [students, setStudents] = useState<string[]>([]);
    const [studentsLoading, setStudentsLoading] = useState<boolean>(true);

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
        
    const handleRemoveStudent = async (username: string) => {
        setStudents((prevStudents) => prevStudents.filter((student) => student !== username));

        const res = await deleteStudentFromClass(classDetails?.id, username);
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
                            <div key={index} className="text-xl col-span-2">{student}</div>
                            <Button onClick={() => handleRemoveStudent(student)} className="text-xl cursor-pointer">Remove</Button>
                        </div>
                    ))
                ) : (
                    <div className="text-xl">No students in this class</div>
                )}
            </div>
        </div>
    );
}