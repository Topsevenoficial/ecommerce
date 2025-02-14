// D:\Proyecto Ecommerce NextJS\frontend-ecommerce\types\response.ts

/**
 * Representa una imagen o archivo multimedia en Strapi.
 * (Campos típicos, ajustados para Strapi 4)
 */
export interface ImageType {
  id: number;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  formats: {
    thumbnail?: ImageFormat;
    small?: ImageFormat;
    medium?: ImageFormat;
    large?: ImageFormat;
  } | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: Record<string, any> | null;
  folderPath: string;
  // Campos base de Strapi
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

/**
 * Formatos posibles de una imagen en Strapi.
 */
interface ImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
}
