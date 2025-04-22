"use client";

import HeroSection from "../Home/Hero";
import FeaturedProductsSlider from "../Home/FeaturedProductsSlider";
import TestimonialsSection from "../Home/TestimonialsSection";
import CTASection from "../Home/CTASection";
import { ProductWithCategories } from "@/lib/types/product.types";
import Footer from "../Home/Footer";

type HomePageProps = {
  products: ProductWithCategories[];
};

export default function HomePage({ products }: HomePageProps) {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      {/* Featured Products Slider */}
      <FeaturedProductsSlider products={products} />

      {/* Testimonials Section */}
      <TestimonialsSection />
      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
