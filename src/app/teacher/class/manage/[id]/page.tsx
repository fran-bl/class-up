"use client";

import { addStudentToClass, getClassDetailsTeacher, getStudentsInClass } from "@/app/actions";
import RoleGate from "@/components/role-gate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Class } from "@/types/types";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ManageClass() {
    const params = useParams();
    const [classDetails, setClassDetails] = useState<Class | null>(null);
    const [students, setStudents] = useState<string[]>([]);
    const [studentsLoading, setStudentsLoading] = useState<boolean>(false);
    const [studentEmail, setStudentEmail] = useState<string>("");
    const [studentError, setStudentError] = useState<string | null>(null);
    
    useEffect(() => {
            async function fetchClassDetails() {
                if (typeof params.id === "string") {
                    const classDetails = await getClassDetailsTeacher(params.id);
                    setClassDetails(classDetails);
                }
            }

            async function fetchStudentsInClass() {
                setStudentsLoading(true);
                if (typeof params.id === "string") {
                    const students = await getStudentsInClass(params.id);
                    setStudents(students);
                }
                setStudentsLoading(false);
            }

            fetchClassDetails();
            fetchStudentsInClass();
        }, []);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setStudentEmail(value);
    }

    const validateForm = (): boolean => {
        let newErrors: string | null = null;
        if (!studentEmail || studentEmail.trim() === "") {
            newErrors = "E-mail is required";
        }
        setStudentError(newErrors);
        return newErrors === null;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        const result = await addStudentToClass(classDetails?.id, studentEmail);

        if (!result) {
            toast.error("Error adding student!");
            return;
        }

        toast.success("Student added successfully!");
        setStudents((prevStudents) => [...prevStudents, studentEmail]);
        setStudentEmail("");
        setStudentError(null);
    }

    return (
        <RoleGate allowedRoles={["admin", "teacher"]}>
            <div className="flex flex-col items-center justify-center gap-4">
                <h1 className="text-4xl text-center m-4" style={{ fontFamily: 'var(--font-gta-medium)' }}>Manage {classDetails?.name}</h1>
                <div className="mt-16 mb-16">
                    <Label className="text-2xl">Students in this class:</Label>
                    {studentsLoading? (
                        <>
                            <Skeleton className="h-8 w-64 mb-2" />
                            <Skeleton className="h-8 w-64 mb-2" />
                            <Skeleton className="h-8 w-64" />
                        </>
                    ) : students.length > 0 ? (
                        students.map((student, index) => (
                            <div key={index} className="text-xl">{student}</div>
                        ))
                    ) : (
                        <div className="text-xl">No students in this class</div>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="w-1/2 flex flex-col">
                    <Label className="text-2xl">Add student to class</Label>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4 min-h-[4rem]">
                            <Label htmlFor="email" className="text-right text-xl">E-mail</Label>
                            <div className="col-span-3">
                                <Input
                                    id="name"
                                    onChange={handleInputChange}
                                    type="email"
                                    placeholder="example@email.com"
                                />
                                <p className={`text-red-500 min-h-[1.5rem] transition-opacity duration-200 ${studentError ? "opacity-100" : "opacity-0"}`}>
                                    {studentError || " "}
                                </p>
                            </div>
                        </div>
                    </div>
                    <Button type="submit" className="text-xl cursor-pointer mr-64 ml-64">Add</Button>
                </form>
            </div>
        </RoleGate>
    );
}