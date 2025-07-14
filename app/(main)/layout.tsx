"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { checkAuthStatus } from "@/app/_actions/auth";
import { JWTPayload } from "@/app/functions/jwt";
import LogoutBtn from "../(auth)/_components/Logout";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import {
  HomeIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  UserIcon,
  UsersIcon,
  MegaphoneIcon,
  CogIcon,
  BanknoteArrowDown,
  BeakerIcon,
  TagIcon,
  PlusCircleIcon,
  ArrowRight,
} from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

interface NavLink {
  name: string;
  link: string;
  icon: React.ReactNode;
}

/**
 * Navigation section component to reduce repetition
 */
const NavSection = ({
  title,
  links,
  currentPath,
}: {
  title: string;
  links: NavLink[];
  currentPath: string;
}) => (
  <div className="flex flex-col gap-2 px-4 mb-6">
    <p className="text-slate-400 text-sm font-semibold px-4 py-2">{title}</p>
    {links.map((navItem) => (
      <Link href={navItem.link} key={navItem.name}>
        <div
          className={`
          flex items-center gap-3 text-white py-3 px-4 rounded-lg cursor-pointer transition-all duration-200
          ${
            currentPath === navItem.link
              ? "bg-blue-600 text-white shadow-md"
              : "text-slate-300 hover:bg-slate-700/50"
          }
        `}
        >
          <div className="w-5 h-5">{navItem.icon}</div>
          <span>{navItem.name}</span>
        </div>
      </Link>
    ))}
  </div>
);

/**
 * Main layout for dashboard pages with navigation sidebar
 */
export default function MainLayout({ children }: MainLayoutProps) {
  const [user, setUser] = useState<JWTPayload | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  // Verify authentication on component mount
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const userData = await checkAuthStatus();
        if (!userData) {
          router.push("/login");
          return;
        }
        setUser(userData);
      } catch (error) {
        console.error("Authentication error:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [router]);

  // Main navigation links with icons
  const mainNavLinks: NavLink[] = [
    {
      name: "Dashboard",
      link: "/homepage",
      icon: <HomeIcon />,
    },
    {
      name: "Performance",
      link: "/performance",
      icon: <ChartBarIcon />,
    },
    {
      name: "Market",
      link: "/market",
      icon: <ShoppingBagIcon />,
    },
    {
      name: "Profile",
      link: "/profile",
      icon: <UserIcon />,
    },
  ];

  const managementLinks: NavLink[] = [
    {
      name: "Human Resource",
      link: "/management/hr",
      icon: <UsersIcon />,
    },
    {
      name: "Marketing",
      link: "/management/marketing",
      icon: <MegaphoneIcon />,
    },
    {
      name: "Production",
      link: "/management/production",
      icon: <CogIcon />,
    },
    {
      name: "Finance",
      link: "/management/finance",
      icon: <BanknoteArrowDown />,
    },
    {
      name: "R&D",
      link: "/management/rd",
      icon: <BeakerIcon />,
    },
  ];

  const productLinks: NavLink[] = [
    {
      name: "Product Catalog",
      link: "/products/catalog",
      icon: <TagIcon />,
    },
    {
      name: "New Product",
      link: "/products/create",
      icon: <PlusCircleIcon />,
    },
  ];

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-slate-900 text-white">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-8 w-8 text-blue-500 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p>Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex justify-between">
      <motion.div
        initial={{ x: -500, y: 0, opacity: 0.2 }}
        animate={{ x: 0, y: 0, opacity: 1 }}
        exit={{ x: 500, y: 0, opacity: 0.2 }}
        transition={{ duration: 1.5, type: "spring" }}
        className="md:w-1/5 overflow-y-auto h-full bg-slate-800/80 border-r border-slate-700 flex flex-col"
      >
        <div className="flex flex-col h-full">
          <div className="p-6 text-center border-b border-slate-700">
            <h1 className="text-white text-2xl font-semibold">BusinessSim</h1>
            {user && (
              <span className="block text-sm text-blue-400 mt-2">
                {user.name}
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto py-1">
            <NavSection
              title="MAIN"
              links={mainNavLinks}
              currentPath={pathname}
            />
            <NavSection
              title="MANAGEMENT"
              links={managementLinks}
              currentPath={pathname}
            />
            <NavSection
              title="PRODUCTS"
              links={productLinks}
              currentPath={pathname}
            />
          </div>

          {/* Logout button at bottom */}
          <div className="p-4 border-t border-slate-700">
            <LogoutBtn />
          </div>
        </div>
      </motion.div>

      {/* Main Content */}

      <div className="md:w-4/5 h-full flex">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, x: 500, y: 0 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            // exit={{ opacity: 0, y: 0, x: 0 }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 50,
              damping: 20,
              mass: 2,
            }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
