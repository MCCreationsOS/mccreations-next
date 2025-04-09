"use client"

import { Link } from "@/app/api/navigation";
import styles from "./Navigation.module.css";
import { usePathname } from "next/navigation";
export interface MultistepFormNavigationProps {
    steps: {
        title: string;
        description: string;
        href: string;
    }[];
}

export default function MultistepFormNavigation({ steps }: MultistepFormNavigationProps) {
    const pathname = usePathname()
    let currentStep = steps.findIndex(step => pathname.includes(step.href))
    if (currentStep === -1) currentStep = 0

    return (
        <div className={styles.navigation}>
            {steps.map((step, index) => (
                <>
                    <Link href={step.href} key={step.title + index} className={`${styles.navigationItem} ${styles.navigationLink}`}>
                        <div className={`${styles.navigationItemNumber} ${currentStep === index ? styles.navigationItemNumberActive : ""}`}>
                            {index + 1}
                        </div>
                        <div className={`${styles.navigationItemContent} ${currentStep === index ? styles.navigationItemContentActive : ""}`}>
                            <h3 className={`${styles.navigationItemTitle} ${currentStep === index ? styles.navigationItemTitleActive : ""}`}>{step.title}</h3>
                            {/* <p className={`${styles.navigationItemDescription} ${currentStep === index ? styles.navigationItemDescriptionActive : ""}`}>{step.description}</p> */}
                        </div>
                    </Link>
                    {index < steps.length - 1 && (
                        <div className={`${styles.navigationSeparator} ${currentStep > index ? styles.navigationSeparatorActive : ""}`} />
                    )}
                </>
            ))}
        </div>
    )
}