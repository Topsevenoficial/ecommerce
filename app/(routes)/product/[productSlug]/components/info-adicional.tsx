"use client";

import React, { useState, useEffect, useRef } from "react";
import { ProductType } from "@/types/product";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, User, MessageSquare, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Usamos NonNullable para asegurarnos que reviews es un array
type Review = NonNullable<ProductType["reviews"]>[number];

interface InfoAdicionalProps {
  product: ProductType;
}

// Componente Breadcrumb comentado temporalmente
/*
function Breadcrumb({ product }: { product: ProductType }) {
  const name = product.nombre || "Producto";
  return (
    <nav className="mb-8" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-sm text-muted-foreground">
        <li>
          <a href="/" className="hover:text-foreground transition-colors">
            Inicio
          </a>
        </li>
        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
        <li>
          <a href="/product" className="hover:text-foreground transition-colors">
            Productos
          </a>
        </li>
        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
        <li className="font-medium text-foreground line-clamp-1">
          {name}
        </li>
      </ol>
    </nav>
  );
}
*/

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          fill={star <= rating ? "currentColor" : "none"}
          className={`h-4 w-4 ${star <= rating ? "text-yellow-500" : "text-muted-foreground/30"}`}
          strokeWidth={star <= rating ? 0 : 1.5}
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
            className={`h-5 w-5 ${star <= (hover || rating) ? "text-yellow-500" : "text-muted"}`}
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
  onReviewAdded: (newReview: Review) => void;
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
        const errorMessage = data?.error?.message || `Error: ${response.status}`;
        throw new Error(errorMessage);
      }
      const newReview: Review = data.data;
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
    } catch (err: unknown) {
      let errorMsg = "Ocurrió un problema al enviar la reseña";
      if (err instanceof Error) {
        errorMsg = err.message;
      }
      console.error(err);
      toast({
        variant: "destructive",
        title: "❌ Error",
        description: errorMsg,
      });
    }
  };

  return (
    <Card className="border-none bg-muted/10 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-semibold">Dejar una reseña</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {error && (
            <Alert variant="destructive" className="text-sm">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="email" className="text-sm font-medium">
                Correo electrónico
              </label>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Lock className="h-3 w-3" /> No se mostrará en tu reseña
              </span>
            </div>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="tu@email.com"
              required
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Valoración</label>
            <div className="p-2 bg-muted/30 rounded-md">
              <StarRatingSelector rating={rating} setRating={setRating} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Comentario</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="bg-background min-h-[100px]"
              placeholder="Escribe tu experiencia con el producto..."
            />
          </div>
          <Button type="submit" className="w-full font-medium">
            Enviar Reseña
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ReviewsList({ reviews }: { reviews: Review[] }) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const prevReviewsLength = useRef(reviews?.length || 0);
  
  // Function to censor email for display
  const censorEmail = (email: string) => {
    const [username, domain] = email.split('@');
    const censoredUsername = username.length > 2 
      ? username[0] + '*'.repeat(3) + (username.length > 3 ? username.slice(-1) : '')
      : '*'.repeat(3);
    return `${censoredUsername}@${domain}`;
  };

  useEffect(() => {
    const currentLength = reviews?.length || 0;
    if (currentLength > prevReviewsLength.current && scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: 0, behavior: "smooth" });
      prevReviewsLength.current = currentLength;
    }
  }, [reviews]);

  const totalReviews = reviews?.length || 0;
  const averageRating =
    totalReviews > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews : 0;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">Opiniones de clientes</h3>
          {totalReviews > 0 && (
            <Badge variant="outline" className="text-sm font-normal">
              {totalReviews} {totalReviews === 1 ? 'reseña' : 'reseñas'}
            </Badge>
          )}
        </div>
        {totalReviews > 0 && (
          <div className="flex items-center gap-2">
            <StarRating rating={Math.round(averageRating)} />
            <span className="text-sm font-medium">
              {averageRating.toFixed(1)}/5
            </span>
          </div>
        )}
      </div>
      
      <div className="lg:h-[400px] lg:pr-3">
        <div className="space-y-4">
          {reviews && reviews.length > 0 ? (
            reviews.map((review) => (
              <Card key={review.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10 border">
                      <AvatarFallback className="bg-muted">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">
                              {censorEmail(review.email)}
                            </p>
                            <span className="text-xs text-muted-foreground" title="Correo protegido">
                              <Lock className="h-3 w-3" />
                            </span>
                          </div>
                          <time className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </time>
                        </div>
                        <div className="flex-shrink-0">
                          <StarRating rating={review.rating} />
                        </div>
                      </div>
                      {review.description && (
                        <p className="mt-3 text-sm text-foreground leading-relaxed">
                          {review.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 border rounded-lg bg-muted/20">
              <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">No hay reseñas aún</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Sé el primero en opinar sobre este producto</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function InfoAdicional({ product }: InfoAdicionalProps) {
  const [reviews, setReviews] = useState<Review[]>(product.reviews || []);
  const reviewsSectionRef = useRef<HTMLElement>(null);

  const handleNewReview = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  // Efecto para manejar el scroll a la sección de reseñas
  useEffect(() => {
    const scrollToReviews = () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('scroll') === 'reviews' && reviewsSectionRef.current) {
        // Calcular la posición de desplazamiento con un offset para el encabezado fijo
        const headerOffset = 100; // Ajusta este valor según la altura de tu encabezado
        const elementPosition = reviewsSectionRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Limpiar el parámetro de la URL sin recargar la página
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('scroll');
        window.history.replaceState({}, '', newUrl.toString());
      }
    };

    // Pequeño retraso para asegurar que el DOM esté listo
    const timer = setTimeout(scrollToReviews, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!product) return null;

  return (
    <section ref={reviewsSectionRef} id="reviews-section" className="py-8 sm:py-12 bg-background border-t">
      <div className="container max-w-4xl px-4 mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Opiniones de clientes
          </h2>
          <p className="mt-2 text-muted-foreground">
            Lo que dicen nuestros clientes sobre este producto
          </p>
          
          {reviews.length > 0 && (
            <div className="mt-4 flex justify-center items-center gap-2">
              <StarRating rating={Math.round(
                reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
              )} />
              <span className="font-medium text-foreground">
                {reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'}
              </span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ReviewsList reviews={reviews} />
          </div>
          <div className="lg:sticky lg:top-6 lg:h-fit">
            <AddReviewForm productId={product.id} onReviewAdded={handleNewReview} />
          </div>
        </div>
      </div>
    </section>
  );
}
