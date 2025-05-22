"use client";

import { createClass } from "@/app/actions";
import RoleGate from "@/components/role-gate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Class } from "@/types/types";
import { useState } from "react";
import { toast } from "react-toastify";

export default function CreateClass() {
    const [classDetails, setClassDetails] = useState<Class>({
        id: undefined,
        teacher_id: undefined,
        name: "",
        description: undefined,
        created_at: undefined,
    });
    const [errors, setErrors] = useState<Partial<Class>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setClassDetails((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Class> = {};
        if (!classDetails.name) {
            newErrors.name = "Name is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        const result = await createClass(classDetails);
        if (!result) {
            toast.error("Error creating class!");
            return;
        }

        toast.success("Class created successfully!");
        setClassDetails({
            id: undefined,
            teacher_id: undefined,
            name: "",
            description: undefined,
            created_at: undefined,
        });
    };

    return (
        <RoleGate allowedRoles={["admin", "teacher"]}>
            <div className="flex flex-col items-center justify-center gap-4">
                <h1 className="text-4xl max-sm:text-2xl text-center max-sm:mt-16 m-4">Create class</h1>
                <form onSubmit={handleSubmit} className="w-1/2 flex flex-col">
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 max-sm:grid-cols-1 items-center gap-4 min-h-[4rem]">
                            <Label htmlFor="name" className="text-right text-xl">Name</Label>
                            <div className="col-span-3 max-sm:col-span-1">
                                <Input
                                    id="name"
                                    value={classDetails.name || ""}
                                    onChange={handleInputChange}
                                    placeholder="Name"
                                />
                                <p className={`text-red-500 min-h-[1.5rem] transition-opacity duration-200 ${errors.name ? "opacity-100" : "opacity-0"}`}>
                                    {errors.name || " "}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 max-sm:grid-cols-1 items-center gap-4 min-h-[4rem]">
                            <Label htmlFor="description" className="text-right text-xl">Description</Label>
                            <div className="col-span-3 max-sm:col-span-1">
                                <Input
                                    id="description"
                                    value={classDetails.description || ""}
                                    onChange={handleInputChange}
                                    placeholder="Description"
                                />
                            </div>
                        </div>
                    </div>
                    <Button type="submit" className="text-xl cursor-pointer">Submit</Button>
                </form>
            </div>
        </RoleGate>
    );
}