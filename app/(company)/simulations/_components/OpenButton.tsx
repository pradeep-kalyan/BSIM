"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface OpenButtonProps {
  companyId: string;
}

const OpenButton: React.FC<OpenButtonProps> = ({ companyId }) => {
  return (
    <Link
      href={`/homepage/${companyId}`}
      className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded-md"
    >
      <ExternalLink size={16} />
      Open
    </Link>
  );
};

export default OpenButton;
