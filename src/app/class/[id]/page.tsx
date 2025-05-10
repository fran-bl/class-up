"use client";

import { getHomeworkForClass } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Homework } from "@/types/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClassPage() {
    const [homework, setHomework] = useState<Homework[]>([]);
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        async function fetchHomework() {
            if (typeof params.id === "string") {
                const homework = await getHomeworkForClass(params.id);
                setHomework(homework);
            }
        }
        fetchHomework();
    }, [params.id]);

    const handleHomeworkRedirect = (id: string) => {
        router.push("/homework/" + id);
    }

    return (
        <div>
            <h1>Class {params.id}</h1>
            <p>Details about class {params.id}.</p>
            {homework.map((hw) => (
                <Card key={hw.id}>
                    <CardHeader>{hw.title}</CardHeader>
                    <CardDescription>{hw.description}</CardDescription>
                    <CardFooter>
                        <Button onClick={() => handleHomeworkRedirect(hw.id)}>Details</Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}