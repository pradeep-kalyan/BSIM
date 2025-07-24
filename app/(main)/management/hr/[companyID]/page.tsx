"use client";

import { useParams } from "next/navigation";
import HRDashboard from "@/app/(main)/_components/HRDashboard";

export default function HRPage() {
  const params = useParams();
  const companyID = params?.companyID as string;

  return <HRDashboard companyId={companyID} />;
}