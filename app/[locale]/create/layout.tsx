import MultistepFormNavigation from "@/components/Form/MultistepForm/Navigation";
import styles from './create.module.css'

export default function CreateLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={styles.createForm}>
            <MultistepFormNavigation steps={[
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
            ]} key="create" />
            <div>
                {children}
            </div>
        </div>
    )
}