"use client";
import React, {
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Play, Download, ArrowLeft, LogOut, Menu } from "lucide-react";

export interface HamburgerMenuRef {
  openMenu: () => void;
  closeMenu: () => void;
}

interface HamburgerMenuProps {
  isExporting: boolean;
  isSimulating: boolean;
  capture: () => Promise<void>;
  handleViewCompany: () => void;
  handleSimulate: () => void;
  onLogout?: () => void;
}

const HamburgerMenu = forwardRef<HamburgerMenuRef, HamburgerMenuProps>(
  (
    {
      isExporting,
      isSimulating,
      capture,
      handleViewCompany,
      handleSimulate,
      onLogout,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      openMenu: () => setIsOpen(true),
      closeMenu: () => setIsOpen(false),
    }));

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleMenuItemClick = useCallback(
      (action: () => void | Promise<void>) => {
        return async () => {
          setIsOpen(false);
          await action();
        };
      },
      []
    );

    const handleLogout = useCallback(() => {
      setIsOpen(false);
      if (onLogout) {
        onLogout();
      }
    }, [onLogout]);

    const menuItems = [
      {
        icon: Download,
        label: "Export Dashboard",
        onClick: handleMenuItemClick(capture),
        disabled: isExporting,
        loading: isExporting,
        color: "bg-slate-800/50",
        hoverColor: "bg-slate-900/50",
        description: "Download as image",
        extraClass: "export-dashboard-btn",
      },
      {
        icon: ArrowLeft,
        label: "Back",
        onClick: handleMenuItemClick(handleViewCompany),
        disabled: false,
        loading: false,
        color: "bg-slate-800/50",
        hoverColor: "bg-slate-900/50",
        description: "Go to companies",
      },
      {
        icon: Play,
        label: "Simulate",
        onClick: handleMenuItemClick(handleSimulate),
        disabled: isSimulating,
        loading: isSimulating,
        color: "bg-slate-800/50",
        hoverColor: "bg-slate-900/50",
        description: "Run simulation",
        extraClass: "simulate-dashboard-btn",
      },
      {
        icon: LogOut,
        label: "Logout",
        onClick: handleLogout,
        disabled: false,
        loading: false,
        color: "bg-slate-800/50",
        hoverColor: "bg-slate-900/50",
        description: "Sign out",
      },
    ];

    return (
      <div className="relative">
        {/* Toggle button */}
        <button
          onClick={toggleMenu}
          className={`z-50  text-white p-2 bg-transparent rounded-lg  cursor-pointer ${
            isOpen ? "hamburger-open" : ""
          }`}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <div className="relative w-5 h-5">
            <span className="absolute top-0.5 left-0 w-5 h-0.5 bg-white rounded hamburger-line line-1" />
            <span className="absolute top-2 left-0 w-5 h-0.5 bg-white rounded hamburger-line line-2" />
            <span className="absolute top-3.5 left-0 w-5 h-0.5 bg-white rounded hamburger-line line-3" />
          </div>
        </button>

        {/* Overlay */}
        {isOpen && <div className="fixed z-30 inset-0" onClick={toggleMenu} />}

        {/* Menu */}
        <div
          className={`absolute top-12 right-0 w-56 bg-slate-800 rounded-xl shadow-lg border border-slate-600 z-40 overflow-hidden ${
            isOpen
              ? "menu-enter pointer-events-auto"
              : "menu-exit pointer-events-none opacity-0"
          }`}
        >
          <div className="p-3 border-b border-slate-600 bg-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Actions</h3>
            <Menu size={16} className="text-gray-500" />
          </div>

          <div className="py-2 px-4 font-roboto-sans">
            {menuItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={i}
                  onClick={item.onClick}
                  disabled={item.disabled}
                  className={`${
                    item.extraClass ?? ""
                  } w-full flex items-center gap-4 py-2 px-4 rounded-lg mb-1 text-sm transition-all duration-150 ${
                    item.disabled
                      ? "opacity-50 cursor-not-allowed bg-gray-100"
                      : `bg-gradient-to-r ${item.color} ${item.hoverColor} text-white hover:scale-[1.01] active:scale-[0.99] border border-slate-500`
                  }`}
                >
                  {item.loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Icon size={16} />
                  )}
                  <div className="flex-1 text-left">
                    {item.loading ? `${item.label}...` : item.label}
                    <div className="text-[10px] opacity-80">
                      {item.loading ? "Please wait..." : item.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);

HamburgerMenu.displayName = "HamburgerMenu";
export default HamburgerMenu;
