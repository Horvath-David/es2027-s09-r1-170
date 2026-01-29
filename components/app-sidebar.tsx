"use client"

import { Home, LayoutDashboard } from "lucide-react"
import * as React from "react"

import { JSON_SERVER_URL } from "@/app/constants"
import { Branding } from "@/components/branding"
import { DarkModeSwitch } from "@/components/dark-mode-switch"
import { DevAbout } from "@/components/dev-about"
import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Project } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"

const data = {
  navMain: [
    {
      title: "Projects",
      url: "#",
      path: "/",
      icon: LayoutDashboard,
      items: [
        {
          title: "Overview Metrics",
          url: "/projects/asd",
        },
        {
          title: "Demographics",
          url: "#demographics",
        },
        {
          title: "Purchase Behavior",
          url: "#purchases",
        },
        {
          title: "Customer Trends",
          url: "#trends",
        },
      ],
    },
  ],
  projects: [],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data, isFetching } = useQuery({
    queryKey: ["projects", "all"],
    queryFn: async () => {
      const response = await fetch(`${JSON_SERVER_URL}/projects`)
      return (await response.json()) as Project[]
    },
  })

  const navData = React.useMemo(
    () => ({
      navMain: [
        {
          title: "Home",
          url: "/",
          path: "/",
          icon: Home,
        },
        {
          title: "Projects",
          url: "#",
          path: "/projects",
          icon: LayoutDashboard,
          items:
            !data && isFetching
              ? [
                  {
                    title: "Loading...",
                    url: "#",
                    disabled: true,
                  },
                ]
              : (data ?? []).map((proj) => ({
                  title: proj.name,
                  url: `/projects/${proj.id}`,
                })),
          disabled: isFetching,
        },
      ],
    }),
    [data],
  )

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <Branding />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <DarkModeSwitch />
        <DevAbout />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
