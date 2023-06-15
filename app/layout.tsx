import Navbar from "@/components/navbar";
import "./globals.css";

export const metadata = {
  title: "Next Forum",
  description: "Next Forum",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div className="grid gap-2 grid-cols-12 w-screen min-h-screen-nonav">
          <div className="row-span-full col-span-full sm:col-start-2 sm:col-end-12 md:col-start-3 md:col-end-11">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
