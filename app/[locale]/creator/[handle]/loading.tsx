import styles from './CreatorPage.module.css'
import Image from "next/image"
import Menu from '@/components/Menu/Navbar'
import { shimmer, toBase64 } from '@/components/skeletons/imageShimmer'

export default function ProfileLoading() {
    return (
        <div className="animate-pulse">
        <div className="relative w-full h-48 bg-gray-200 rounded-lg mb-16"></div>
        <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
            <div className="bg-card rounded-lg shadow p-6 space-y-6">
                <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gray-200 mb-4"></div>
                <div className="h-7 w-40 bg-gray-200 rounded mb-2"></div>
                <div className="h-5 w-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 w-full bg-gray-200 rounded mb-4"></div>
                <div className="flex space-x-2 mb-4">
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                </div>
                </div>
                <div className="space-y-4">
                <div className="h-5 w-full bg-gray-200 rounded"></div>
                <div className="h-5 w-full bg-gray-200 rounded"></div>
                <div className="h-5 w-full bg-gray-200 rounded"></div>
                </div>
            </div>
            </div>
            <div className="md:w-2/3">
            <div className="h-10 w-full bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
                ))}
            </div>
            </div>
        </div>
        </div>
    )
}