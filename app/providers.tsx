"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { NuqsAdapter } from "nuqs/adapters/next/pages"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
        <NuqsAdapter>{children}</NuqsAdapter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
