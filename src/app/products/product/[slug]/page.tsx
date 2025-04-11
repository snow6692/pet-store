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
  };
}

async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return notFound();

  return (
    <div className="container mx-auto p-6 space-y-10">
      <ProductDetails product={product} />

      <div>
        <RatingForm productId={product.id} />
      </div>
      <RatingList productId={product.id} />
    </div>
  );
}

export default ProductPage;
