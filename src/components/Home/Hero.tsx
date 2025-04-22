"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronRight, Users } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

export default function HeroSection() {
  const autoplay = useRef(Autoplay({ delay: 5000 }));
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, slidesToScroll: 1 },
    [autoplay.current]
  );

  const backgroundImages = ["/squirrel.jpeg", "/bird.jpeg", "/cat.jpeg"];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setCurrentSlide(emblaApi.selectedScrollSnap());
    };
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, duration: 0.8 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.1, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)" },
    tap: { scale: 0.95 },
    focus: { outline: "2px solid #ffffff", outlineOffset: "4px" },
  };

  return (
    <motion.section
      className="relative min-h-[80vh] flex items-center justify-center py-24 text-foreground overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background Image Carousel */}
      <div className="absolute inset-0" ref={emblaRef}>
        <div className="flex h-full">
          {backgroundImages.map((src, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0 relative h-full"
              style={{
                backgroundImage: `url(${src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="absolute inset-0 bg-black/30" />
            </div>
          ))}
        </div>
      </div>

      {/* Fallback Message if Images Don't Load */}
      {backgroundImages.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-0">
          <p className="text-white text-lg">No background images available</p>
        </div>
      )}

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight"
          variants={itemVariants}
        >
          Everything Your Pet Needs,{" "}
          <motion.span
            className="text-primary"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Plus a Community That Cares!
          </motion.span>
        </motion.h1>
        <motion.p
          className="text-lg sm:text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto"
          variants={itemVariants}
        >
          Discover premium pet food, supplies, and a vibrant community of pet
          lovers ready to share tips and support.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4"
          variants={itemVariants}
        >
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            whileFocus="focus"
          >
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 flex items-center gap-2 px-6 py-3 rounded-full"
              aria-label="Shop now for pet products"
            >
              <Link href="/products/1">
                Shop Now <ChevronRight className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            whileFocus="focus"
          >
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center gap-2 px-6 py-3 rounded-full"
              aria-label="Join the pet community"
            >
              <Link href="/community">
                Join Community <Users className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Carousel Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-3 w-3 rounded-full transition-all duration-300 ${
              currentSlide === index ? "bg-white scale-125" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </motion.section>
  );
}
