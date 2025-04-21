"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useGetTopRatings } from "@/hooks/useGetTopRatings";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

export default function TestimonialsSection() {
  const { data: ratings = [], isLoading, isError } = useGetTopRatings();
  const autoplay = useRef(Autoplay({ delay: 3000 }));
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
      className="py-16 bg-background"
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
          What Pet Lovers Say
        </motion.h3>

        {isLoading ? (
          <motion.p
            className="text-center text-muted-foreground"
            variants={itemVariants}
          >
            Loading testimonials...
          </motion.p>
        ) : isError || !ratings || ratings.length === 0 ? (
          <motion.p
            className="text-center text-muted-foreground"
            variants={itemVariants}
          >
            No testimonials found.
          </motion.p>
        ) : (
          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {ratings.map((rating, index) => (
                  <motion.div
                    key={index}
                    className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] px-2"
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.03,
                      transition: { duration: 0.3 },
                    }}
                  >
                    <Link
                      href={`/profile/${rating.userId}`}
                      className="bg-card rounded-lg shadow-md p-6 flex items-start gap-4 h-full"
                    >
                      <Image
                        src={rating.user.image || "/default-avatar.png"}
                        alt={rating.user.name || "User"}
                        width={64}
                        height={64}
                        className="rounded-full object-cover"
                        loading="lazy"
                      />
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          {Array.from({ length: rating.rating }).map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 text-yellow-500 fill-yellow-500"
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                        <p className="text-foreground italic">
                          {rating.comment}
                        </p>
                        <p className="text-muted-foreground mt-2 font-semibold">
                          — {rating.user.name}
                        </p>
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
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={scrollNext}
              disabled={!canNext}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-background/80 text-foreground rounded-full p-2 disabled:opacity-50"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <div className="flex justify-center mt-4 space-x-2">
              {ratings.map((_, index) => (
                <button
                  key={index}
                  onClick={() => emblaApi?.scrollTo(index)}
                  className={`h-2 w-2 rounded-full ${
                    emblaApi?.selectedScrollSnap() === index
                      ? "bg-primary"
                      : "bg-muted"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}
