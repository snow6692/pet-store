"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { XIcon } from "lucide-react";

interface ImageUploadProps {
  onChange: (urls: string[]) => void;
  value: string[]; //    For multiple images
  endpoint: "singleImageUploader" | "multiImageUploader"; //
}

function ImageUpload({ endpoint, onChange, value }: ImageUploadProps) {
  const isMultiple = endpoint === "multiImageUploader";

  return (
    <div>
      {value.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {value.map((url, index) => (
            <div key={index} className="relative size-40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt="Uploaded"
                className="size-40 rounded-md object-cover"
              />
              {/* Remove the image */}
              <button
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                className="absolute right-0 top-0 rounded-full bg-red-500 p-1 shadow-sm"
                type="button"
              >
                <XIcon className="h-4 w-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      <UploadDropzone
        className="size-36"
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          if (!res) return;
          const urls = res.map((file) => file.ufsUrl);
          onChange(isMultiple ? [...value, ...urls] : [urls[0]]);
        }}
        onUploadError={(error: Error) => {
          console.log(error);
        }}
      />
    </div>
  );
}

export default ImageUpload;
