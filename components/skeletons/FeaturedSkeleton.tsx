import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { shimmer, toBase64 } from "./imageShimmer";
import styles from '@/components/old/FeaturedSlideshow/FeaturedSlideshow.module.css';
import { Button } from "../ui/button";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { Download, Star } from "lucide-react";
export default function FeaturedSkeleton() {
    return (
        <div className="relative mx-10">
            <Carousel className="w-full max-w-[1000px] mx-auto">
                <CarouselContent>
                        <CarouselItem>
                            <Link href={`/maps/test`}>
                                <div className="group relative">
                                    <Image src={`data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`} alt="Loading..." width={1920} height={1080} className="w-full h-full object-cover aspect-video" />
                                    <div className="md:absolute bottom-0 left-0 p-2 pb-7 bg-black/50 text-white flex flex-col gap-2">
                                        <h3 className="text-xl md:text-2xl font-bold line-clamp-1">Loading...</h3>
                                        <p className="text-sm line-clamp-2">Loading...</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm flex items-center gap-1"><Download className="w-5 h-5"/> 0</span>
                                            <span className="text-sm flex items-center gap-1"><Star className="w-5 h-5"/> 0</span>
                                        </div>
                                        <p className="text-sm">By Loading...</p>
                                    </div>
                                </div>
                            </Link>
                        </CarouselItem>
                </CarouselContent>
            </Carousel>
        </div>
    )
}
