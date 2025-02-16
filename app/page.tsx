// D:/Proyecto Ecommerce NextJS/frontend-ecommerce/app/page.tsx
import CarouselTextBanner from "@/components/carousel-text-banner";
import ProductList from "@/components/productList";

async function getProducts() {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
  const url = `${baseUrl}/api/products?filters[active][$eq]=true&populate=*`;
  const res = await fetch(url, { next: { revalidate: 60 } }); // Cachea la respuesta por 60 segundos
  const data = await res.json();
  return data.data;
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="flex flex-col gap-8 pb-8">
      <CarouselTextBanner />
      <div className="container mx-auto px-6">
        <ProductList products={products} />
      </div>
    </main>
  );
}
