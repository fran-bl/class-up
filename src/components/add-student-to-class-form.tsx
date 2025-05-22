"use client";

import { addStudentToClass } from "@/app/actions";
import { Class } from "@/types/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function AddStudentToClassForm({ classDetails }: { classDetails: Class | null }) {
    const [studentEmail, setStudentEmail] = useState<string>("");
    const [studentError, setStudentError] = useState<string | null>(null);
    const router = useRouter();
    
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
        setStudentEmail("");
        setStudentError(null);
        router.refresh();
    }
    return (
        <form onSubmit={handleSubmit} className="max-sm:w-full w-1/2 flex flex-col p-5">
            <h1 className="text-2xl max-sm:text-xl text-center">Add student to class</h1>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 max-sm:grid-cols-1 items-center gap-4 min-h-[4rem]">
                    <Label htmlFor="email" className="text-right text-xl">E-mail</Label>
                    <div className="col-span-3 max-sm:col-span-1">
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
            <Button type="submit" className="text-xl cursor-pointer">Add</Button>
        </form>
    );
}