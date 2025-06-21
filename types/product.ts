// frontend-ecommerce/types/product.ts

import { ImageType } from "./shared";
import { CategoryType } from "./category";
import { ReviewType } from "./review";

/** Variantes (suponiendo que existan en tu JSON) */
export interface ProductVariantType {
  id: number;
  colorMontura?: string;
  colorLente?: string;
  onSale?: boolean;
  images?: ImageType[];
  // Otros campos de la variante...
}

/** Producto base (SIN TOCAR: id = number) */
export interface ProductType {
  id: number;
  productName: string;
  slug: string;
  description?: string;
  images?: ImageType[];
  active?: boolean;
  price: number;
  materialMontura?: "TR90" | "Aluminio";
  materialLente?: "Policarbonato" | "TAC";
  isFeatured?: boolean;
  category?: CategoryType | null;
  discount?: number;
  offerType?: "nada" | "oferta" | "recién llegado" | "combo" | "temporada";
  polarizado?: boolean;
  UV400?: boolean;
  marca?: "KingSeven" | "Dubery";
  reviews?: ReviewType[];
  medidas?: string;
  visionHD?: boolean;
  antiImpacto?: boolean;
  barreraDeslumbramiento?: boolean;
  limpiaFacil?: boolean;
  stock?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;

  // Opcionalmente, si el backend lo incluye:
  product_variants?: ProductVariantType[];
  isNew?: boolean;
}

/**
 * Tipo “aplanado” que extiende el producto original,
 * pero agrega un `combinedId` (string) y otros campos específicos de la variante
 */
export interface FlattenedProductType extends ProductType {
  // ID para React (combinando product + variant)
  combinedId: string;
  // Campos que vienen de la variante, si existe
  variantId?: number;
  onSale?: boolean;
  // isNew lo heredas de ProductType si ya lo tenías,
  // o puedes sobrescribir si deseas
}
