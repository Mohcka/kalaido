"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/shadcn/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/shadcn/ui/sheet";
import { Sidebar } from "@/components/sidebar";

export const MobileSidebar = ({
  textGenerationCount = 0,
  mediaGenerationCount = 0,
  isPro = false,
}: {
  textGenerationCount: number;
  mediaGenerationCount: number;
  isPro: boolean;
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <Sidebar
          isPro={isPro}
          apiMediGenerationLimitCount={textGenerationCount}
          apiTextGenerationLimitCount={mediaGenerationCount}
        />
      </SheetContent>
    </Sheet>
  );
};
