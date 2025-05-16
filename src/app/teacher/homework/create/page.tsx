"use client";

import { createHomework, getClasses, uploadFile } from "@/app/actions";
import { DateTimePicker } from "@/components/DateTimePicker";
import { FileInput } from "@/components/FileInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Class, Homework } from "@/types/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function CreateHomework() {
    const [hw, setHw] = useState<Homework>({
        id: undefined,
        class_id: undefined,
        title: "",
        description: undefined,
        file_url: undefined,
        created_at: undefined,
        due_date: undefined,
    });
    const [errors, setErrors] = useState<Partial<Homework>>({});
    const [file, setFile] = useState<File | null>(null);
    const [classes, setClasses] = useState<Class[]>([]);

    useEffect(() => {
        async function fetchClasses() {
            const classes = await getClasses();
            setClasses(classes);
        }
        fetchClasses();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setHw((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleDateChange = (date: Date | undefined) => {
        setHw((prev) => ({
            ...prev,
            due_date: date?.toISOString(),
        }));
    };

    const handleClassChange = (value: string) => {
        setHw((prev) => ({
            ...prev,
            class_id: value,
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Homework> = {};
        if (!hw.title) {
            newErrors.title = "Title is required";
        }
        if (!hw.class_id) {
            newErrors.class_id = "Class is required";
        }
        if (!hw.due_date) {
            newErrors.due_date = "Due date is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSumbit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        if (file) {
            const uploadRes = await uploadFile(file, hw.title);
            if (uploadRes.success) {
                hw.file_url = uploadRes.url;
            } else {
                toast("Error uploading file");
            }
        }

        await createHomework(hw);
        toast("Homework created successfully!");
        setHw({
            id: undefined,
            class_id: undefined,
            title: "",
            description: undefined,
            file_url: undefined,
            created_at: undefined,
            due_date: undefined,
        });
    };

    return (
        <div>
            <h1>Teacher create homework</h1>
            <form onSubmit={handleSumbit}>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">Title</Label>
                        <div className="col-span-3">
                            <Input
                                id="title"
                                value={hw.title || ""}
                                onChange={handleInputChange}
                                placeholder="Title"
                            />
                            {errors.title && <p className="text-red-500">{errors.title}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">Description</Label>
                        <div className="col-span-3">
                            <Input
                                id="description"
                                value={hw.description || ""}
                                onChange={handleInputChange}
                                placeholder="Description"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="class_id" className="text-right">Class</Label>
                        <div className="col-span-3">
                            <Select
                                value={hw.class_id}
                                onValueChange={handleClassChange}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a class" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Classes</SelectLabel>
                                        {classes.map((classItem) => (
                                            <SelectItem key={classItem.id} value={classItem.id}>
                                                {classItem.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.class_id && <p className="text-red-500">{errors.class_id}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">File</Label>
                        <div className="col-span-3">
                            <FileInput
                                id="file"
                                accept="application/pdf, image/*"
                                onFileSelect={setFile}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Due date</Label>
                        <div className="col-span-3">
                            <DateTimePicker value={undefined} onChange={handleDateChange}/>
                            {errors.due_date && <p className="text-red-500">{errors.due_date}</p>}
                        </div>
                    </div>
                </div>
                <Button type="submit">Submit</Button>
            </form>
        </div>
    );
}