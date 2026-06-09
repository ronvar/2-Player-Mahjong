import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const theme = createTheme({
  defaultRadius: "md",
  fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
  fontFamilyMonospace: "var(--font-geist-mono), monospace",
  components: {
    Button: {
      defaultProps: { radius: "md" },
    },
  },
});

export const metadata: Metadata = {
  title: "Mahjong for Two",
  description: "A 2-player Mahjong game — play against a friend or the computer.",
};

const RootLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => (
  <html
    lang="en"
    className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
  >
    <head>
      <ColorSchemeScript />
    </head>
    <body className="min-h-full flex flex-col">
      <MantineProvider theme={theme} defaultColorScheme="dark">
        {children}
      </MantineProvider>
    </body>
  </html>
);

export default RootLayout;
