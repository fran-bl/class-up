"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn, getDueDateColor, getFormattedDate } from "@/lib/utils"
import type { Homework } from "@/types/types"
import { useEffect, useRef, useState } from "react"
import { Button } from "./ui/button"

export default function AnimatedHomeworkGrid({ homeworks, isTeacher }: { homeworks: Homework[], isTeacher: boolean }) {
    const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set())
    const cardRefs = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
        const observers: IntersectionObserver[] = []

        cardRefs.current.forEach((card, index) => {
            if (card) {
                const observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                setTimeout(() => {
                                    setVisibleCards((prev) => new Set([...prev, index]))
                                }, index * 100)
                                observer.unobserve(entry.target)
                            }
                        })
                    },
                    { threshold: 0.1 },
                )
                observer.observe(card)
                observers.push(observer)
            }
        })

        return () => {
            observers.forEach((observer) => observer.disconnect())
        }
    }, [homeworks])

    return (
        <div className="flex flex-col items-center justify-center max-sm:mt-0 gap-4 max-sm:px-5">
            {homeworks.map((hw, index) => (
                <div
                    key={hw.id}
                    ref={(el) => { cardRefs.current[index] = el }}
                    className={cn(
                        "transition-all duration-700 ease-out",
                        "opacity-0 translate-y-8 scale-95 w-full flex justify-center",
                        visibleCards.has(index) && "opacity-100 translate-y-0 scale-100",
                        "group",
                    )}
                >
                    <Card className={cn(
                        "w-1/2 max-sm:w-full border-b-5 dark:border-b-blue-500 border-b-yellow-500 bg-[var(--background-color)] shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out pb-0 h-full",
                        "transition-transform duration-200",
                        "group-hover:-translate-x-5",
                    )}
                    style={{ filter: hw.submitted ? "grayscale(100%)" : "none" }}
                    >
                        <CardHeader className="grid grid-cols-2">
                            <CardTitle className="text-2xl">{hw.title}</CardTitle>
                            <CardDescription className="text-right max-sm:col-span-2">
                                {hw.due_date && <p className="text-lg">Due: <span className={`text-2xl ${getDueDateColor(hw.due_date)}`}>{getFormattedDate(hw.due_date)}</span></p>}
                                {hw.created_at && <p className="text-lg">Opened: <span className="text-xl">{getFormattedDate(hw.created_at)}</span></p>}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-lg text-justify">{hw.description}</CardDescription>
                            {hw.submitted && <p className="text-center font-bold text-2xl">Submitted</p>}
                        </CardContent>
                        <CardFooter className="justify-center">
                            <a href={isTeacher ? `/teacher/homework/grade/${hw.id}` : `/homework/${hw.id}`}>
                                <Button className="text-xl cursor-pointer rounded-b-none dark:bg-blue-500 bg-yellow-500 shadow-none text-black hover:bg-opacity-0">Details</Button>
                            </a>
                        </CardFooter>
                    </Card>
                </div>
            ))}
        </div>
    )
}
