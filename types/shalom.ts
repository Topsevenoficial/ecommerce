// types/shalom.ts

/**
 * Representa un registro del Collection Type "Shalom" en Strapi.
 */
export interface Shalom {
  id: string;
  nombre: string;
  ubicacion: string;
  direccion: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
}
