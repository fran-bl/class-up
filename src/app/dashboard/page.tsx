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
        router.push("/class/" + id);
    }
    
    return classes?.map(c => (
        <Card key={c.id}>
            <CardHeader>
                <CardTitle>{c.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>{c.description}</CardDescription>
            </CardContent>
            <CardFooter>
                <Button onClick={() => handleClassRedirect(c.id)}>Detalji</Button>
            </CardFooter>
        </Card>
    ));
}