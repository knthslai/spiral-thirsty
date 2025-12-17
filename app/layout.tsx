import type { Metadata } from "next";
import { Providers } from "@/components/common/Providers";

export const metadata: Metadata = {
  title: "Spiral Thirsty",
  description: "Cocktail search app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
