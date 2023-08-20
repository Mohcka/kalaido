import { Zap } from "lucide-react";
import { useEffect, useState } from "react";

import { MAX_FREE_COUNTS, MAX_TEXT_GENERATION } from "@/constants";
import { Card, CardContent } from "@/components/shadcn/ui/card";
import { Button } from "@/components/shadcn/ui/button";
import { Progress } from "@/components/shadcn/ui/progress";
import { useProModalStore } from "@/hooks/use-pro-modal-store";

export const LimitCounter = ({
  isPro = false,
  textLimitCount = 0,
  mediaLimitCount = 0,
}: {
  isPro: boolean,
  textLimitCount?: number,
  mediaLimitCount?: number,
}) => {
  const [mounted, setMounted] = useState(false);
  const proModal = useProModalStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  

  if (isPro) {
    return null;
  }

  return (
    <div className="px-3">
      <Card className="bg-white/10 border-0">
        <CardContent className="py-6">
          {/* <div className="text-center text-sm text-white mb-4 space-y-2">
            <p>
              {textLimitCount} / {MAX_TEXT_GENERATION} Text Generations
            </p>
            <Progress
              className="h-3"
              value={(textLimitCount / MAX_TEXT_GENERATION) * 100}
            />
          </div>
          <div className="text-center text-sm text-white my-4 space-y-2">
            <p>
              {textLimitCount} / {MAX_TEXT_GENERATION} Media Generations
            </p>
            <Progress
              className="h-3"
              value={(textLimitCount / MAX_TEXT_GENERATION) * 100}
            />
          </div> */}
          <Button
            onClick={proModal.onOpen}
            variant="premium"
            className="w-full"
          >
            Subscribe
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}