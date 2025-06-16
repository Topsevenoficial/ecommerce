/** @type {import('next').NextConfig} */
const nextConfig = {
  // Aumentar el tiempo de espera estático (en segundos)
  staticPageGenerationTimeout: 120, // 2 minutos
  
  // Configuración de imágenes
  images: {
    domains: ['localhost', 'res.cloudinary.com'], // Asegúrate de incluir tus dominios de imagen
  },
  
  // Configuración de redirecciones y reescrituras si es necesario
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'}/api/:path*`,
      },
    ];
  },
  
  // Configuración de cabeceras para respuestas de API
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
  
  // Configuración de webpack para manejar mejor los paquetes grandes
  webpack: (config, { isServer }) => {
    // Aumentar el límite de advertencia de tamaño del paquete
    if (!isServer) {
      config.performance = {
        ...config.performance,
        maxAssetSize: 500000, // 500KB
        maxEntrypointSize: 500000, // 500KB
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;
