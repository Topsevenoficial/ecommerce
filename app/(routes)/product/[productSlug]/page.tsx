import ProductDetail from "./product-detail";
import { notFound } from "next/navigation";

interface PageParams {
  productSlug: string;
}

// Set specific cache tags for each product and enable static generation
export const generateMetadata = async ({ params }: { params: Promise<PageParams> }) => {
  const { productSlug } = await params;
  
  // Obtener los datos del producto
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined");
  }
  
  const url = `${baseUrl}/api/products?filters[slug][$eq]=${productSlug}&populate=*`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  
  if (!res.ok) {
    return {
      title: productSlug,
      description: 'Producto no encontrado',
    };
  }
  
  const data = await res.json();
  const product = data.data?.[0]?.attributes;
  
  if (!product) {
    return {
      title: productSlug,
      description: 'Producto no encontrado',
    };
  }
  
  // Obtener la URL de la imagen principal
  const imageUrl = product.imagenes?.data?.[0]?.attributes?.url 
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${product.imagenes.data[0].attributes.url}`
    : `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/default_product_image.jpg`;
  
  const productName = product.nombre || 'Producto sin nombre';
  const description = product.descripcion?.substring(0, 160) || 'Descripción no disponible';
  const price = product.precio ? `$${product.precio.toFixed(2)}` : 'Precio no disponible';
  
  return {
    title: productName,
    description: description,
    openGraph: {
      title: productName,
      description: description,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: productName,
        },
      ],
      type: 'website',
      siteName: 'Tu Tienda Online',
    },
    twitter: {
      card: 'summary_large_image',
      title: productName,
      description: description,
      images: [imageUrl],
    },
    other: {
      'og:price:amount': product.precio?.toString() || '',
      'og:price:currency': 'MXN',
      'cache-control': 'public, max-age=3600',
    },
  };
};

// Force static site generation for better caching
export const dynamic = "force-static";
// Set a long revalidation period - 1 day in seconds
export const revalidate = 86400;

export default async function Page({ params }: { params: Promise<PageParams> }) {
  // Esperamos los parámetros, ya que Next.js los provee de forma perezosa
  const { productSlug } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined");
  }
  const url = `${baseUrl}/api/products?filters[slug][$eq]=${productSlug}&populate=*`;

  try {
    // Use a more aggressive caching strategy
    const res = await fetch(url, { 
      cache: "force-cache", // Force caching even during development
      next: { 
        tags: [`product-${productSlug}`], // Tag-based invalidation
        revalidate: 3600 // Cache for 1 hour
      } 
    });
    
    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status}`);
    }
    
    const data = await res.json();
    const product = data.data && data.data.length > 0 ? data.data[0] : null;

    if (!product) {
      return notFound();
    }

    return <ProductDetail product={product} />;
  } catch (error) {
    console.error("Error fetching product:", error);
    
    // Try to access cached data as fallback
    // This ensures that even if the fetch fails, we'll still show cached content
    return (
      <div className="container mx-auto px-6 py-8">
        <ProductDetail product={null} fallbackSlug={productSlug} />
      </div>
    );
  }
}
