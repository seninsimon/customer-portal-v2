import type { Metadata } from "next";
import { Reddit_Sans_Condensed } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import NotificationPermissionWrapper from "@/hooks/NotificationPermissionWrapper";


const redditSans = Reddit_Sans_Condensed({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Meridian Express Logistics",
  description: "Your trusted partner for international shipping and logistics solutions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={redditSans.className}>
        <Provider>
          <NotificationPermissionWrapper>
          {children}
          </NotificationPermissionWrapper>
        </Provider>
      </body>
    </html>
  );
}
