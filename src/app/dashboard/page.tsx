import RoleGate from "@/components/role-gate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Class } from "@/types/types";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getClassesStudent } from "../actions";

export default async function Dashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const classes: Class[] = (await getClassesStudent()).flat();

    return (
        <RoleGate allowedRoles={["admin", "student"]}>
            <h1 className="text-4xl max-sm:text-2xl font-bold text-center m-4 max-sm:pt-12">
                Welcome to{" "}
                <span
                    style={{ fontFamily: "var(--font-gta-medium)", alignItems: "center" }}
                >
                    <img
                        src="/images/logo-c-light.png"
                        alt="C"
                        className="w-20 h-20 inline-block mb-12 -mr-6 dark:hidden"
                    />
                    <img
                        src="/images/logo-c-dark.png"
                        alt="C"
                        className="w-20 h-20 mb-12 -mr-6 hidden dark:inline-block"
                    />
                    lassUp
                </span>
                !
            </h1>
            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4 place-items-stretch max-sm:px-4 px-15">
                {classes?.map(c => (
                    <Card key={c.id} className="border-b-5 dark:border-b-blue-500 border-b-yellow-500 bg-[var(--background-color)] shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out pb-0">
                        <CardHeader>
                            <CardTitle className="text-2xl">{c.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-lg">{c.description}</CardDescription>
                        </CardContent>
                        <CardFooter className="justify-center">
                            <a href={`/class/${c.id}`}>
                                <Button className="text-xl cursor-pointer rounded-b-none dark:bg-blue-500 bg-yellow-500 shadow-none text-black hover:bg-opacity-0">Details</Button>
                            </a>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </RoleGate>
    );
}