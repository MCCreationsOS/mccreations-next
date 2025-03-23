"use client"

import Image from "next/image"
import { useState, useEffect } from "react"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
  className?: string
  sizes?: string
  quality?: number
  placeholder?: "blur" | "empty"
  blurDataURL?: string
  onLoad?: () => void
  onError?: () => void
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  className = "",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  quality = 75,
  placeholder = "empty",
  blurDataURL,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [imageSrc, setImageSrc] = useState(src)

  // Generate a tiny blur placeholder if not provided
  const defaultBlurDataURL =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg=="

  // Handle image load
  const handleLoad = () => {
    setLoading(false)
    if (onLoad) onLoad()
  }

  // Handle image error
  const handleError = () => {
    setError(true)
    setImageSrc("/placeholder.svg")
    if (onError) onError()
  }

  // Add intersection observer for lazy loading
  useEffect(() => {
    if (priority) return // Skip if priority is true

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Image is in viewport, load it
            setImageSrc(src)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: "200px", // Start loading when image is 200px from viewport
        threshold: 0.01,
      },
    )

    const currentElement = document.getElementById(`image-${alt.replace(/\s+/g, "-").toLowerCase()}`)
    if (currentElement) {
      observer.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement)
      }
      observer.disconnect()
    }
  }, [src, alt, priority])

  return (
    <div
      className={`relative ${className} ${loading ? "bg-gray-100 animate-pulse" : ""}`}
      id={`image-${alt.replace(/\s+/g, "-").toLowerCase()}`}
      style={fill ? { width: "100%", height: "100%" } : {}}
    >
      <Image
        src={imageSrc || "/placeholder.svg"}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        sizes={sizes}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL || defaultBlurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        className={`${className} ${loading ? "opacity-0" : "opacity-100 transition-opacity duration-300"}`}
        loading={priority ? "eager" : "lazy"}
      />
    </div>
  )
}

