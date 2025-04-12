"use client";

import { useState } from "react";
import Image from "next/image";
import ZoomableImage from "./ZoomableImage";

function ProductImageSelector({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div>
      <ZoomableImage src={selectedImage} />

      {/* Thumbnails */}
      <div className="flex flex-wrap gap-4 mt-4">
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
