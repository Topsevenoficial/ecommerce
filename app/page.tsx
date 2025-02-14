// D:/Proyecto Ecommerce NextJS/frontend-ecommerce/app/page.tsx
import CarouselTextBanner from "@/components/carousel-text-banner";
import ProductList from "@/components/productList";

export default function Home() {
  return (
    <main className="flex flex-col gap-8 pb-8">
      <CarouselTextBanner />
      <div className="container mx-auto px-6">
        <ProductList />
      </div>
    </main>
  );
}
