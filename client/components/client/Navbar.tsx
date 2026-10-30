"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { Container } from "./ui/Container";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

const navigation = [
  {
    name: "Shop All",
    href: "/products",
  },

  {
    name: "Best Sellers",
    href: "/best-sellers",
  },
  {
    name: "Men",
    href: "/men",
  },
  {
    name: "Women",
    href: "/women",
  },
];

const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  // Homepage is the only page where the navbar
  // should be transparent at the very top.
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Set the initial state
    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isTransparent = isHomePage && !isScrolled;

  return (
    <header
      className={`
        fixed inset-x-0 top-0 z-50
        transition-all duration-300 ease-in-out
        ${
          isTransparent
            ? "border-transparent bg-transparent text-white"
            : "border-neutral-200 bg-white"
        }
      `}
    >
      <nav aria-label="Main navigation">
        <Container>
          <div className="relative flex items-center justify-between">
            {/* --------------------------------
                Mobile Menu
            -------------------------------- */}
            <div className="py-3 flex items-center lg:hidden">
              <button
                type="button"
                aria-label="Open menu"
                className={`
                  flex size-10 items-center justify-center
                  rounded-md
                  transition-colors
                  ${
                    isTransparent ? "hover:bg-white/10" : "hover:bg-neutral-100"
                  }
                `}
              >
                <Menu className="size-5" />
              </button>
            </div>

            {/* --------------------------------
                Desktop Navigation
            -------------------------------- */}
            <div className="hidden items-center gap-8 lg:flex">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-semibold text-sm tracking-tight py-6
                    ${
                      isTransparent
                        ? "text-white hover:text-neutral-400"
                        : "hover:text-neutral-700"
                    }
                  `}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* --------------------------------
                Logo
            -------------------------------- */}
            <Link
              href="/"
              className={`
                absolute left-1/2 tracking-widest
                -translate-x-1/2
                text-2xl font-semibold
              `}
            >
              YOUR BRAND
            </Link>

            {/* --------------------------------
                Right Actions
            -------------------------------- */}
            <div className="ml-auto flex items-center gap-1">
              {/* Search */}
              <button
                type="button"
                aria-label="Search"
                className={`
                  flex cursor-pointer size-10 items-center justify-center
                  rounded-md
                  ${
                    isTransparent ? "hover:bg-white/10" : "hover:bg-neutral-200"
                  }
                `}
              >
                <Search className="size-5" />
              </button>

              {/* Account */}
              <button
                type="button"
                aria-label="Account"
                className={`
                  hidden size-10 items-center justify-center
                  rounded-md cursor-pointer
                  sm:flex
                  ${
                    isTransparent ? "hover:bg-white/10" : "hover:bg-neutral-200"
                  }
                `}
              >
                <User className="size-5" />
              </button>

              {/* Cart */}

              {/* Cart Drawer */}
              <Sheet>
                <SheetTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Open shopping cart"
                      className={`size-10 rounded-md ${
                        isTransparent
                          ? "text-white hover:bg-white/10 hover:text-white"
                          : "text-black hover:bg-neutral-200"
                      }`}
                    />
                  }
                >
                  <ShoppingBag className="size-5" />
                </SheetTrigger>

                <SheetContent
                  side="right"
                  className="flex w-full flex-col gap-0 sm:max-w-md"
                >
                  <SheetHeader className="border-b px-6 py-5 text-left">
                    <SheetTitle className="text-xl font-semibold">
                      Your Cart
                    </SheetTitle>

                    <SheetDescription>
                      Review your items before checkout.
                    </SheetDescription>
                  </SheetHeader>

                  {/* Empty Cart State */}
                  <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                    <ShoppingBag className="mb-4 size-10 text-neutral-400" />

                    <h3 className="text-lg font-medium">Your cart is empty</h3>

                    <p className="mt-2 max-w-xs text-sm text-neutral-500">
                      Discover something you'll love and add it to your cart.
                    </p>
                  </div>

                  {/* Cart Footer */}
                  <SheetFooter className="border-t p-6 sm:flex-col">
                    <SheetClose
                      render={
                        <Button
                          variant={"outline"}
                          className="h-12 w-full rounded-none bg-black text-white hover:bg-neutral-800"
                        />
                      }
                    >
                      <Link href="/products">Continue Shopping</Link>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </Container>
      </nav>
    </header>
  );
};

export default Navbar;
