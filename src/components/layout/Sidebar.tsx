"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    Calendar,
    CreditCard,
    Settings,
    LogOut,
    Dumbbell,
    ClipboardList,
    BarChart3,
    ShoppingBasket,
    BellRing
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const menuItems = [
    {
        title: "Panel",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Randevular",
        href: "/dashboard/appointments",
        icon: Calendar,
    },
    {
        title: "Üyeler",
        href: "/dashboard/members",
        icon: Users,
    },
    {
        title: "Personel",
        href: "/dashboard/staff",
        icon: Users,
    },
    {
        title: "Finansman",
        href: "/dashboard/finance",
        icon: CreditCard,
    },
    {
        title: "Salon Marketi",
        href: "/dashboard/market",
        icon: ShoppingBasket,
    },
    {
        title: "Bildirim Merkezi",
        href: "/dashboard/notifications",
        icon: BellRing,
    },
    {
        title: "Salon Yönetimi",
        href: "/dashboard/management",
        icon: Dumbbell,
    },
    {
        title: "Tanımlamalar",
        href: "/dashboard/definitions",
        icon: ClipboardList,
    },
    {
        title: "Raporlar",
        href: "/dashboard/reports",
        icon: BarChart3,
    },
    {
        title: "Ayarlar",
        href: "/dashboard/settings",
        icon: Settings,
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    return (
        <div className="flex flex-col h-full w-64 bg-white border-r border-slate-200 shadow-sm fixed left-0 top-0">

            {/* Logo Alanı */}
            <div className="p-6 border-b border-slate-100">
                <Link href="/dashboard" className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg shadow-sm border border-slate-100">
                        <Image
                            src="/vetra.jpeg"
                            alt="Vetra Logo"
                            fill
                            className="object-contain p-1"
                        />
                    </div>
                    <div>
                        <span className="block text-base font-bold text-slate-900 tracking-tight leading-snug">Vetra App Software</span>
                        <span className="block text-xs text-slate-500 font-medium">Yönetim Paneli</span>
                    </div>
                </Link>
            </div>

            {/* Menü */}
            <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {menuItems.filter(item => {
                    // Finans, Personel ve Salon Yönetimi sadece Admin'e açık
                    const adminOnly = ['Finansman', 'Personel', 'Salon Yönetimi', 'Tanımlamalar', 'Raporlar', 'Salon Marketi', 'Bildirim Merkezi'];
                    if (adminOnly.includes(item.title) && user?.role !== 'admin') {
                        return false;
                    }
                    return true;
                }).map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <div
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-slate-900 text-white shadow-md"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                )}
                            >
                                <item.icon size={20} className={cn(isActive ? "text-blue-400" : "text-slate-400")} />
                                {item.title}
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Alt Kısım: Kullanıcı Bilgisi ve Çıkış */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                            {user?.username || "Kullanıcı"}
                        </p>
                        <p className="text-xs text-slate-500 truncate capitalize">
                            {user?.role === "admin" ? "Yönetici" : "Personel"}
                        </p>
                    </div>
                </div>

                <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100"
                    onClick={logout}
                >
                    <LogOut size={16} className="mr-2" />
                    Çıkış Yap
                </Button>
            </div>

        </div>
    );
}
