"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { User, Settings, PieChart, LogOut } from "lucide-react";
import { updateCredits } from "@/lib/utils";

// Games menu items
const gamesPages: { title: string; href: string; description: string }[] = [
  {
    title: "Crossword",
    href: "/games/crossword",
    description: "Solve crosswords online.",
  },
  {
    title: "Maze",
    href: "/games/maze",
    description: "Find your way through a maze.",
  },
  {
    title: "Sudoku",
    href: "/games/sudoku",
    description: "Play Sudoku puzzles.",
  },
  {
    title: "Word Search",
    href: "/games/word-search",
    description: "Search for hidden words.",
  },
  {
    title: "Scramble",
    href: "/games/scramble",
    description: "Unscramble words and letters.",
  },
  {
    title: "Double Puzzle",
    href: "/games/double-puzzle",
    description: "Solve double puzzles.",
  },
  {
    title: "Missing Letters",
    href: "/games/missing-letters",
    description: "Find the missing letters.",
  },
  {
    title: "Cryptogram",
    href: "/games/cryptogram",
    description: "Crack codes and ciphers.",
  },
  {
    title: "Word Match",
    href: "/games/word-match",
    description: "Match words correctly.",
  },
];

// Navbar Component
export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGamesOpen, setIsGamesOpen] = useState(false); // State to control Games submenu
  
  useEffect(() => {
    // Update credits in the navbar
    if (user) {
      const usedQuota = user?.config?.downloadQuota?.usedQuota ?? 0
      const maxQuota = user?.quota?.downloadQuota ?? 0
      updateCredits(Math.max(0, maxQuota - usedQuota));
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    toast({
      description: "Logged out successfully",
    });
  };

  return (
    <header className="w-full border-b bg-white h-14 md:h-16 relative">
      <div className="container mx-auto flex items-center justify-between p-2 md:p-4 h-full">
        {/* Logo */}
        <Link href="/" className="text-lg md:text-xl font-bold">
          <img src="/logo.svg" alt="Logo" className="h-8 md:h-10 p-1" />
        </Link>

        {/* Desktop Navigation Menu */}
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/faqs" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    FAQs
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/contact" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Contact Us
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Menu Button */}
        <button
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 focus:outline-none"
        >
          {/* Hamburger Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Authentication Menu (Desktop) */}
        <div className="hidden md:block">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <span id="credits">Credits</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src={
                        user?.avatar || "https://avatar.iran.liara.run/public"
                      }
                      alt="User Avatar"
                    />
                    <AvatarFallback>{user?.fullName[0]}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  {/* Logout */}
                  <DropdownMenuItem onClick={handleLogout}>
                    <div className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4" /> {/* Icon */}
                      <span>Logout</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } md:hidden absolute top-full left-0 w-full bg-white border-t border-b shadow-lg z-50`}
      >
        <ul className="space-y-2 p-4">
          {/* Games Section */}
          

          {/* Other Nav Items */}
          <li>
            <Link
              href="/faqs"
              className="block p-2 hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQs
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="block p-2 hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
          </li>

          {/* Authentication Links */}
          {isLoggedIn ? (
            <>
              <li>
                <div className="flex items-center p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={
                        user?.avatar || "https://avatar.iran.liara.run/public"
                      }
                      alt="User Avatar"
                    />
                    <AvatarFallback>{user?.fullName[0]}</AvatarFallback>
                  </Avatar>
                  <Button variant="ghost" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  href="/login"
                  className="block p-2 hover:bg-gray-100 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button variant="ghost" className="w-full">
                    Login
                  </Button>
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="block p-2 hover:bg-gray-100 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button className="w-full">Register</Button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}

// ListItem component for Games Dropdown
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${className}`}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
