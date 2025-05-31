"use client";

import { createChallenge } from "@/app/actions";
import { Challenge, Class } from "@/types/types";
import { useState } from "react";
import { toast } from "react-toastify";
import { DateTimePicker } from "./datetime-picker";
import RoleGate from "./role-gate";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";


type OtherErrors = {
    xp_reward: string;
    target_value: string;
    type: string;
    condition_type: string;
};

export default function CreateChallengeForm({ classDetails }: { classDetails: Class | null }) {
    const [challengeDetails, setChallengeDetails] = useState<Challenge>({
        id: undefined,
        target_class: classDetails?.id || "",
        created_by: undefined,
        title: "",
        description: undefined,
        type: "class",
        condition_type: "xp_gain",
        target_value: 0,
        progress: 0,
        xp_reward: 50,
        end_date: undefined,
        start_date: undefined
    });
    const [errors, setErrors] = useState<Partial<Challenge>>({});
    const [otherErrors, setOtherErrors] = useState<Partial<OtherErrors>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setChallengeDetails((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleTypeChange = (value: string) => {
        setChallengeDetails((prev) => ({
            ...prev,
            type: value as "individual" | "class" | "weekly",
        }));
    }

    const handleConditionTypeChange = (value: string) => {
        setChallengeDetails((prev) => ({
            ...prev,
            condition_type: value as "xp_gain" | "homework_count" | "streak",
        }));
    };

    const handleStartDateChange = (date: Date | undefined) => {
        setChallengeDetails((prev) => ({
            ...prev,
            start_date: date ? date.toISOString() : undefined,
        }));
    };

    const handleEndDateChange = (date: Date | undefined) => {
        setChallengeDetails((prev) => ({
            ...prev,
            end_date: date ? date.toISOString() : undefined,
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Challenge> = {};
        const newOtherErrors: Partial<OtherErrors> = {};

        if (!challengeDetails.title) {
            newErrors.title = "Title is required";
        }
        if (!challengeDetails.description) {
            newErrors.description = "Description is required";
        }
        if (!challengeDetails.xp_reward || challengeDetails.xp_reward <= 0) {
            newOtherErrors.xp_reward = "XP reward must be a positive number";
        }
        if (!challengeDetails.target_value || challengeDetails.target_value <= 0) {
            newOtherErrors.target_value = "Target value must be a positive number";
        }
        if (!challengeDetails.type) {
            newOtherErrors.type = "Type is required";
        }
        if (!challengeDetails.condition_type) {
            newOtherErrors.condition_type = "Condition type is required";
        }
        if (challengeDetails.type !== "weekly") {
            if (!challengeDetails.start_date) {
                newErrors.start_date = "Start date is required";
            }
            if (!challengeDetails.end_date) {
                newErrors.end_date = "End date is required";
            } else if (challengeDetails.start_date && new Date(challengeDetails.end_date) <= new Date(challengeDetails.start_date)) {
                newErrors.end_date = "End date must be after start date";
            }
        }

        setErrors(newErrors);
        setOtherErrors(newOtherErrors);
        return Object.keys(newErrors).length === 0 && Object.keys(newOtherErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        const challengeToSend = { ...challengeDetails };

        if (challengeDetails.type === "weekly") {
            const now = new Date();
            const end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            challengeToSend.start_date = now.toISOString();
            challengeToSend.end_date = end.toISOString();
        }

        const result = await createChallenge(challengeToSend);
        if (!result) {
            toast.error("Error creating challenge!");
            return;
        }

        toast.success("Challenge created successfully!");
        setChallengeDetails({
            id: undefined,
            target_class: classDetails?.id || "",
            created_by: undefined,
            title: "",
            description: undefined,
            type: "class",
            condition_type: "xp_gain",
            target_value: 0,
            progress: 0,
            xp_reward: 50,
            end_date: undefined,
            start_date: undefined
        });
    };

    return (
        <RoleGate allowedRoles={["admin", "teacher"]}>
            <div className="flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl max-sm:text-xl text-center max-sm:mt-16 m-4">Create challenge:</h1>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 max-sm:grid-cols-1 items-center gap-4 min-h-[4rem]">
                            <Label htmlFor="title" className="text-right text-xl">Title</Label>
                            <div className="col-span-3 max-sm:col-span-1">
                                <Input
                                    id="title"
                                    value={challengeDetails.title || ""}
                                    onChange={handleInputChange}
                                    placeholder="Title"
                                />
                                <p className={`text-red-500 min-h-[1.5rem] transition-opacity duration-200 ${errors.title ? "opacity-100" : "opacity-0"}`}>
                                    {errors.title || " "}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 max-sm:grid-cols-1 items-center gap-4 min-h-[4rem]">
                            <Label htmlFor="description" className="text-right text-xl">Description</Label>
                            <div className="col-span-3 max-sm:col-span-1">
                                <Input
                                    id="description"
                                    value={challengeDetails.description || ""}
                                    onChange={handleInputChange}
                                    placeholder="Description"
                                />
                                <p className={`text-red-500 min-h-[1.5rem] transition-opacity duration-200 ${errors.description ? "opacity-100" : "opacity-0"}`}>
                                    {errors.description || " "}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 max-sm:grid-cols-1 items-center gap-4 min-h-[4rem]">
                            <Label htmlFor="xp_reward" className="text-right text-xl">XP reward</Label>
                            <div className="col-span-3 max-sm:col-span-1">
                                <Input
                                    id="xp_reward"
                                    value={challengeDetails.xp_reward || ""}
                                    onChange={handleInputChange}
                                    placeholder="XP reward"
                                    type="number"
                                    min="0"
                                    step="1"
                                />
                                <p className={`text-red-500 min-h-[1.5rem] transition-opacity duration-200 ${otherErrors.xp_reward ? "opacity-100" : "opacity-0"}`}>
                                    {otherErrors.xp_reward || " "}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 max-sm:grid-cols-1 items-center gap-4 min-h-[4rem]">
                            <Label htmlFor="type" className="text-right text-xl">Type</Label>
                            <div className="col-span-3 max-sm:col-span-1">
                                <Select
                                    value={challengeDetails.type}
                                    onValueChange={handleTypeChange}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="class">Class</SelectItem>
                                            <SelectItem value="weekly">Weekly</SelectItem>
                                            <SelectItem value="individual">Individual</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <p className={`text-red-500 min-h-[1.5rem] transition-opacity duration-200 ${otherErrors.type ? "opacity-100" : "opacity-0"}`}>
                                    {otherErrors.type || " "}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 max-sm:grid-cols-1 items-center gap-4 min-h-[4rem]">
                            <Label htmlFor="condition_type" className="text-right text-xl">Condition type</Label>
                            <div className="col-span-3 max-sm:col-span-1">
                                <Select
                                    value={challengeDetails.condition_type}
                                    onValueChange={handleConditionTypeChange}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a condition type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="xp_gain">XP gain</SelectItem>
                                            <SelectItem value="homework_count">Homework count</SelectItem>
                                            <SelectItem value="streak">Streak</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <p className={`text-red-500 min-h-[1.5rem] transition-opacity duration-200 ${otherErrors.condition_type ? "opacity-100" : "opacity-0"}`}>
                                    {otherErrors.condition_type || " "}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 max-sm:grid-cols-1 items-center gap-4 min-h-[4rem]">
                            <Label htmlFor="target_value" className="text-right text-xl">Target value</Label>
                            <div className="col-span-3 max-sm:col-span-1">
                                <Input
                                    id="target_value"
                                    value={challengeDetails.target_value || ""}
                                    onChange={handleInputChange}
                                    placeholder="Target value"
                                    type="number"
                                    min="1"
                                    step="1"
                                />
                                <p className={`text-red-500 min-h-[1.5rem] transition-opacity duration-200 ${otherErrors.target_value ? "opacity-100" : "opacity-0"}`}>
                                    {otherErrors.target_value || " "}
                                </p>
                            </div>
                        </div>
                        {challengeDetails.type !== "weekly" && (
                            <>
                                <div className="grid grid-cols-4 max-sm:grid-cols-1 items-center gap-4 min-h-[4rem]">
                                    <Label className="text-right text-xl">Start date</Label>
                                    <div className="col-span-3 max-sm:col-span-1">
                                        <DateTimePicker value={undefined} onChange={handleStartDateChange} />
                                        <p className={`text-red-500 min-h-[1.5rem] transition-opacity duration-200 ${errors.start_date ? "opacity-100" : "opacity-0"}`}>
                                            {errors.start_date || " "}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 max-sm:grid-cols-1 items-center gap-4 min-h-[4rem]">
                                    <Label className="text-right text-xl">End date</Label>
                                    <div className="col-span-3 max-sm:col-span-1">
                                        <DateTimePicker value={undefined} onChange={handleEndDateChange} />
                                        <p className={`text-red-500 min-h-[1.5rem] transition-opacity duration-200 ${errors.end_date ? "opacity-100" : "opacity-0"}`}>
                                            {errors.end_date || " "}
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <Button type="submit" className="text-xl cursor-pointer">Create</Button>
                </form>
            </div>
        </RoleGate>
    );
}