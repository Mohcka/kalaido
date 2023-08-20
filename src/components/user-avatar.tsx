import {useSession} from "next-auth/react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/ui/avatar";

export const UserAvatar = () => {
  const {data: session} = useSession();

  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={session?.user?.image || "/img/default.png"} />
      <AvatarFallback>
        {session?.user?.name?.charAt(0)}
        {/* {user?.lastName?.charAt(0)} */}
      </AvatarFallback>
    </Avatar>
  );
};
