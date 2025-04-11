"use client";

import { useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { searchProducts } from "@/actions/product.action";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@prisma/client";
import { useState } from "react";
import { Input } from "./ui/input";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  const [inputValue, setInputValue] = useState(searchTerm);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isPending, startTransition] = useTransition();
  const { debouncedValue, isDebouncing } = useDebouncedValue(inputValue, 300);

  useEffect(() => {
    if (debouncedValue.length >= 3) {
      const url = new URLSearchParams();
      url.set("search", debouncedValue);
      router.replace(`?${url.toString()}`);
    } else {
      router.replace("?");
    }
  }, [debouncedValue, router]);

  useEffect(() => {
    if (searchTerm.length >= 3) {
      startTransition(async () => {
        const products = await searchProducts({ search: searchTerm });
        setSuggestions(products);
      });
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  return (
    <div className="relative w-full max-w-xs">
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search products..."
        className="  focus:ring-2 focus:ring-blue-500"
      />

      {suggestions.length > 0 && (
        <ul className="absolute w-full bg-white border mt-1 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          {suggestions.map((product) => (
            <Link
              href={`/products/product/${product.slug}`}
              key={product.id}
              className="flex items-center p-2 hover:bg-gray-100 transition-colors"
            >
              <Image
                src={product.images[0] || "/placeholder-image.jpg"}
                alt={product.name}
                width={40}
                height={40}
                className="rounded object-cover"
              />
              <p className="ml-3 text-sm text-gray-700">{product.name}</p>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
}
