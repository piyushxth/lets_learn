import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Page",
  description: "This is the admin page",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
