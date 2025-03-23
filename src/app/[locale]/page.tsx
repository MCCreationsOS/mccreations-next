import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Upload } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import TextScroll from "@/components/home/text-scroll";
import { FeaturedSlideshow } from "@/components/home/featured-slideshow";
import { searchCreations } from "@/lib/fetchers";
import { Suspense } from "react";
import { CreationCard } from "@/components/creations/creation-card";
export default async function Home({params}: {params: {locale: string}}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  return (
    <main className="flex min-h-screen flex-col">
      <section className="relative bg-gradient-to-b from-blue-800 to-blue-900 py-20 px-4 md:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[url('/placeholder.svg?height=500&width=1000')] bg-repeat"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <TextScroll />
          <p className="text-xl text-foreground mb-8 max-w-3xl mx-auto">
            Browse hundreds of community creations or share your own with the world
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary-button hover:bg-primary-button/90 text-white">
              <Link href="/creations">Browse Creations</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-foreground">
              <Link href="/create" className="text-foreground">
                <Upload className="mr-2 h-5 w-5" />
                {t("Terms.create")}
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-primary">
              {t("Home.featured_title")}
            </h2>
            <Button asChild variant="ghost" className="text-primary/90">
              <Link href="/creations?status=3">
                {t("Home.featured_button")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <FeaturedWrapper />
          </Suspense>
        </div>
      </section>
      <section className="py-12 px-4 md:px-6 lg:px-8 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-8">
            {t("Home.latest_title")}
          </h2>
          <Suspense fallback={<div>Loading...</div>}>
            <LatestWrapper />
          </Suspense>
        </div>
      </section>
    </main>
  );
}

async function FeaturedWrapper() {
  const {documents} = await searchCreations("", {
    status: 3,
    limit: 5,
    page: 0
  })
  return (
      <FeaturedSlideshow creations={documents} />
  )
}

async function LatestWrapper() {
  const {documents} = await searchCreations("", {
    status: 2,
    limit: 8,
    page: 0
  })
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {documents.map((creation) => (
        <CreationCard key={creation._id} creation={creation} />
      ))}
    </div>
  )
}