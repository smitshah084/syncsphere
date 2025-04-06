import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ModalProvider} from "@/components/providers/modal-provider";
import { SocketProvider } from "@/components/providers/socket-provider";
import { cn } from "@/lib/utils";
import "./globals.css";
import localFont from "next/font/local";
import { QueryProvider } from "@/components/providers/query-provider";


const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  weight: ['400', '700'],
});

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
  title: "SyncSphere",
  description: "SyncSphere is a modern Communtication and Collaboration tool built with Next.js and Clerk.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en" suppressContentEditableWarning suppressHydrationWarning>
      <body
        className={cn(
            `${openSans.variable} ${geistSans.variable} ${geistMono.variable} antialiased`,
            "bg-white dark:bg-[#313338]"
        )}
      >
        <ThemeProvider attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        storageKey="discord-theme">
        <SocketProvider>
        <ModalProvider />
        <QueryProvider>
        {children}
        </QueryProvider>
        </SocketProvider>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
