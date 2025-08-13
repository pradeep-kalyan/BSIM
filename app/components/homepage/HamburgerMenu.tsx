"use client";
import React, { useState, useCallback } from 'react';
import { Play, Download, ArrowLeft, LogOut, Menu } from 'lucide-react';

interface HamburgerMenuProps {
    isExporting: boolean;
    isSimulating: boolean;
    capture: () => Promise<void>;
    handleViewCompany: () => void;
    handleSimulate: () => void;
    onLogout?: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
    isExporting,
    isSimulating,
    capture,
    handleViewCompany,
    handleSimulate,
    onLogout
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleMenuItemClick = useCallback((action: () => void | Promise<void>) => {
        return async () => {
            setIsOpen(false);
            await action();
        };
    }, []);

    const handleLogout = useCallback(() => {
        setIsOpen(false);
        onLogout ? onLogout() : console.log('Logout clicked');
    }, [onLogout]);

    const menuItems = [
        {
            icon: Download,
            label: 'Export Dashboard',
            onClick: handleMenuItemClick(capture),
            disabled: isExporting,
            loading: isExporting,
            color: 'from-orange-400 to-orange-500',
            hoverColor: 'hover:from-orange-500 hover:to-amber-600',
            description: 'Download as image',
            extraClass: "export-dashboard-btn",
        },
        {
            icon: ArrowLeft,
            label: 'Back',
            onClick: handleMenuItemClick(handleViewCompany),
            disabled: false,
            loading: false,
            color: 'from-blue-500 to-blue-600',
            hoverColor: 'hover:from-blue-600 hover:to-blue-700',
            description: 'Go to companies',
        },
        {
            icon: Play,
            label: 'Simulate',
            onClick: handleMenuItemClick(handleSimulate),
            disabled: isSimulating,
            loading: isSimulating,
            color: 'from-purple-500 to-purple-600',
            hoverColor: 'hover:from-purple-600 hover:to-purple-700',
            description: 'Run simulation',
            extraClass: "simulate-dashboard-btn",
        },
        {
            icon: LogOut,
            label: 'Logout',
            onClick: handleLogout,
            disabled: false,
            loading: false,
            color: 'from-red-500 to-red-600',
            hoverColor: 'hover:from-red-600 hover:to-red-700',
            description: 'Sign out',
        }
    ];

    return (
        <>
            <style jsx>{`
                @keyframes menuSlideIn {
                    from { opacity: 0; transform: scale(0.95) translateY(-5px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes menuSlideOut {
                    from { opacity: 1; transform: scale(1) translateY(0); }
                    to { opacity: 0; transform: scale(0.95) translateY(-5px); }
                }
                .menu-enter { animation: menuSlideIn 0.15s ease-out forwards; }
                .menu-exit { animation: menuSlideOut 0.15s ease-in forwards; }
                .hamburger-line { transition: all 0.3s ease; transform-origin: center; }
                .hamburger-open .line-1 { transform: rotate(45deg) translate(3px, 3px); }
                .hamburger-open .line-2 { opacity: 0; transform: scaleX(0); }
                .hamburger-open .line-3 { transform: rotate(-45deg) translate(3px, -3px); }
            `}</style>

            <div className="relative">
                <button
                    onClick={toggleMenu}
                    className={`z-50 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white p-2 rounded-lg shadow-md transition-transform duration-200 ${isOpen ? 'hamburger-open' : ''}`}
                    aria-label="Toggle menu"
                    aria-expanded={isOpen}
                >
                    <div className="relative w-5 h-5">
                        <span className="absolute top-0.5 left-0 w-5 h-0.5 bg-white rounded hamburger-line line-1" />
                        <span className="absolute top-2 left-0 w-5 h-0.5 bg-white rounded hamburger-line line-2" />
                        <span className="absolute top-3.5 left-0 w-5 h-0.5 bg-white rounded hamburger-line line-3" />
                    </div>
                </button>

                {isOpen && (
                    <div className="fixed z-30 inset-0" onClick={toggleMenu} />
                )}

                <div
                    className={`absolute top-12 right-0 w-56 bg-slate-800 rounded-xl shadow-lg border border-slate-600 z-40 overflow-hidden ${isOpen ? 'menu-enter pointer-events-auto' : 'menu-exit pointer-events-none opacity-0'}`}
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
                                    className={`${item.extraClass ?? ''} w-full flex items-center gap-4 py-2 px-4 rounded-lg mb-1 text-sm transition-all duration-150 ${
                                        item.disabled
                                            ? 'opacity-50 cursor-not-allowed bg-gray-100'
                                            : `bg-gradient-to-r ${item.color} ${item.hoverColor} text-white hover:scale-[1.01] active:scale-[0.99]`
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
                                            {item.loading ? 'Please wait...' : item.description}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default HamburgerMenu;
