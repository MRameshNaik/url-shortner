import "./globals.css";

export const metadata = {
  title: "URL Shortener",
  description: "Create fast, shareable short links",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}