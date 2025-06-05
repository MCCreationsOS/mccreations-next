// import MultistepFormNavigation from "@/components/Form/MultistepForm/Navigation";
import styles from './create.module.css'
import CreateSteps from './createSteps'

export default function CreateLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col sm:flex-row gap-5 m-5">
            <CreateSteps/>
            <div className='w-full'>
                {children}
            </div>
        </div>
    )
}