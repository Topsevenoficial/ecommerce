/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Activar modo estricto de React para detectar posibles problemas
  images: {
    domains: ["localhost"], // Permitir cargar imágenes desde 'localhost'
    // Si en producción usas otro dominio, agrégalo aquí, por ejemplo:
    // domains: ['localhost', 'tu-dominio-en-produccion.com'],
  },
  // Opcional: Configuraciones adicionales según tus necesidades
  // webpack: (config) => {
  //   // Personaliza la configuración de Webpack aquí si es necesario
  //   return config;
  // },
  // env: {
  //   CUSTOM_VARIABLE: process.env.CUSTOM_VARIABLE, // Variables de entorno adicionales
  // },
};

export default nextConfig;
