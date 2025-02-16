import ProductDetail from "./product-detail";

interface PageParams {
  productSlug: string;
}

export default async function Page({ params }: { params: unknown }) {
  // Convertimos 'params' a nuestro tipo esperado
  const awaitedParams = (await params) as PageParams;
  const { productSlug } = awaitedParams;

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
  const url = `${baseUrl}/api/products?filters[slug][$eq]=${productSlug}&populate=*`;

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
