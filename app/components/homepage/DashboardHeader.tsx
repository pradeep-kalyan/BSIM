"use client";
import React, { useState, useMemo } from "react";
import { Calendar } from "lucide-react";
import Image from "next/image";
import HamburgerMenu, { HamburgerMenuRef } from "./HamburgerMenu";
import { CompanyLogoProps } from "@/app/types/company";

interface DashboardHeaderProps {
  data: {
    company: {
      id: string;
      name: string;
      logo_url: string | null;
      current_period: number;
    };
  };
  periods: number[];
  selectedPeriod: number;
  onPeriodChange: (period: number) => void;
  currentUsername?: string;
  menuRef: React.RefObject<HamburgerMenuRef | null>;
  isExporting: boolean;
  isSimulating: boolean;
  onCapture: () => Promise<void>;
  onViewCompany: () => void;
  onSimulate: () => void;
  onLogout: () => void;
}

const CompanyLogo = ({ logoUrl, companyName }: CompanyLogoProps) => {
  const [imageError, setImageError] = useState(false);

  const isValidImageUrl = (url?: string) => {
    if (!url) return false;
    try {
      const parsed = new URL(url);
      return /\.(jpeg|jpg|png|gif|webp|svg)$/i.test(parsed.pathname);
    } catch {
      return false;
    }
  };

  // Memoize initials to avoid recalculation on every render
  const initials = useMemo(() => {
    if (!companyName || companyName.trim() === "") return "CO"; // Default fallback

    return companyName
      .trim()
      .split(" ")
      .filter((word) => word.length > 0) // Filter out empty strings
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [companyName]);

  const showFallback = imageError || !isValidImageUrl(logoUrl);

  return (
    <div className="w-28 h-28 rounded-full overflow-hidden border border-slate-700 bg-slate-800 flex items-center justify-center text-white text-4xl font-bold">
      {showFallback ? (
        <span>{initials}</span>
      ) : (
        <Image
          src={logoUrl!}
          alt={`${companyName} Logo`}
          className="object-cover w-full h-full"
          width={128}
          height={128}
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  data,
  periods,
  selectedPeriod,
  onPeriodChange,
  currentUsername,
  menuRef,
  isExporting,
  isSimulating,
  onCapture,
  onViewCompany,
  onSimulate,
  onLogout,
}) => {
  const isCurrentPeriod = selectedPeriod === data?.company?.current_period;

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onPeriodChange(Number(e.target.value));
  };

  return (
    <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#334155] shadow-2xl sticky top-0 z-50 w-full">
      <div className="sm:max-w-small md:max-w-medium lg:max-w-large xl:max-w-xlarge mx-auto px-6 py-4">
        <div className="flex justify-between items-center gap-8">
          {/* LEFT: Company info */}
          <div className="flex items-center gap-4 animate-slide-in-left min-w-0 flex-1">
            {/* Company Logo */}
            <div className="flex-shrink-0">
              <CompanyLogo
                logoUrl={data?.company?.logo_url ?? undefined}
                companyName={data?.company?.name || "Company"}
              />
            </div>

            {/* Company Details */}
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-white truncate">
                {data?.company?.name || "Company Dashboard"}
              </h1>

              {/* Period Selector */}
              <div className="flex items-center mt-2 space-x-2">
                <Calendar size={16} className="text-gray-300 flex-shrink-0" />
                <span className="text-sm text-gray-300 whitespace-nowrap">
                  Period:
                </span>
                <select
                  className="px-3 py-1 rounded-md bg-slate-800 text-white border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-w-[120px]"
                  value={selectedPeriod}
                  onChange={handlePeriodChange}
                >
                  {periods.map((p, index) => (
                    <option key={`period-${p}-${index}`} value={p}>
                      Period {p}{" "}
                      {p === data?.company?.current_period ? "(Current)" : ""}
                    </option>
                  ))}
                </select>
                {isCurrentPeriod && (
                  <span className="current-period-badge whitespace-nowrap">
                    LIVE
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Username */}
            {currentUsername && (
              <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-blue-300 text-sm font-medium truncate max-w-[150px]">
                  {currentUsername}
                </span>
              </div>
            )}

            {/* Hamburger Menu */}
            <HamburgerMenu
              ref={menuRef}
              isExporting={isExporting}
              isSimulating={isSimulating}
              capture={onCapture}
              handleViewCompany={onViewCompany}
              handleSimulate={onSimulate}
              onLogout={onLogout}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
