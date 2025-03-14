// "use client";

// import { UploadDropzone } from "@/lib/uploadthing";
// import { XIcon } from "lucide-react";

// interface ImageUploadProps {
//   onChange: (urls: string[]) => void;
//   value: string[]; // For multiple images
//   endpoint: "singleImageUploader" | "multiImageUploader";
// }

// function ImageUpload({ endpoint, onChange, value }: ImageUploadProps) {
//   const isMultiple = endpoint === "multiImageUploader";

//   return (
//     <div className="flex flex-col items-center">
//       {/* ✅ عرض الصور وإخفاء الرفع عند وجود صور */}
//       {value.length > 0 ? (
//         <div className="mb-4 flex flex-wrap gap-3">
//           {value.map((url, index) => (
//             <div key={index} className="relative w-40 h-40">
//               {/* eslint-disable-next-line @next/next/no-img-element */}
//               <img
//                 src={url}
//                 alt="Uploaded"
//                 className="w-40 h-40 rounded-md object-cover shadow-md"
//               />
//               {/* زر الحذف */}
//               <button
//                 onClick={() => onChange(value.filter((_, i) => i !== index))}
//                 className="absolute right-2 top-2 rounded-full bg-red-600 p-2 shadow-md hover:bg-red-700 transition"
//                 type="button"
//               >
//                 <XIcon className="h-5 w-5 text-white" />
//               </button>
//             </div>
//           ))}
//         </div>
//       ) : (
//         // ✅ إظهار UploadDropzone فقط إذا لم تكن هناك صور
//         <div className="w-64 h-64 border-2 border-dashed border-gray-400 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition duration-300">
//           <UploadDropzone
//             className="w-full h-full flex items-center justify-center"
//             endpoint={endpoint}
//             onClientUploadComplete={(res) => {
//               if (!res) return;
//               const urls = res.map((file) => file.url);
//               onChange(isMultiple ? [...value, ...urls] : [urls[0]]);
//             }}
//             onUploadError={(error: Error) => {
//               console.log(error);
//             }}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// export default ImageUpload;

"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { XIcon } from "lucide-react";

interface ImageUploadProps {
  onChange: (urls: string[]) => void;
  value: string[];
  endpoint: "singleImageUploader" | "multiImageUploader";
}

function ImageUpload({ endpoint, onChange, value }: ImageUploadProps) {
  const isMultiple = endpoint === "multiImageUploader";
  const maxImages = 5;
  const canUploadMore = isMultiple
    ? value.length < maxImages
    : value.length === 0;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Render uploaded images */}
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

      {/* Show UploadDropzone only if conditions are met */}
      {canUploadMore && (
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
      )}
    </div>
  );
}

export default ImageUpload;
