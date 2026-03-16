// src/providers/providers.tsx
"use client";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export function Providers({ children }: { children: ReactNode }) {
  // useState ensures each user session gets its own QueryClient
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // data stays fresh for 5 minutes
            gcTime: 1000 * 60 * 10, // cache kept for 10 minutes
            retry: 1, // retry once on failure
            refetchOnWindowFocus: false, // don't refetch when tab regains focus
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster position="top-right" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
