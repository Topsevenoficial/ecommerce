// InfoAdicional.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { ProductType } from "@/types/product";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface InfoAdicionalProps {
  product: ProductType;
}

function Breadcrumb({ product }: { product: ProductType }) {
  const productName = product.productName || "Producto";
  return (
    <nav className="mb-6 flex justify-center" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center justify-center gap-2 text-sm">
        <li>
          <a href="/" className="text-muted-foreground hover:text-foreground">
            Inicio
          </a>
        </li>
        <li className="text-muted-foreground/50">/</li>
        <li>
          <a
            href="/product"
            className="text-muted-foreground hover:text-foreground"
          >
            Productos
          </a>
        </li>
        <li className="text-muted-foreground/50">/</li>
        <li aria-current="page" className="text-foreground font-semibold">
          {productName.length > 20
            ? `${productName.slice(0, 20)}...`
            : productName}
        </li>
      </ol>
    </nav>
  );
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          fill={i < rating ? "currentColor" : "none"}
          className={`h-4 w-4 ${i < rating ? "text-yellow-500" : "text-muted"}`}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
};

const StarRatingSelector = ({
  rating,
  setRating,
}: {
  rating: number;
  setRating: (value: number) => void;
}) => {
  const [hover, setHover] = useState<number>(0);

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="focus:outline-none transition-colors"
          aria-label={`${star} Star`}
        >
          <Star
            className={`h-5 w-5 ${
              star <= (hover || rating) ? "text-yellow-500" : "text-muted"
            }`}
            fill={star <= (hover || rating) ? "currentColor" : "none"}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
};

function AddReviewForm({
  productId,
  onReviewAdded,
}: {
  productId: number;
  onReviewAdded: (newReview: any) => void;
}) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Por favor, completa este campo.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError(
        "Por favor, ingresa un correo electrónico válido. El dominio después del punto debe contener solo letras (ejemplo: .com, .org)"
      );
      return;
    }

    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews`;
      const payload = {
        data: {
          email,
          rating,
          description,
          product: productId,
        },
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data?.error?.message || `Error: ${response.status}`;
        throw new Error(errorMessage);
      }

      const newReview = data.data;

      toast({
        title: "✅ Reseña enviada",
        description: "Tu opinión ha sido publicada correctamente",
      });

      onReviewAdded({
        ...newReview,
        id: newReview?.id || Date.now(),
      });

      setEmail("");
      setRating(5);
      setDescription("");
      setError("");
    } catch (err: any) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "❌ Error",
        description: err.message || "Ocurrió un problema al enviar la reseña",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-card rounded-lg shadow-sm border p-4 sm:p-6"
    >
      <div className="space-y-5">
        <h3 className="font-semibold text-lg border-b pb-3">
          Dejar una reseña
        </h3>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div>
          <label className="block mb-2 text-sm font-medium">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            className="bg-muted/50 focus:bg-background"
            placeholder="tucorreo@ejemplo.com"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Valoración</label>
          <StarRatingSelector rating={rating} setRating={setRating} />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Comentario</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="bg-muted/50 focus:bg-background"
            placeholder="Escribe tu experiencia con el producto..."
          />
        </div>

        <Button type="submit" className="w-full">
          Enviar Reseña
        </Button>
      </div>
    </form>
  );
}

function ReviewsList({ reviews }: { reviews: ProductType["reviews"] }) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const prevReviewsLength = useRef(reviews?.length || 0);

  useEffect(() => {
    const currentLength = reviews?.length || 0;
    if (currentLength > prevReviewsLength.current && scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: 0, behavior: "smooth" });
      prevReviewsLength.current = currentLength;
    }
  }, [reviews]);

  const totalReviews = reviews?.length || 0;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews
      : 0;

  return (
    <>
      <div className="mb-6">
        {totalReviews > 0 ? (
          <div className="flex items-center gap-2">
            <StarRating rating={Math.round(averageRating)} />
            <span className="text-sm text-muted-foreground">
              {averageRating.toFixed(1)} de 5 ({totalReviews} reseña
              {totalReviews !== 1 ? "s" : ""})
            </span>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No hay reseñas aún</p>
        )}
      </div>

      <ScrollArea ref={scrollAreaRef} className="h-[300px] sm:h-80">
        <div className="space-y-4 pr-3">
          {reviews && reviews.length > 0
            ? reviews.map((review) => (
                <div
                  key={review.id}
                  id={`review-${review.id}`}
                  className="flex items-start gap-4 p-4 rounded-lg border bg-card shadow-sm hover:shadow-md transition-all"
                >
                  <Avatar className="mt-1 flex-shrink-0">
                    <AvatarFallback className="bg-muted">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium text-foreground truncate">
                          {review.email}
                        </p>
                        <time className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString(
                            "es-ES",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </time>
                      </div>
                      <StarRating rating={review.rating} />
                    </div>
                    {review.description && (
                      <p className="text-sm text-foreground leading-relaxed mt-2 break-words">
                        {review.description}
                      </p>
                    )}
                  </div>
                </div>
              ))
            : null}
        </div>
      </ScrollArea>
    </>
  );
}

export default function InfoAdicional({ product }: InfoAdicionalProps) {
  const [reviews, setReviews] = useState(product.reviews || []);

  const handleNewReview = (newReview: any) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  if (!product) return null;

  const { description } = product;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumb product={product} />

      <Tabs defaultValue="description" className="w-full">
        <TabsList className="flex flex-nowrap sm:justify-center w-full overflow-x-auto">
          <TabsTrigger value="description" className="flex-shrink-0">
            Descripción
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex-shrink-0">
            Reseñas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="pt-4 text-center">
          {description ? (
            <div className="text-sm leading-relaxed max-w-2xl mx-auto px-4">
              {description}
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              No hay descripción para este producto.
            </p>
          )}
        </TabsContent>

        <TabsContent value="reviews" className="pt-4">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-[60%]">
              <ReviewsList reviews={reviews} />
            </div>

            <div className="w-full lg:w-[40%]">
              <AddReviewForm
                productId={product.id}
                onReviewAdded={handleNewReview}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
