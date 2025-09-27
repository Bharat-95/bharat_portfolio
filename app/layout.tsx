import type { Metadata } from "next";
import "./globals.css";



export const metadata: Metadata = {
title: "Bharat | Full Stack Developer",
description:
  "Full Stack Developer skilled in building scalable web applications using React, Next.js, Node.js, Express, and modern databases. Experienced in creating responsive UIs, REST/GraphQL APIs, and deploying solutions with CI/CD workflows for high-performance applications.",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
