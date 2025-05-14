"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  LayoutDashboard, 
  User, 
  LogOut, 
  Menu, 
  X 
} from "lucide-react";
import { logoutHandler } from "@/app/functions/jwt";

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ 
  href, 
  icon, 
  label, 
  isActive,
  onClick 
}) => {
  return (
    <Link 
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        isActive 
          ? "bg-blue-600 text-white" 
          : "text-slate-300 hover:bg-slate-700/50"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const Navigation: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  
  const handleLogout = async () => {
    try {
      await logoutHandler();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button 
        onClick={toggleMenu}
        className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-slate-800 text-white md:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Navigation sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full bg-slate-800 text-white w-64 shadow-xl transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-blue-400">Business Simulation</h2>
        </div>
        
        <nav className="p-4 flex flex-col gap-2">
          <NavLink 
            href="/" 
            icon={<Home size={20} />} 
            label="Home" 
            isActive={pathname === "/"} 
          />
          <NavLink 
            href="/dashboard" 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            isActive={pathname === "/dashboard"} 
          />
          <NavLink 
            href="/profile" 
            icon={<User size={20} />} 
            label="Profile" 
            isActive={pathname === "/profile"} 
          />
          <NavLink 
            href="#" 
            icon={<LogOut size={20} />} 
            label="Logout" 
            isActive={false}
            onClick={handleLogout}
          />
        </nav>
      </aside>
    </>
  );
};

export default Navigation;
