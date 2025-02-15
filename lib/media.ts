import { ImageType } from "../types/shared";

/**
 * Devuelve la URL completa de una imagen a partir del objeto ImageType o de un string.
 * Si la URL es relativa, se le añade NEXT_PUBLIC_BACKEND_URL sin doble slash.
 */
export function getStrapiMedia(media: ImageType | string): string {
  // Extraemos la URL desde el objeto o el string.
  const imageUrl = typeof media === "string" ? media : media.url;
  // Eliminamos espacios en blanco y saltos de línea.
  const trimmedUrl = imageUrl.trim().replace(/\s+/g, "");
  // Eliminamos cualquier barra inicial.
  const cleanedImageUrl = trimmedUrl.replace(/^\/+/, "");
  
  // Si la URL ya es absoluta (empieza con http:// o https://), se retorna tal cual.
  if (/^https?:\/\//i.test(cleanedImageUrl)) {
    return cleanedImageUrl;
  }
  
  // Si es relativa, se le añade la URL base.
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
  return `${backendUrl}/${cleanedImageUrl}`;
}
