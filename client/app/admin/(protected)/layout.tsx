import AdminGuard from "@/components/admin/AdminGuard";
import { AuthProvider } from "../../context/AuthContext";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import "./adminGlobal.css";
import { AppSidebar } from "@/components/admin/Sidebar/app-sidebar";
import { Separator } from "@base-ui/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/admin/ThemeProvider";
import { ModeToggle } from "@/components/ui/toggle-mode";

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminGuard>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AppSidebar />

            <SidebarInset>
              <main className="flex-1">
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                  <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />

                    <Separator
                      orientation="vertical"
                      className="mr-2 data-[orientation=vertical]:h-4"
                    />

                    <Breadcrumb>
                      <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                          <BreadcrumbLink href="#">
                            Build Your Application
                          </BreadcrumbLink>
                        </BreadcrumbItem>

                        <BreadcrumbSeparator className="hidden md:block" />

                        <BreadcrumbItem>
                          <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                        </BreadcrumbItem>
                        <Breadcrumb>
                          <BreadcrumbPage className="flex items-center space-x-2">
                            <ModeToggle />
                            {/* <div className="md:hidden">
            <MobileNav />
          </div> */}
                          </BreadcrumbPage>
                        </Breadcrumb>
                      </BreadcrumbList>
                    </Breadcrumb>
                  </div>
                </header>

                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                  {children}
                </div>

                <Toaster />
              </main>
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </AdminGuard>
    </AuthProvider>
  );
}
