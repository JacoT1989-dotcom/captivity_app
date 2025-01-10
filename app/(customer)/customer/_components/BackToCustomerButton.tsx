import { SquareArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BackToCustomerPage() {
  return (
    <span className="flex items-center justify-center ">
     
      <Link href="/customer">
        <SquareArrowLeft />
      </Link>
    </span>
  );
}
