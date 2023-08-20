import { MobileSidebar } from "@/components/mobile-sidebar";
import { getApiLimitCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { UserButton } from "@/components/user-button";

const Navbar = async () => {
  const { textCount, mediaCount } = await getApiLimitCount();
  const isPro = await checkSubscription();

  return (
    <div className="flex items-center p-4">
      <MobileSidebar
        isPro={isPro}
        textGenerationCount={textCount}
        mediaGenerationCount={mediaCount}
      />
      <div className="flex w-full justify-end">
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
