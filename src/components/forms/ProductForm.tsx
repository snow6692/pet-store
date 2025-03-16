"use client";
import { productZod } from "@/validations/product.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { ProductWithCategoriesTable } from "@/lib/types/product.types";
import { ProductStatus } from "@prisma/client";
import toast from "react-hot-toast";
import { createProduct, updateProduct } from "@/actions/product.action";
import { useGetAllCategories } from "@/hooks/useGetCategories";
import Loader from "../shared/Loader";
import ImageUpload from "../shared/ImageUpload";

interface IProps {
  product?: ProductWithCategoriesTable;
}
type Status = { value: string; name: string };
const status: Status[] = [
  {
    value: "ACTIVE",
    name: "Active",
  },
  {
    value: "INACTIVE",
    name: "Inactive",
  },
  {
    value: "OUT_OF_STOCK",
    name: "Out of Stock",
  },
];
function ProductForm({ product }: IProps) {
  const form = useForm({
    resolver: zodResolver(productZod),
    defaultValues: product
      ? {
          name: product.name,
          slug: product.slug,
          images: product.images,
          price: product.price,
          description: product.description ?? undefined,
          quantity: product.quantity,
          status: product.status as ProductStatus,
          discount: product.discount ?? undefined,
          brand: product.brand ?? undefined,
          isFeatured: product.isFeatured,
          categoryId: product.category.id,
        }
      : {
          name: "",
          slug: "",
          images: [],
          price: 1,
          description: "",
          quantity: 1,
          status: "ACTIVE",
          discount: 0,
          brand: "",
          isFeatured: false,
          categoryId: "",
        },
  });

  const { data: categories, isLoading, error } = useGetAllCategories();
  if (isLoading) return <Loader />;
  if (error || !categories) return <p>Error fetching categories</p>;

  const onSubmit = async (data: productZod) => {
    if (product) {
      const updatePromise = updateProduct({ data, id: product.id });
      toast.promise(updatePromise, {
        loading: "Updating...",
        success: "Product Updated Successfully!",
        error: "Error While Updating!",
      });
    }
    // Create
    else {
      const createPromise = createProduct(data);

      toast.promise(createPromise, {
        loading: "Creating...",
        success: "Product Created Successfully!",
        error: "Error While Creating!",
      });

      try {
        await createPromise;
        form.reset();
      } catch (error) {
        console.error("Error while Product category:", error);
      }
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6 ">
        <div className=" flex gap-10 justify-center items-center">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <Input {...field} placeholder="Product name" />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Slug */}
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <Input {...field} placeholder="Slug" />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className=" flex gap-10  justify-center items-center ">
          {/* Price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <Input {...field} type="number" placeholder="Price" />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Quantity */}
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <Input {...field} type="number" placeholder="Quantity" />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Category */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Images */}
        <div className="w-2/4 h-60">
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  endpoint="multiImageUploader"
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <Textarea
                {...field}
                placeholder="Product description"
                value={field.value ?? ""}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Status */}
        <div className=" flex gap-10 items-center justify-center">
          <FormField
            name="status"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={product ? product.status : field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {status.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Discount */}
          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount</FormLabel>
                <Input
                  {...field}
                  type="number"
                  placeholder="Discount %"
                  value={field.value ?? 0}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Brand */}
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <Input {...field} placeholder="Brand name" />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <Checkbox
                  onCheckedChange={field.onChange}
                  checked={field.value}
                />
                <FormLabel>Featured Product</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button disabled={form.formState.isSubmitting}>
          {product ? "Update the Product " : "Create a new Product"}
        </Button>
      </form>
    </Form>
  );
}

export default ProductForm;
