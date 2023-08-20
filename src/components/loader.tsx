import { RotateCw } from "lucide-react";
import Image from "next/image";

export const Loader = () => {
  return (
    <div className="h-full flex flex-col gap-y-4 items-center justify-center">
      <div className="w-10 h-10 relative animate-spin">
        <RotateCw className="h-full w-full" />
      </div>
      <p className="text-sm text-muted-foreground">Working...</p>
    </div>
  );
};
