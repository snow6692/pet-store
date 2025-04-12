import { getRelatedProducts } from "@/actions/product.action";
import ProductCard from "@/components/cards/ProductCard";
import RatingForm from "@/components/forms/RatingForm";
import ProductDetails from "@/components/ProductDetails";
import RatingList from "@/components/RatingList";
import { getCachedProducts } from "@/lib/cache/product.cache";
import { notFound } from "next/navigation";

async function getProductBySlug(slug: string) {
  const data = await getCachedProducts();
  if (!data || !data.products) return null;

  return data.products.find((product) => product.slug === slug) || null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "This product does not exist.",
    };
  }

  return {
    title: product.name,
    description: product.description,
    image: product.images?.[0] || "/default-image.jpg",
    url: `/products/${product.slug}`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.images?.[0] || "/default.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [product.images?.[0] || "/default.jpg"],
    },
  };
}

async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return notFound();

  const relatedProducts = await getRelatedProducts(
    product.category.name,
    product.id
  );

  return (
    <div className="container mx-auto p-6 space-y-10">
      <ProductDetails product={product} />
      {/* Related products */}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold"> Related products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {relatedProducts.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </div>
      <div>
        <RatingForm productId={product.id} />
      </div>
      <RatingList productId={product.id} />
    </div>
  );
}

export default ProductPage;
