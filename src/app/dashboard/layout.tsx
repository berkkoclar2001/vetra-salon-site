import type { Metadata } from "next";
import Sidebar from "@/components/layout/Sidebar";

export const metadata: Metadata = {
    robots: { index: false, follow: false },
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-slate-50">

            {/* Sidebar - Fix Position Left */}
            <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
                <aside className="border-r bg-white h-full w-full">
                    <Sidebar />
                </aside>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 md:pl-64 w-full overflow-x-hidden">
                <div className="p-4 md:p-8 max-w-7xl w-full space-y-8">
                    {children}
                </div>
            </main>

        </div>
    );
}
