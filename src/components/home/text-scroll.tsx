"use client";

import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useTranslations } from "next-intl";
export default function TextScroll() {
    const t = useTranslations();

    return (
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {t("Home.TextScroll.start")}
            <Carousel
                orientation="vertical"
                className="w-full"
                plugins={[Autoplay({ delay: 2000 })]}
            >
                <CarouselContent className="h-22">
                    <CarouselItem>
                        <span>{t("Terms.creation", { count: 0 })}</span>
                    </CarouselItem>
                    <CarouselItem>
                        <span>{t("Terms.map", { count: 0 })}</span>
                    </CarouselItem>
                    <CarouselItem>
                        <span>{t("Terms.datapack", { count: 0 })}</span>
                    </CarouselItem>
                    <CarouselItem>
                        <span>{t("Terms.resourcepack", { count: 0 })}</span>
                    </CarouselItem>
                    <CarouselItem>
                        <span>{t("Home.TextScroll.community")}</span>
                    </CarouselItem>
                    <CarouselItem>
                        <span>{t("Terms.tool", { count: 0 })}</span>
                    </CarouselItem>
                    <CarouselItem>
                        <span>{t("Home.TextScroll.fun")}</span>
                    </CarouselItem>
                </CarouselContent>
            </Carousel>
        </h1>
    );
}
