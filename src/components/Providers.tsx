"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToasterProvider } from "./toaster-provider";
import { ModalProvider } from "./modal-provider";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ToasterProvider />
        <ModalProvider />
        {children}
      </QueryClientProvider>
    </SessionProvider>
  );
}
