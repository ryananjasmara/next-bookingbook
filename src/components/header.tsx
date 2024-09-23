"use client";

import Link from "next/link";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);

  const menuItems = [
    { label: "Home", href: "/", submenu: [] },
    {
      label: "Manage Book",
      href: "#",
      submenu: [
        { label: "Add Book", href: "/books/create" },
        { label: "View Books", href: "/books" },
      ],
    },
    {
      label: "Manage User",
      href: "#",
      submenu: [
        { label: "Add User", href: "#" },
        { label: "View User", href: "#" },
      ],
    },
    {
      label: "Borrowed Book",
      href: "#",
      submenu: [
        { label: "Return Book", href: "#" },
        { label: "View Borrowed Books", href: "#" },
      ],
    },
  ];

  const handleMenuClick = (index: number, href: string) => {
    if (href !== "#") {
      router.push(href);
      setIsMenuOpen(false);
      setOpenMenuIndex(null);
    } else {
      setOpenMenuIndex(index);
    }
  };

  const handleItemClick = () => {
    setOpenMenuIndex(null);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-background z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold sm:p-4">
            <span className="sm:hidden">LMS</span>
            <span className="hidden sm:inline">Library Management System</span>
          </h1>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button
              className="sm:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div
          className={`sm:block ${
            isMenuOpen ? "block" : "hidden"
          } bg-background`}
        >
          <Menubar className="flex flex-col sm:flex-row bg-background">
            {menuItems.map((item, index) => (
              <MenubarMenu key={index}>
                <MenubarTrigger
                  className="justify-start sm:justify-center w-full text-left sm:text-center hover:bg-accent"
                  onClick={() => handleMenuClick(index, item.href)}
                >
                  {item.label}
                </MenubarTrigger>
                {openMenuIndex === index && item.submenu.length > 0 && (
                  <MenubarContent className="bg-background">
                    {item.submenu.map((subItem, subIndex) => (
                      <MenubarItem
                        key={subIndex}
                        className="w-full hover:bg-accent"
                      >
                        <Link
                          href={subItem.href}
                          className="w-full block py-2"
                          onClick={handleItemClick}
                        >
                          {subItem.label}
                        </Link>
                      </MenubarItem>
                    ))}
                  </MenubarContent>
                )}
              </MenubarMenu>
            ))}
          </Menubar>
        </div>
      </div>
    </header>
  );
};

export default Header;
