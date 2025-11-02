"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Phone, History, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Dialer", icon: Phone, href: "/dialer" },
  { label: "History", icon: History, href: "/history" },
  { label: "Compare", icon: BarChart3, href: "/compare" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card md:hidden">
      <nav className="flex items-center justify-around">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors",
              pathname === route.href
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <route.icon className="h-5 w-5" />
            {route.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
