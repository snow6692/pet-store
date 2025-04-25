"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { ProductWithCategories } from "@/lib/types/product.types";

type FeaturedProductsSliderProps = {
  products: ProductWithCategories[];
};

export default function FeaturedProductsSlider({
  products,
}: FeaturedProductsSliderProps) {
  const autoplay = useRef(Autoplay({ delay: 2000 }));
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, slidesToScroll: 1, align: "start" },
    [autoplay.current]
  );
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;
    const updateControls = () => {
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    emblaApi.on("select", updateControls);
    emblaApi.on("reInit", updateControls);
    updateControls();
    return () => {
      emblaApi.off("select", updateControls);
      emblaApi.off("reInit", updateControls);
    };
  }, [emblaApi]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, duration: 0.5 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.section
      className="py-16 bg-muted/10"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h3
          className="text-3xl font-bold text-foreground mb-8 text-center"
          variants={itemVariants}
        >
          Featured Products
        </motion.h3>
        {products.length > 0 ? (
          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] px-2"
                    whileHover={{
                      scale: 1.03,
                      transition: { duration: 0.3 },
                    }}
                  >
                    <Link
                      href={`/products/product/${product.slug}`}
                      className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="relative">
                        <Image
                          src={product.images[0] || "/default-product.png"}
                          alt={product.name}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover"
                          priority={products.indexOf(product) < 3}
                        />
                        {product.discount && (
                          <span className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs font-semibold px-2 py-1 rounded-full">
                            {product.discount}% Off
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="text-lg font-semibold text-foreground">
                          {product.name}
                        </h4>
                        <p className="text-muted-foreground">
                          ${product.price.toFixed(2)}
                        </p>
                        {product.category && (
                          <p className="text-sm text-muted-foreground">
                            {product.category.name}
                          </p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
            <button
              onClick={scrollPrev}
              disabled={!canPrev}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-background/80 text-foreground rounded-full p-2 disabled:opacity-50"
              aria-label="Previous product"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={scrollNext}
              disabled={!canNext}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-background/80 text-foreground rounded-full p-2 disabled:opacity-50"
              aria-label="Next product"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <div className="flex justify-center mt-4 space-x-2">
              {products.map((_, index) => (
                <button
                  key={index}
                  onClick={() => emblaApi?.scrollTo(index)}
                  className={`h-2 w-2 rounded-full ${
                    emblaApi?.selectedScrollSnap() === index
                      ? "bg-primary"
                      : "bg-muted"
                  }`}
                  aria-label={`Go to product ${index + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <motion.p
            className="text-muted-foreground text-center"
            variants={itemVariants}
          >
            No products available.
          </motion.p>
        )}
        <motion.div className="text-center mt-8" variants={itemVariants}>
          <Button
            asChild
            variant="link"
            className="text-primary hover:text-primary/80"
          >
            <Link href="/products/1">
              View All Products <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}
