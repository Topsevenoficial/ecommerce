import ProductDetail from "./product-detail";
import { notFound } from "next/navigation";

interface PageParams {
  productSlug: string;
}

// Set specific cache tags for each product and enable static generation
export const generateMetadata = async ({ params }: { params: Promise<PageParams> }) => {
  const { productSlug } = await params;
  return {
    title: `Product: ${productSlug}`,
    other: {
      "cache-control": "public, max-age=31536000, immutable",
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
