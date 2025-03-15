import { Loader2 } from "lucide-react";

export default function Loader({ size = 24 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-500" size={size} />
    </div>
  );
}
