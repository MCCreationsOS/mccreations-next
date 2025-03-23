import { Creation } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Star, Download } from "lucide-react";
import { OptimizedImage } from "../optimized-image";
import { Badge } from "../ui/badge";
import { Link } from "@/i18n/navigation";

export function CreationCard({creation}: {creation: Creation}) {
    return (
        <Link href={`/creations/${creation.slug}`}>
            <Card className="p-0 overflow-hidden border-none shadow transition-all duration-300 hover:shadow-md h-full group">
                <CardContent className="p-0">
                    <div className="relative aspect-video overflow-hidden">
                    <OptimizedImage
                        src={creation.images[0]}
                        alt={creation.title}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 right-0 p-2 flex gap-2">
                        <Badge variant="secondary" className="bg-primary-button text-white">
                            {creation.type}
                        </Badge>
                        <Badge variant="secondary" className="bg-secondary-button text-white">
                            {creation.files![0].minecraftVersion}
                        </Badge>
                    </div>
                </div>
                <div className="p-4">
                    <h3 className="font-semibold line-clamp-1 group-hover:text-primary">{creation.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {creation.shortDescription || creation.description.substring(0, 100)}
                    </p>
                    <div className="flex items-center justify-between mt-3 text-sm">
                        <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span>{creation.rating * 5}</span>
                        </div>
                        <div className="flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        <span>{creation.downloads.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                        By {creation.creators?.map((creator) => creator.username).join(", ")}
                    </div>
                </div>
            </CardContent>
        </Card>
    </Link>
    )
}
