// frontend-ecommerce/types/user.ts
import { ReviewType } from "./review";

export interface UserType {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  role: {
    id: number;
    name: string;
    type: string;
    description: string;
  };
  reviews?: ReviewType[]; 
  // Campos base de Strapi
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}
