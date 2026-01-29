import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { MoveLeft } from "lucide-react"

export default async function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className='overflow-x-hidden'>
        <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className='flex flex-1 flex-col gap-4 p-2 sm:p-4 pt-0 items-center justify-center'>
          <div className='flex gap-8 items-center'>
            <MoveLeft className='text-muted-foreground' size={32} />
            <div className='flex flex-col'>
              <span className='text-xl font-semibold'>No project selected</span>
              <span className='text-muted-foreground'>
                Select a project from the sidebar to continue
              </span>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
