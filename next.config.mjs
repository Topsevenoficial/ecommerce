/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Activar modo estricto de React para detectar posibles problemas
  images: {
    // Usamos remotePatterns para permitir imágenes desde rutas específicas
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**", // Permite todas las imágenes en la carpeta uploads de tu backend
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", // Permite imágenes desde Cloudinary
      },
    ],
  },
  // Otras configuraciones adicionales si las necesitas:
  // webpack: (config) => {
  //   // Personaliza la configuración de Webpack aquí si es necesario
  //   return config;
  // },
  // env: {
  //   CUSTOM_VARIABLE: process.env.CUSTOM_VARIABLE, // Variables de entorno adicionales
  // },
};

export default nextConfig;
