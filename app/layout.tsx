import React from "react";
import { Nanum_Myeongjo, Caveat } from "next/font/google";
import "swagger-ui-react/swagger-ui.css";
import "@/styles/app.css";
import ClientWrapper from "./ClientWrapper";

const nanumMyeongjoScript = Nanum_Myeongjo({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <h1 className={caveat.className}>Next Supa Todo List</h1>
      <body className={`${nanumMyeongjoScript.className}`}>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
