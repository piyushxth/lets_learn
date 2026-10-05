"use client";

import * as React from "react";

import { NavMain } from "@/components/admin/Sidebar/nav-main";
import { NavProjects } from "@/components/admin/Sidebar/nav-projects";
import { NavUser } from "@/components/admin/Sidebar/nav-user";
import { TeamSwitcher } from "@/components/admin/Sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  GalleryVerticalEndIcon,
  PackageIcon,
  TagsIcon,
  ShoppingCartIcon,
  UsersIcon,
} from "lucide-react";

// Admin dashboard navigation data

const data = {
  user: {
    name: "Admin",
    email: "admin@example.com",
    avatar: "",
  },

  teams: [
    {
      name: "Admin Dashboard",
      logo: <GalleryVerticalEndIcon />,
      plan: "E-commerce",
    },
  ],

  navMain: [
    {
      title: "Products",
      url: "/admin/products",
      icon: <PackageIcon />,
      isActive: true,
      items: [
        {
          title: "All Products",
          url: "/admin/products",
        },
        {
          title: "Add Product",
          url: "/admin/products/add",
        },
      ],
    },

    {
      title: "Categories",
      url: "/admin/categories",
      icon: <TagsIcon />,
      items: [
        {
          title: "All Categories",
          url: "/admin/categories",
        },
        {
          title: "Add Category",
          url: "/admin/categories/add",
        },
      ],
    },

    {
      title: "Orders",
      url: "/admin/orders",
      icon: <ShoppingCartIcon />,
      items: [
        {
          title: "All Orders",
          url: "/admin/orders",
        },
        {
          title: "Add Order",
          url: "/admin/orders/add",
        },
      ],
    },

    {
      title: "Users",
      url: "/admin/users",
      icon: <UsersIcon />,
      items: [
        {
          title: "All Users",
          url: "/admin/users",
        },
        {
          title: "Add User",
          url: "/admin/users/add",
        },
      ],
    },
  ],

  projects: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
