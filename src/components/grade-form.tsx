"use client";

import { gradeHomework } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function GradeForm({ homeworkId, studentId }: { homeworkId: string; studentId: string }) {
    const [error, setError] = useState<string | null>(null);
    const [grade, setGrade] = useState<string | null>(null);
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setGrade(value);
        setError(null);
    }

    const validateForm = (): boolean => {
        let newError: string | null = null;
        if (!grade || grade.trim() === "") {
            newError = "Grade is required";
        }
        setError(newError);
        return newError === null;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm() || !grade) {
            return;
        }

        const result = await gradeHomework(homeworkId, studentId, grade);

        if (!result) {
            toast.error("Error adding grade!");
            return;
        }

        toast.success("Grade added successfully!");
        setGrade("");
        setError(null);
        router.refresh();
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-row justify-center gap-4">
            <div className="">
                <Input
                    id="name"
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Grade"
                />
                <p className={`text-red-500 min-h-[1.5rem] transition-opacity duration-200 ${error ? "opacity-100" : "opacity-0"}`}>
                    {error || " "}
                </p>
            </div>
            <Button type="submit" className="text-xl cursor-pointer">Grade</Button>
        </form>
    );
}