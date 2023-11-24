import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isImageExt(filename: string): boolean {
  const imgExts = ["jpg", "jpeg", "png", "gif", "webp", "svg", "ico"]

  const lowerCaseFilename = filename.toLowerCase()

  return imgExts.some((ext) => lowerCaseFilename.endsWith(ext))
}
