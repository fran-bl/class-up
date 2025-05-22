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
            <h1 className="text-4xl max-sm:text-2xl text-center max-sm:mt-16 m-4">Manage classes</h1>
            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4 place-items-stretch max-sm:px-4 px-15 mt-16">
                {classes?.map(c => (
                    <Card key={c.id} className="border-b-5 dark:border-b-blue-500 border-b-yellow-500 bg-[var(--background-color)] shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out pb-0">
                        <CardHeader>
                            <CardTitle className="text-2xl">{c.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-lg">{c.description}</CardDescription>
                        </CardContent>
                        <CardFooter className="justify-center">
                            <a href={`/teacher/class/manage/${c.id}`}>
                                <Button className="text-xl cursor-pointer rounded-b-none dark:bg-blue-500 bg-yellow-500 shadow-none text-black hover:bg-opacity-0">Manage</Button>
                            </a>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </RoleGate>
    );
}