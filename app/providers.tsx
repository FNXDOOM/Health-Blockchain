'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { PatientProvider } from "@/contexts/PatientContext";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <PatientProvider>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </PatientProvider>
    </QueryClientProvider>
  );
}
