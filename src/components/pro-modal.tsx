"use client";

import axios from "axios";
import { useState } from "react";
import { Check, Zap } from "lucide-react";
import { toast } from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/shadcn/ui/dialog";
import { Badge } from "@/components/shadcn/ui/badge";
import { Button } from "@/components/shadcn/ui/button";
import { useProModalStore } from "@/hooks/use-pro-modal-store";
import { MAX_MEDIA_GENERATION, MAX_TEXT_GENERATION, tools } from "@/constants";
import { Card } from "@/components/shadcn/ui/card";
import { cn } from "@/lib/utils";
import { LimitType } from "@/project-types";

export const ProModal = () => {
  const proModalStore = useProModalStore();
  const [loading, setLoading] = useState(false);

  const onSubscribe = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/stripe");

      window.location.href = response.data.url;
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={proModalStore.isOpen} onOpenChange={proModalStore.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
            <div className="flex items-center gap-x-2 font-bold text-xl">
              Upgrade to
              <Badge variant="premium" className="uppercase text-sm py-1">
                pro
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
            {tools.map((tool) => (
              <Card
                key={tool.href}
                className="p-3 border-black/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-x-4">
                  <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                    <tool.icon className={cn("w-6 h-6", tool.color)} />
                  </div>
                  <div className="font-semibold text-sm">{tool.label}</div>
                </div>
                <div className="flex">
                  <div className="pr-3">
                    {tool.contentType === LimitType.Text
                      ? "Text Generation"
                      : "Media Generation"}
                  </div>
                  <Check className="text-primary w-5 h-5" />
                </div>
              </Card>
            ))}
            <div>
              Plan Includes {MAX_MEDIA_GENERATION} media generations and{" "}
              {MAX_TEXT_GENERATION} text generations
            </div>
            <div className="text-muted-foreground text-sm">
              Media generations are experimental and may not work as expected.
              USE AT YOUR OWN RISK.
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            disabled={loading}
            onClick={onSubscribe}
            size="lg"
            variant="premium"
            className="w-full"
          >
            Subscribe
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
