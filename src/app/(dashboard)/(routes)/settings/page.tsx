import { Settings } from "lucide-react";

import { Heading } from "@/components/heading";
import { SubscriptionButton } from "@/components/subscription-button";
import { checkSubscription } from "@/lib/subscription";
import { MAX_MEDIA_GENERATION, MAX_TEXT_GENERATION } from "@/constants";

const SettingsPage = async () => {
  const isPro = await checkSubscription();

  return (
    <div>
      <Heading
        title="Settings"
        description="Manage account settings."
        icon={Settings}
        iconColor="text-gray-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-4 lg:px-8 space-y-4">
        <div className="text-muted-foreground text-sm">
          {isPro
            ? "You are currently on a Pro plan."
            : "Subscribe to a Pro plan to unlock all features."}
        </div>
        <div className="text-muted-foreground text-sm">
          Plan Includes {MAX_MEDIA_GENERATION} media generations and{" "}
          {MAX_TEXT_GENERATION} text generations
        </div>
        <div className="text-muted-foreground text-sm">
          Media generations are experimental and may not work as expected. USE
          AT YOUR OWN RISK.
        </div>

        <SubscriptionButton isPro={isPro} />
      </div>
    </div>
  );
};

export default SettingsPage;
