import "@radix-ui/themes/styles.css";
import "./theme-config.css";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavBar from "./NavBar";
import { Container, Theme } from "@radix-ui/themes";
import AuthProvider from "./auth/Provider";
import QueryClientProvider from "./QueryClientProvider";
import CommandMenu from "./components/CommandMenu";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Fixora - Issue Tracker",
  description: "Modern issue tracking and developer telemetry platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} bg-[#09090b] text-zinc-300 min-h-screen antialiased`}>
        <QueryClientProvider>
          <AuthProvider>
            <Theme
              appearance="dark"
              accentColor="blue"
              grayColor="gray"
              panelBackground="translucent"
              radius="large"
            >
              <NavBar />
              <main className="p-5">
                <Container>{children}</Container>
              </main>
              <CommandMenu />
            </Theme>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
