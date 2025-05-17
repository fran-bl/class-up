"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getClasses } from "../actions";
import { Class } from "@/types/types";

export default function Dashboard() {
    const [classes, setClasses] = useState<Class[]>([]);
    const router = useRouter();

    useEffect(() => {
        async function fetchClasses() {
            const classes = await getClasses();
            setClasses(classes);
        }
        fetchClasses();
    }, []);

    const handleClassRedirect = (id: string) => {
        router.push(`/class/${id}`);
    }

    return (
        <>
            <h1 className="text-4xl text-center m-4">Welcome to <span style={{ fontFamily: 'var(--font-gta-medium)' }}>ClassUp</span>!</h1>
            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4 place-items-stretch p-46">
                {classes?.map(c => (
                    <Card key={c.id}>
                        <CardHeader>
                            <CardTitle className="text-2xl">{c.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-center text-lg">{c.description}</CardDescription>
                        </CardContent>
                        <CardFooter className="justify-center">
                            <Button onClick={() => handleClassRedirect(c.id)} className="text-xl cursor-pointer">Details</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </>
    );
}