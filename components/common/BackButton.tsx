"use client";

import Link from "next/link";
import React from "react";

type Props = {
  href: string;
  title?: string;
};

export const BackButton: React.FC<Props> = ({ href, title = "Back" }) => {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 font-medium text-muted-foreground hover:text-foreground"
      prefetch={false}
    >
      <ArrowLeftIcon className="w-4 h-4" />
      {title}
    </Link>
  );
};

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}
