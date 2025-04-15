"use client"

import { IContentDoc } from "@/app/api/types";
import { useEffect, useRef, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import Image from "next/image";
import { Download, Star } from "lucide-react";

export default function FeaturedSlideshow({creations}: {creations: IContentDoc[]}) {
    const [currentSlide, setCurrentSlide] = useState(0)
    const timer = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if(timer.current) {
            clearTimeout(timer.current)
        }
        timer.current = setTimeout(() => {
            setCurrentSlide((currentSlide + 1) % creations.length)
        }, 5000)
        return () => {
            if(timer.current) {
                clearTimeout(timer.current)
            }
        }
    }, [currentSlide])

    return (
        <div className="relative mx-10">
            <Carousel className="w-full max-w-[1000px] mx-auto">
                <CarouselContent>
                    {creations.map((creation) => (
                        <CarouselItem key={creation._id}>
                            <div className="group relative">
                                <Image src={creation.images[0]} alt={creation.title} width={1920} height={1080} className="w-full h-full object-cover aspect-video" />
                                <div className="md:absolute bottom-0 left-0 p-4 bg-black/50 text-white flex flex-col gap-2">
                                    <h3 className="text-xl md:text-2xl font-bold line-clamp-1">{creation.title}</h3>
                                    <p className="text-sm line-clamp-2">{creation.shortDescription}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm flex items-center gap-1"><Download className="w-5 h-5"/> {creation.downloads}</span>
                                        {creation.rating > 0 && <span className="text-sm flex items-center gap-1"><Star className="w-5 h-5"/> {creation.rating * 5}</span>}
                                    </div>
                                    <p className="text-sm">By {creation.creators.map((creator) => creator.username).join(", ")}</p>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}
