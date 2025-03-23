"use client";

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Creation } from "@/lib/api";
import { OptimizedImage } from "../optimized-image";
import { Badge } from "../ui/badge";
import { Download, Star, User } from "lucide-react";
import { Button } from "../ui/button";

export function FeaturedSlideshow({creations}: {creations: Creation[]}) {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  return (
    <Carousel
      plugins={[plugin.current]}
      className="relative rounded-xl"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {creations.map((creation) => (
          <CarouselItem key={creation._id} className="w-full flex-shrink-0">
            <Card className="relative aspect-[21/9] rounded-xl overflow-hidden p-0">
              <CardContent className="p-0">
                <OptimizedImage
                  src={creation.images[0]}
                  alt={creation.title}
                  width={100}
                  height={100}
                  className="object-cover w-full h-full"
                  sizes="100vw"
                  quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="bg-primary-button">
                            {creation.type}
                        </Badge>
                        <Badge variant="secondary" className="bg-secondary-button">
                            {creation.files![0].minecraftVersion}
                        </Badge>
                        {creation.tags?.slice(0, 2).map((tag) => (
                            <Badge variant="outline" className="text-white" key={tag}>
                                {tag}
                            </Badge>
                        ))}
                    </div>
                  <h3 className="text-white text-2xl font-bold mb-2">{creation.title}</h3>
                  <p className="text-white text-sm mb-4">{creation.shortDescription}</p>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-white">{creation.rating * 5}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Download className="w-4 h-4 text-white" />
                        <span className="text-white">{creation.downloads}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-white">By {creation.creators?.map((creator) => creator.username).join(", ")}</span>
                    </div>
                  </div>
                <Button variant="secondary" className="bg-blue-600 hover:bg-blue-700">
                    <span className="text-white">View {creation.type}</span>
                </Button>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
