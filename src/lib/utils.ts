import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildQueryString(params: Record<string, any>): string {
  const query = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}=${value.join(",")}`
      }
      return `${key}=${encodeURIComponent(value)}`
    })
    .join("&")

  return query ? `?${query}` : ""
}

export async function fetcher(url: string, method: string, body?: any, headers?: Record<string, string>) {
  const fetchHeaders = new Headers(headers)
  fetchHeaders.set("Content-Type", "application/json")
  const response = await fetch(url, { method, body: (body ? JSON.stringify(body) : undefined), headers: fetchHeaders })

  if (!response.ok) {
    const error = new Error("Failed to fetch", { cause: response })
    throw error
  }

  return response.json()
}