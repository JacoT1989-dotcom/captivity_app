"use client";
import Head from "next/head";
import { usePathname } from "next/navigation";

interface PageTitleProps {
  suffix?: string;
}

const formatPathname = (pathname: string): string => {
  // Remove leading slash and split by remaining slashes
  const parts = pathname.slice(1).split("/");
  // Capitalize first letter of each part and join with spaces
  const formatted = parts
    .map(part => (part ? part.charAt(0).toUpperCase() + part.slice(1) : "Home"))
    .join(" - ");
  return formatted || "Home";
};

const PageTitle: React.FC<PageTitleProps> = ({ suffix = "| Captivity" }) => {
  const pathname = usePathname();

  // Handle case where pathname could be null (although unlikely in most cases)
  const title = pathname ? formatPathname(pathname) : "Home";

  return (
    <Head>
      <title>{`${title} ${suffix}`}</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default PageTitle;
