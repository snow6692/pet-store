

"use client";

import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/styles.min.css";

function ZoomableImage({ src }: { src: string }) {
  return (
    <div className="w-full h-auto max-w-full mx-auto aspect-square">
      <InnerImageZoom
        src={src}
        zoomSrc={src}
        zoomScale={1.5}
        width={300} 
        height={300} 
        imgAttributes={{
          style: { width: "100%", height: "auto" }, // Make the image responsive
        }}
        className="object-contain rounded-lg shadow-lg w-full h-full"
      />
    </div>
  );
}

export default ZoomableImage;
