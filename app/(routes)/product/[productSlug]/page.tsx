import ProductDetail from "./product-detail";

export default async function Page({ 
  params 
}: { params: { productSlug: string } | Promise<{ productSlug: string }> }) {
  // Si params es una promesa, await lo resolverá; si no, devolverá el mismo objeto.
  const awaitedParams = await params;
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
