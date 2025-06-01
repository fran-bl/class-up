"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Class } from "@/types/types"
import { Check, CircleAlert } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "./ui/button"

export default function AnimatedClassGrid({ classes, isTeacher }: { classes: Class[], isTeacher: boolean }) {
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
  }, [classes])

  return (
    <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4 place-items-stretch max-sm:px-4 px-15">
      {classes.map((c, index) => (
        <div
          key={c.id}
          ref={(el) => { cardRefs.current[index] = el }}
          className={cn(
            "transition-all duration-700 ease-out",
            "opacity-0 translate-y-8 scale-95",
            visibleCards.has(index) && "opacity-100 translate-y-0 scale-100",
            "group"
          )}
        >
          <Card className={cn(
              "border-b-5 dark:border-b-blue-500 border-b-yellow-500 bg-[var(--background-color)] shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out pb-0 h-full",
              "transition-transform duration-200",
              "group-hover:-translate-y-2",
            )}
          >
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-2xl">{c.name}</CardTitle>
              {c.active_assignments !== undefined && (
                c.active_assignments > 0 ? (
                  <CircleAlert className="text-red-500" />
                ) : (
                  <Check className="text-green-500" />
                )
              )}
            </CardHeader>
            <CardContent>
              <CardDescription className="text-lg">{c.description}</CardDescription>
            </CardContent>
            <CardFooter className="justify-center">
              <a href={isTeacher ? `/teacher/class/manage/${c.id}` : `/class/${c.id}`}>
                <Button className="text-xl cursor-pointer rounded-b-none dark:bg-blue-500 bg-yellow-500 shadow-none text-black hover:bg-opacity-0">
                  Details
                </Button>
              </a>
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  )
}
