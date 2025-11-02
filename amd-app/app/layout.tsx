import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";

export const metadata = { 
  title: "AMD Dashboard", 
  description: "Advanced Answering Machine Detection Dashboard" 
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <div className="flex h-screen overflow-hidden">
            <aside className="hidden md:flex">
              <Sidebar />
            </aside>
            <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
              <div className="container mx-auto p-6">
                {children}
              </div>
            </main>
          </div>
          <MobileNav />
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
