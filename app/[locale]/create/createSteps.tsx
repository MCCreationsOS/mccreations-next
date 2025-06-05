"use client"

import { Link, usePathname } from "@/app/api/navigation"
import { Button } from "@/components/ui/button"

const steps = [
    {
        title: "Basic Information",
        description: "Fill in the basic information about your project.",
        href: "/create/basic_info"
    },
    {
        title: "Project Details",
        description: "Fill in the details about your project.",
        href: "/create/details"
    },
    {
        title: "Files",
        description: "Upload the files for your project.",
        href: "/create/files"
    },
    {
        title: "Images",
        description: "Upload the images for your project.",
        href: "/create/images"
    }
]

export default function CreateSteps() {
    const pathname = usePathname()
    const currentStep = steps.findIndex((step) => step.href === pathname)
    return (
        <div className="flex flex-row sm:flex-col gap-3 sm:gap-1 min-w-[200px]">
            {steps.map((step, index) => (
                <>
                <div className="flex flex-row gap-2 items-center">
                    <Link href={step.href}>
                        <Button variant={`${index === currentStep ? "default" : "secondary"}`} className="w-10 h-10 sm:w-5 sm:h-5">
                            <p className="text-sm">{index + 1}</p>
                        </Button>
                    </Link>
                    <h2 className="text-md font-semibold hidden sm:block">{step.title}</h2>
                </div>
                {index !== steps.length - 1 && <div className="w-[3px] h-10 bg-secondary ml-4 hidden sm:block"/>}
                </>
            ))}
        </div>
    )
}