"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Sidebar items for workflow
const items = [
  { title: "Crossword", url: "/workflow/crossword" },
  { title: "Maze", url: "/workflow/maze" },
  { title: "Sudoku", url: "/workflow/sudoku" },
  { title: "Word Search", url: "/workflow/word-search" },
  { title: "Scramble", url: "/workflow/scramble" },
  { title: "Double Puzzle", url: "/workflow/double-puzzle" },
  { title: "Missing Letters", url: "/workflow/missing-letters" },
  { title: "Cryptogram", url: "/workflow/cryptogram" },
  { title: "Word Match", url: "/workflow/word-match" },
];

export default function AppSidebar() {
  return (
    <Sidebar className="w-64 bg-gray-100 border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workflow</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>{item.title}</a>
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
