// frontend-ecommerce/types/review.ts

import { ImageType } from "./shared";
import { UserType } from "./user";
import { ProductType } from "./product";

/**
 * Basado en:
 * D:\Proyecto Ecommerce NextJS\backend-ecommerce\src\api\review\content-types\review\schema.json
 */
export interface ReviewType {
  id: number;
  rating: number; // "integer", 1..5
  email: string; // "email" (required)
  description?: string; // "text" (opcional)
  image?: ImageType[]; // "media" (multiple) (opcional)
  // Relación con el usuario de Strapi
  users_permissions_user?: UserType | null;
  // Relación manyToOne con el producto
  product?: {
    data: {
      id: number;
      attributes: ProductType;
    };
  } | null;
  // Campos base de Strapi
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}
