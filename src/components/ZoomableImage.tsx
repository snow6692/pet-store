"use client";

import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/styles.min.css";

function ZoomableImage({ src }: { src: string }) {
  return (
    <div className="w-full max-w-[500px] min-w-[300px] mx-auto h-[500px]">
      <InnerImageZoom
        src={src}
        zoomSrc={src}
        zoomScale={1.5}
        width={500}
        height={500}
        className="object-contain rounded-lg shadow-lg w-full h-full"
      />
    </div>
  );
}

export default ZoomableImage;
