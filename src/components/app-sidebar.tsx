import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Calendar,
  NotebookText,
  Presentation,
  Bot,
  Trophy,
  Brain,
  Home,
  Users,
  ClipboardList,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const studentItems = [
  { title: "Расписание", url: "/dashboard/student/schedule", icon: Calendar },
  { title: "Домашние задания", url: "/dashboard/student/homework", icon: NotebookText },
  { title: "Виртуальный класс", url: "/dashboard/student/classroom", icon: Presentation },
  { title: "ИИ‑чат", url: "/dashboard/student/ai-chat", icon: Bot },
  { title: "Достижения", url: "/dashboard/student/achievements", icon: Trophy },
  { title: "AI‑психолог", url: "/dashboard/student/ai-psychologist", icon: Brain },
];

const parentItems = [
  { title: "Обзор", url: "/dashboard/parent/overview", icon: Home },
];

const teacherItems = [
  { title: "Классы", url: "/dashboard/teacher/classes", icon: Users },
  { title: "Задания", url: "/dashboard/teacher/assignments", icon: ClipboardList },
  { title: "ИИ‑планировщик", url: "/dashboard/teacher/ai-planner", icon: Sparkles },
  { title: "Урок", url: "/dashboard/teacher/classroom", icon: Presentation },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  const role = currentPath.split("/")[2] as "student" | "parent" | "teacher";

  const items = role === "student" ? studentItems : role === "parent" ? parentItems : teacherItems;
  const groupLabel = role === "student" ? "Ученик" : role === "parent" ? "Родитель" : "Учитель";

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    cn(
      "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground",
      isActive && "text-purple-600 font-semibold"
    );

  return (
    <Sidebar collapsible="icon" className="w-60 border-r">
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {groupLabel}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild tooltip={collapsed ? item.title : undefined}>
                    <NavLink to={item.url} end className={getNavCls}>
                      <div className="relative">
                        <item.icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                      </div>
                      <span className="transition-all duration-200 group-hover:translate-x-1">
                        {item.title}
                      </span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
