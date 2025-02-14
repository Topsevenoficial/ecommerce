// frontend-ecommerce/types/response.ts

/**
 * Representa la estructura de una respuesta de la API de Strapi.
 */
export interface StrapiResponse<T> {
  data: T[];
  meta?: any; // Puedes detallar esto según tus necesidades
}
