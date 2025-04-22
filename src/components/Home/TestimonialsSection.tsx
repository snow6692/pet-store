"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect } from "react";
import { useGetTopRatings } from "@/hooks/useGetTopRatings";

interface Rating {
  id: string;
  comment: string | null;
  rating: number;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export default function TestimonialsSection() {
  const { data: ratings, isLoading, error } = useGetTopRatings();

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      slidesToScroll: 1,
    },
    [Autoplay({ delay: 3000 })] // Autoplay with 3-second delay
  );

  // Rerender carousel when ratings change
  useEffect(() => {
    if (emblaApi && ratings) {
      emblaApi.reInit();
    }
  }, [emblaApi, ratings]);

  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-lg text-muted-foreground"
        >
          Loading testimonials...
        </motion.p>
      </div>
    );
  }

  if (error || !ratings || ratings.length === 0) {
    return (
      <div className="py-16 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-lg text-muted-foreground"
        >
          No testimonials available at the moment.
        </motion.p>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-muted/20 to-muted/10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Voices of Our Customers
          </h2>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the experiences and stories shared by our valued customers.
          </p>
        </motion.div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {ratings.map((rating: Rating, index: number) => (
              <div
                key={rating.id}
                className="flex-[0_0_100%] min-w-0 px-4 md:flex-[0_0_50%] lg:flex-[0_0_33.33%]"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.3,
                    ease: "easeOut",
                  }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                >
                  <Card className="h-full relative overflow-hidden border border-muted/30 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-background/95 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <motion.div
                        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: index * 0.3 }}
                      />
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                          <AvatarImage
                            src={rating.user.image || undefined}
                            alt={rating.user.name || "User"}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {rating.user.name?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-lg">
                            {rating.user.name || "Anonymous"}
                          </p>
                          <div className="flex gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  duration: 0.3,
                                  delay: index * 0.3 + i * 0.1,
                                }}
                              >
                                <Star
                                  className={`h-4 w-4 ${
                                    i < Math.floor(rating.rating)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-muted-foreground/50"
                                  }`}
                                />
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <motion.p
                        className="text-muted-foreground leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.3 + 0.2 }}
                      >
                        {rating.comment || "No comment provided."}
                      </motion.p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
