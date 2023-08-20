"use client";

import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/shadcn/ui/button";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Logo from "./Logo";

const font = Montserrat({ weight: "600", subsets: ["latin"] });

export const LandingNavbar = () => {
  const { status } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [status]);

  return (
    <nav className="p-4 bg-transparent flex items-center justify-between">
      <Link href="/" className="flex items-center">
        <h1 className={cn("text-2xl font-bold text-white", font.className)}>
          <Logo className="text-4xl font-semibold" />
        </h1>
      </Link>
      <div className="flex items-center gap-x-2">
        <Link
          href={
            status === "loading"
              ? "#"
              : isAuthenticated
              ? "/dashboard"
              : "/sign-up"
          }
        >
          <Button variant="outline" className="rounded-full">
            Get Started
          </Button>
        </Link>
        {status === "loading" ? (
          <></>
        ) : isAuthenticated ? (
          <Button
            onClick={() => signOut()}
            variant="outline"
            className="rounded-full"
          >
            Sign Out
          </Button>
        ) : (
          <Link href="/sign-in">
            <Button variant="outline" className="rounded-full">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};
