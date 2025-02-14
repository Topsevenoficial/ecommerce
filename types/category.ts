// frontend-ecommerce/types/category.ts

import { ImageType } from "./shared";

/**
 * Basado en:
 * D:\Proyecto Ecommerce NextJS\backend-ecommerce\src\api\category\content-types\category\schema.json
 */
export interface CategoryType {
  id: number;
  categoryName: string; // "string"
  slug: string; // "uid"
  mainImage?: ImageType | null; // "media" (single)
  // Relación uno-a-muchos con la misma tabla (subcategorías).
  categories?: CategoryType[];
  // Campos base de Strapi
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}
