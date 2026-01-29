"use client"

import {
  Calendar,
  ChevronsUpDown,
  Github,
  MapPin,
  Sparkles,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function DevAbout() {
  const { isMobile, state } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              tooltip='About me'
              size='lg'
              className='data-[state=open]:bg-sidebar-accent group/dev-about h-fit w-full flex-col data-[state=open]:text-sidebar-accent-foreground'
            >
              <div
                className={cn(
                  "relative w-full text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-[hsl(var(--sidebar-accent-foreground))]",
                  state === "collapsed" && "hidden",
                )}
              >
                <span className='relative z-10 bg-[hsl(var(--sidebar-background))] group-data-[state=open]/dev-about:bg-sidebar-accent group-hover/dev-about:bg-sidebar-accent px-2 text-sidebar-foreground'>
                  created by
                </span>
              </div>
              <div className='flex flex-row w-full items-center gap-2'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage
                    src='/sleddev.png'
                    alt='Sled Dev profile picture'
                  />
                  <AvatarFallback className='rounded-lg'>HD</AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>Horváth Dávid</span>
                  <span className='truncate text-xs'>@sleddev</span>
                </div>
                <ChevronsUpDown className='ml-auto size-4' />
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            side={isMobile ? "bottom" : "right"}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage
                    src='/sleddev.png'
                    alt='Sled Dev profile picture'
                  />
                  <AvatarFallback className='rounded-lg'>HD</AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>Horváth Dávid</span>
                  <span className='truncate text-xs'>@sleddev</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <MapPin />
                Debrecen, Hungary
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Calendar />
                19, High School student
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Sparkles />
                Hobbies: Cooking, Photography
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <a href='https://github.com/sleddev' target='_blank'>
              <DropdownMenuItem className='cursor-pointer'>
                <Github />
                @sleddev on GitHub
              </DropdownMenuItem>
            </a>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
