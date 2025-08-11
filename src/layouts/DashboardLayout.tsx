import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const DashboardLayout = () => {
  const location = useLocation();
  const role = location.pathname.split("/")[2] || "student";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="h-12 md:h-14 flex items-center border-b px-3 gap-2 sticky top-0 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
            <SidebarTrigger />
            <span className="text-sm text-muted-foreground">Кабинет · {role === "student" ? "Ученик" : role === "parent" ? "Родитель" : "Учитель"}</span>
          </header>
          <div className="p-4 md:p-6 animate-fade-in">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
