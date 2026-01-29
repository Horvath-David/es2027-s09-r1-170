"use client"

import { SidebarMenu, useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { Leaf } from "lucide-react"

export function Branding() {
  const { open } = useSidebar()

  return (
    <SidebarMenu>
      <div className='flex items-center gap-2'>
        <div
          className={cn(
            "flex aspect-square size-10 transition-[width,height] duration-200 items-center justify-center rounded-xl bg-primary text-sidebar-primary-foreground",
            !open && "size-8",
          )}
        >
          <Leaf className='text-white' size={20} />
        </div>
        <div className='grid flex-1 text-left text-sm leading-tight'>
          <span className='truncate font-semibold'>GreenWind</span>
          <span className='truncate text-xs'>ES 2027</span>
        </div>
      </div>
    </SidebarMenu>
  )
}
