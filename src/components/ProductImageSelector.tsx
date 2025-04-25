"use client";

import { useState } from "react";
import Image from "next/image";
import ZoomableImage from "./ZoomableImage";

function ProductImageSelector({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="w-full">
      <div className="relative w-full group">
        <div className="rounded-lg overflow-hidden shadow-md transition-shadow duration-300 group-hover:shadow-xl">
          <ZoomableImage src={selectedImage} />
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex flex-wrap gap-4 mt-4 justify-center">
        {images.map((image, index) => (
          <div
            key={index}
            className={`cursor-pointer rounded-lg overflow-hidden ${
              selectedImage === image ? "ring-4 ring-blue-500" : ""
            }`}
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image}
              alt={`Thumbnail ${index + 1}`}
              width={80}
              height={80}
              className="object-cover rounded-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductImageSelector;
