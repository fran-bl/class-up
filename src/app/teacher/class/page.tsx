import { getClassesTeacher } from "@/app/actions";
import RoleGate from "@/components/role-gate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ClassList() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const classes = await getClassesTeacher();

    return (
        <RoleGate allowedRoles={["admin", "teacher"]}>
            <div className="flex flex-col items-center justify-center gap-4">
                <h1 className="text-4xl text-center m-4" style={{ fontFamily: 'var(--font-gta-medium)' }}>Manage classes</h1>
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
                                <a href={`/teacher/class/manage/${c.id}`}>
                                    <Button className="text-xl cursor-pointer">Manage</Button>
                                </a>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </RoleGate>
    );
}