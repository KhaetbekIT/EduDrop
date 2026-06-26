import type { LayoutProps } from "$/types/components.type"
import "$/app/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EduDrop",
  description: "Homework Submission Platform",

  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-image-preview": "none",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const AppLayout = async ({children}:LayoutProps) => children;

export default AppLayout;