import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Your Search Wrapped",
  description: "Analyze your Google search history and discover insights about your browsing patterns",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
