import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/app/context/theme-provider";
import { Toaster as ToastifyToaster} from "@/components/ui/toaster";
import AuthProvider from "./context/AuthProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/option";
import { SidebarProvider } from "@/components/ui/sidebar";
import FirebaseServiceWorker from "./context/firebase-service-worker";
import StoreProvider from "@/lib/StoreProvider";

import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Await the server session
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Redux Provider to wrap the entire app */}
    
          <FirebaseServiceWorker/>
          <SidebarProvider>
            <AuthProvider session={session}>
              {/* Theme Provider to handle dark/light mode */}

              <ThemeProvider attribute="class" defaultTheme="system">
                {/* Toaster for notifications */}
                <ToastifyToaster/>
                <SonnerToaster/>
               
                  <StoreProvider children={children}></StoreProvider>
                
              </ThemeProvider>
            </AuthProvider>
          </SidebarProvider>
        
      </body>
    </html>
  );
}
