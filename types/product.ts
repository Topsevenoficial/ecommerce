import { ImageType } from "./shared";
import { CategoryType } from "./category";
import { ReviewType } from "./review";

export interface ProductType {
  id: number;
  // Aquí ya NO usamos `attributes`, sino que
  // declaramos los campos a nivel raíz, tal como viene en el JSON.
  productName: string;
  slug: string;
  description?: string;
  // En tu JSON, "images" es un array directo:
  images?: ImageType[];
  active?: boolean;
  price: number;
  materialMontura?: "TR90" | "Aluminio";
  materialLente?: "Policarbonato" | "TAC";
  isFeatured?: boolean;
  // "category" también es un objeto simple a nivel JSON
  category?: CategoryType | null;
  discount?: number;
  offerType?: "nada" | "oferta" | "recién llegado" | "combo" | "temporada";
  polarizado?: boolean;
  UV400?: boolean;
  marca?: "KingSeven" | "Dubery";
  // Aquí reviews es un array directo, no un objeto con data
  reviews?: ReviewType[];
  medidas?: string;
  visionHD?: boolean;
  antiImpacto?: boolean;
  barreraDeslumbramiento?: boolean;
  limpiaFacil?: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
}
