import { getClass, getHomeworkForClass } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format, toZonedTime } from 'date-fns-tz';
import RoleGate from "@/components/role-gate";

// @ts-expect-error Server Component
export default async function ClassPage({ params }) {
    const { id } = await params;
    const classDetails = await getClass(id);
    const homework = await getHomeworkForClass(id);

    function getDueDateColor(dueDate: string) {
        const now = new Date();
        const due = new Date(dueDate);
        const diffMs = due.getTime() - now.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        if (diffDays < 0) return "text-red-600";
        if (diffDays < 1) return "text-orange-500";
        if (diffDays < 3) return "text-yellow-500";
        return "text-green-600";
    }

    function getFormattedDate(dateString: string) {
        const date = new Date(dateString);
        const timeZone = 'Europe/Berlin';

        const zonedDate = toZonedTime(date, timeZone);
        return format(zonedDate, "dd.MM.yyyy'. at 'HH:mm", { timeZone });
    }

    return (
        <RoleGate allowedRoles={["admin", "student"]}>
            <h1 className="text-4xl text-center m-4" style={{ fontFamily: 'var(--font-gta-medium)' }}>{classDetails?.name}</h1>
            <p className="text-2xl text-center text-stone-600 mb-4">{classDetails?.description}</p>
            <div className="flex flex-col items-center justify-center mt-32 gap-4">
                {homework.map((hw) => (
                    <Card key={hw.id} className="w-1/2">
                        <CardHeader className="grid grid-cols-2">
                            <CardTitle className="text-xl">{hw.title}</CardTitle>
                            <CardDescription className="text-right">
                                {hw.due_date && <p className={`text-2xl ${getDueDateColor(hw.due_date)}`}>{getFormattedDate(hw.due_date)}</p>}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-center text-lg">{hw.description}</CardDescription>
                        </CardContent>
                        <CardFooter className="justify-center">
                            <a href={`/homework/${hw.id}`}>
                                <Button className="text-xl cursor-pointer">Details</Button>
                            </a>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </RoleGate>
    );
}