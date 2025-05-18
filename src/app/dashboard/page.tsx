import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getClassesStudent } from "../actions";
import RoleGate from "@/components/role-gate";
import { Class } from "@/types/types";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        redirect("/login");
    }

    const classes: Class[] = (await getClassesStudent()).flat();

    return (
        <RoleGate allowedRoles={["admin", "student"]}>
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
                            <a href={`/class/${c.id}`}>
                                <Button className="text-xl cursor-pointer">Details</Button>
                            </a>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </RoleGate>
    );
}