import ProductDetail from "./product-detail";

interface PageParams {
  productSlug: string;
}

export default async function Page({ params }: { params: Promise<PageParams> }) {
  // Esperamos los parámetros, ya que Next.js los provee de forma perezosa
  const { productSlug } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined");
  }
  const url = `${baseUrl}/api/products?filters[slug][$eq]=${productSlug}&populate=*`;

  // Se cachea la respuesta durante 60 segundos
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error(`Error HTTP: ${res.status}`);
  }
  const data = await res.json();
  const product = data.data && data.data.length > 0 ? data.data[0] : null;

  if (!product) {
    return (
      <div className="container px-6 py-4 mx-auto text-center">
        <p>Producto no encontrado.</p>
      </div>
    );
  }

  return <ProductDetail product={product} />;
}
