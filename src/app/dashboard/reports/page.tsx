"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    BarChart3,
    TrendingUp, 
    Users, 
    CreditCard, 
    Activity, 
    PieChart as PieIcon,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    ChevronRight,
    ChevronDown
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { getMembers } from "@/lib/services/memberService";
import { Member } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    Cell,
    PieChart,
    Pie,
    Legend
} from "recharts";

const genderData = [
    { name: "Erkek", value: 65, color: "#2563eb" }, // blue-600
    { name: "Kadın", value: 35, color: "#db2777" }, // pink-600
];

const statusData = [
    { name: "Aktif", value: 850, color: "#10b981" }, // emerald-500
    { name: "Pasif", value: 240, color: "#64748b" }, // slate-500
    { name: "Beklemede", value: 158, color: "#f59e0b" }, // amber-500
];

// Helper to generate last 6 months data dynamically
const generateGrowthData = () => {
    const months = ["Oca", "Sub", "Mar", "Nis", "May", "Haz", "Tem", "Agu", "Eyl", "Eki", "Kas", "Ara"];
    const result = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        result.push({
            month: months[d.getMonth()],
            count: Math.floor(Math.random() * (100 - 40) + 40) // Mock data for now
        });
    }
    return result;
};

const growthData = generateGrowthData();

export default function ReportsPage() {
    const [allMembers, setAllMembers] = useState<Member[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Member[]>([]);
    const [isExtraVisible, setIsExtraVisible] = useState(false);

    const extraPages = [
        "Üye Raporları", 
        "Finansal Raporlar", 
        "Ajanda Raporları", 
        "Kapasite Raporu", 
        "Rezervasyon Raporları", 
        "Borç Raporları", 
        "Eğitmen Raporları", 
        "Hakediş Raporu",
        "Dondurma Raporları", 
        "Üyelik Raporları", 
        "Vitamin Bar Raporları", 
        "Tüm Hareketler", 
        "Üyelik Durumu", 
        "Yenileme Dökümü", 
        "Giriş Çıkış Hareketleri", 
        "Sanal POS Dökümü"
    ];

    useEffect(() => {
        loadMembers();
    }, []);

    const loadMembers = async () => {
        const members = await getMembers();
        setAllMembers(members);
    };

    useEffect(() => {
        if (searchQuery.length > 1) {
            const filtered = allMembers.filter(m => 
                m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.phone.includes(searchQuery)
            ).slice(0, 5);
            setSearchResults(filtered);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery, allMembers]);

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 pb-20">
            <div className="max-w-[1400px] mx-auto space-y-6">
                {/* Başlık ve Arama */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Raporlar ve Analizler</h1>
                            <button 
                                onClick={() => setIsExtraVisible(!isExtraVisible)}
                                className={`group flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-500 ease-out active:scale-95 ${
                                    isExtraVisible 
                                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 shadow-lg shadow-blue-200" 
                                    : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md hover:-translate-y-0.5"
                                }`}
                            >
                                <span className={`text-xs font-bold tracking-wide uppercase ${isExtraVisible ? "text-white" : "text-slate-600 group-hover:text-blue-600"}`}>
                                    {isExtraVisible ? "Paneli Kapat" : "Tüm Raporlar"}
                                </span>
                                <div className={`transition-transform duration-500 ${isExtraVisible ? "rotate-180" : "group-hover:translate-x-0.5"}`}>
                                    {isExtraVisible ? <ChevronDown size={20} className="stroke-[2.5px]" /> : <ChevronRight size={20} className="stroke-[2.5px]" />}
                                </div>
                            </button>
                        </div>
                        <p className="text-sm text-slate-500 font-medium">İşletmenizin performansını detaylı verilerle takip edin.</p>
                    </div>

                    <div className="relative w-full md:w-80">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input 
                                placeholder="Üye ara (İsim veya Tel)..." 
                                className="pl-10 bg-white border-slate-200"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        {searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                                {searchResults.map(member => (
                                    <Link 
                                        key={member.id} 
                                        href={`/dashboard/members/${member.id}`}
                                        className="flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={member.avatar} />
                                            <AvatarFallback className="bg-slate-100 text-slate-600 text-[10px]">
                                                {member.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{member.name}</p>
                                            <p className="text-[10px] text-slate-500">{member.phone}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Dinamik Ek Sayfalar Bölümü */}
                {isExtraVisible && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-6 duration-700 ease-out">
                        {extraPages.map((page, index) => {
                            const isMemberReport = page === "Üye Raporları";
                            const isFinanceReport = page === "Finansal Raporlar";
                            const isAgendaReport = page === "Ajanda Raporları";
                            const isTrainerReport = page === "Eğitmen Raporları";
                            const isPayrollReport = page === "Hakediş Raporu";
                            const isCapacityReport = page === "Kapasite Raporu";
                            const isReservationReport = page === "Rezervasyon Raporları";
                            const isDebtReport = page === "Borç Raporları";
                            const isFreezeReport = page === "Dondurma Raporları";
                            const isMembershipReport = page === "Üyelik Raporları";
                            let href = "#";
                            if (isMemberReport) href = "/dashboard/reports/members";
                            if (isFinanceReport) href = "/dashboard/reports/finance";
                            if (isAgendaReport) href = "/dashboard/reports/agenda";
                            if (isTrainerReport) href = "/dashboard/reports/trainers";
                            if (isPayrollReport) href = "/dashboard/reports/payroll";
                            if (isCapacityReport) href = "/dashboard/reports/capacity";
                            if (isReservationReport) href = "/dashboard/reports/reservations";
                            if (isDebtReport) href = "/dashboard/reports/debts";
                            if (isFreezeReport) href = "/dashboard/reports/freezes";
                            if (isMembershipReport) href = "/dashboard/reports/memberships";

                            return (
                                <Link 
                                    key={index} 
                                    href={href}
                                    className={`relative overflow-hidden border-slate-200 bg-white hover:bg-slate-50 hover:border-blue-400 cursor-pointer transition-all duration-300 group rounded-xl border flex flex-col hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1`}
                                >
                                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <BarChart3 className="h-12 w-12 text-blue-600" />
                                    </div>
                                    <CardContent className="p-5 flex items-center justify-between z-10">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                                isMemberReport 
                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                                                : "bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600"
                                            }`}>
                                                <PieIcon size={18} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={`text-sm font-bold tracking-tight transition-colors ${
                                                    isMemberReport ? "text-slate-900" : "text-slate-600 group-hover:text-slate-900"
                                                }`}>
                                                    {page}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-medium group-hover:text-blue-500">Görüntülemek için tıkla</span>
                                            </div>
                                        </div>
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                            isMemberReport ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-300 group-hover:bg-blue-600 group-hover:text-white"
                                        }`}>
                                            <ChevronRight size={16} className="transform group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                    </CardContent>
                                    <div className={`h-1 w-full mt-auto transition-transform duration-500 origin-left scale-x-0 group-hover:scale-x-100 ${
                                        isMemberReport ? "bg-blue-600" : "bg-blue-400"
                                    }`} />
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Özet İstatistikler */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { title: "Toplam Üyeler", value: "1.248", trend: "+5.2%", up: true, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                        { title: "Toplam Ciro", value: "₺284.500", trend: "+12.4%", up: true, icon: CreditCard, color: "text-green-600", bg: "bg-green-50" },
                        { title: "Aktif Katılım", value: "%76", trend: "+2.1%", up: true, icon: Activity, color: "text-purple-600", bg: "bg-purple-50" },
                        { title: "İptal Oranı", value: "%3.2", trend: "-0.5%", up: false, icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
                    ].map((stat, i) => (
                        <Card key={i} className="border-slate-200 shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className={stat.bg + " p-2 rounded-lg"}>
                                        <stat.icon size={20} className={stat.color} />
                                    </div>
                                    <div className={`flex items-center gap-1 text-xs font-bold ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
                                        {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                        {stat.trend}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                                    <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* GRAFİK SATIRI 1: Üye Durumu ve Artış */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="border-slate-200 shadow-sm overflow-hidden flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">Üye Durum Dağılımı</CardTitle>
                            <CardDescription>Toplam üyelerin güncel durumu.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col items-center justify-center pt-0 pb-8">
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={8}
                                            dataKey="value"
                                        >
                                            {statusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            formatter={(value) => [`${value} Kişi`, 'Sayı']}
                                        />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 grid grid-cols-3 gap-4 w-full px-2">
                                {statusData.map((item, i) => (
                                    <div key={i} className="text-center">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">{item.name}</p>
                                        <p className="text-sm font-black text-slate-700">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2 border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">Aylık Üye Artış Grafiği</CardTitle>
                            <CardDescription>Son 6 ayın üyelik trendleri.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[350px] pt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={growthData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis 
                                        dataKey="month" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#64748b', fontSize: 12 }} 
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                    />
                                    <Tooltip 
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* GRAFİK SATIRI 2: Cinsiyet ve Popüler Dersler */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="border-slate-200 shadow-sm overflow-hidden flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">Cinsiyet Dağılımı</CardTitle>
                            <CardDescription>Üye tabanının demografik yapısı.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-row items-center justify-between pb-8">
                            <div className="h-[150px] w-1/2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={genderData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={60}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {genderData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="w-1/2 space-y-4 pr-8">
                                {genderData.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="text-sm font-medium text-slate-600">{item.name}</span>
                                        </div>
                                        <span className="text-sm font-black text-slate-900">%{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2 border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">Popüler Dersler</CardTitle>
                            <CardDescription>En çok ilgi gören grup çalışmaları.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100">
                                {[
                                    { name: "Crossfit", count: 145, pct: 85, color: "bg-blue-600" },
                                    { name: "Pilates", count: 122, pct: 72, color: "bg-emerald-600" },
                                    { name: "Spinning", count: 98, pct: 58, color: "bg-amber-600" },
                                    { name: "Yoga", count: 86, pct: 51, color: "bg-purple-600" },
                                ].map((item, i) => (
                                    <div key={i} className="p-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors">
                                        <div className="flex-1">
                                            <div className="flex justify-between mb-1">
                                                <p className="text-sm font-bold text-slate-800">{item.name}</p>
                                                <span className="text-xs font-black text-slate-400">{item.count} Kayıt</span>
                                            </div>
                                            <div className="w-full bg-slate-100 h-1.5 rounded-full">
                                                <div 
                                                    className={`${item.color} h-1.5 rounded-full transition-all duration-500`} 
                                                    style={{ width: `${item.pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
