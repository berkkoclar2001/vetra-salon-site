"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    ChevronLeft, 
    Users, 
    Calendar, 
    UserCheck,
    Search,
    Dumbbell,
    Clock,
    LayoutList,
    BarChart2
} from "lucide-react";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    Cell 
} from "recharts";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";

// --- CONSTANTS ---
const months = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", 
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];
const years = ["2023", "2024", "2025", "2026"];

// --- MOCK DATA ---
const agendaData = [
    { id: 1, trainer: "Ahmet Yılmaz", lesson: "Pilates Reformer", sessions: 42, reservations: 168, uniqueMembers: 24 },
    { id: 2, trainer: "Ayşe Demir", lesson: "Yoga Flow", sessions: 38, reservations: 145, uniqueMembers: 18 },
    { id: 3, trainer: "Mehmet Kaya", lesson: "Crossfit", sessions: 56, reservations: 210, uniqueMembers: 32 },
    { id: 4, trainer: "Zeynep Aksoy", lesson: "Zumba", sessions: 24, reservations: 180, uniqueMembers: 45 },
    { id: 5, trainer: "Caner Yıldız", lesson: "Kick Boks", sessions: 48, reservations: 96, uniqueMembers: 12 },
];

const classesGrowthData = [
    { name: "Pilates", count: 420, color: "#3b82f6" },
    { name: "Yoga", count: 310, color: "#8b5cf6" },
    { name: "Crossfit", count: 540, color: "#ec4899" },
    { name: "Zumba", count: 280, color: "#f59e0b" },
    { name: "Kick Boks", count: 190, color: "#10b981" },
    { name: "Fitness", count: 650, color: "#0ea5e9" },
];

const popularTrainersData = [
    { name: "Ahmet Y.", value: 850, color: "#3b82f6" },
    { name: "Ayşe D.", value: 720, color: "#8b5cf6" },
    { name: "Mehmet K.", value: 940, color: "#ec4899" },
    { name: "Zeynep A.", value: 680, color: "#f59e0b" },
    { name: "Caner Y.", value: 510, color: "#10b981" },
];

export default function AgendaReportsPage() {
    const [viewMode, setViewMode] = useState<'chart' | 'list'>('chart');
    const [trainerListViewMode, setTrainerListViewMode] = useState<'chart' | 'list'>('chart');
    const [selectedMonth, setSelectedMonth] = useState<string>("Mart");
    const [selectedYear, setSelectedYear] = useState<string>("2026");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setViewMode(prev => prev === 'chart' ? 'list' : 'chart');
            setTrainerListViewMode(prev => prev === 'chart' ? 'list' : 'chart');
        }, 15000);
        return () => clearInterval(interval);
    }, [viewMode, trainerListViewMode]);

    const handleFetchData = () => {
        setIsLoading(true);
        // Mocking data fetch delay
        setTimeout(() => {
            setIsLoading(false);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 pb-20">
            <div className="max-w-[1400px] mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link 
                            href="/dashboard/reports"
                            className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-600 shadow-sm"
                        >
                            <ChevronLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Ajanda Raporları</h1>
                            <p className="text-sm text-slate-500 font-medium italic">Randevu ve planlama verilerinin özet tablosu.</p>
                        </div>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input 
                            placeholder="Ara..." 
                            className="pl-10 bg-white border-slate-200"
                        />
                    </div>
                </div>

                {/* Agenda Performance Table */}
                <Card className="border-slate-200 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                            <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 shrink-0">
                                <Calendar size={18} className="text-blue-600" />
                                Ajanda Detay Analizi
                            </CardTitle>
                            
                            <div className="flex flex-wrap items-center gap-2">
                                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                    <SelectTrigger className="w-[120px] h-9 bg-white border-slate-200 text-xs font-bold ring-offset-0 focus:ring-1 focus:ring-blue-500">
                                        <SelectValue placeholder="Ay" />
                                    </SelectTrigger>
                                    <SelectContent className="border-slate-200 shadow-xl">
                                        {months.map(m => (
                                            <SelectItem key={m} value={m} className="text-xs font-medium focus:bg-blue-50 focus:text-blue-700">
                                                {m}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={selectedYear} onValueChange={setSelectedYear}>
                                    <SelectTrigger className="w-[90px] h-9 bg-white border-slate-200 text-xs font-bold ring-offset-0 focus:ring-1 focus:ring-blue-500">
                                        <SelectValue placeholder="Yıl" />
                                    </SelectTrigger>
                                    <SelectContent className="border-slate-200 shadow-xl">
                                        {years.map(y => (
                                            <SelectItem key={y} value={y} className="text-xs font-medium focus:bg-blue-50 focus:text-blue-700">
                                                {y}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Button 
                                    onClick={handleFetchData}
                                    disabled={isLoading}
                                    variant="default"
                                    className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-tighter flex items-center gap-2 shadow-sm shadow-blue-100 transition-all active:scale-95 disabled:opacity-70"
                                >
                                    {isLoading ? (
                                        <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                        <RefreshCw size={14} />
                                    )}
                                    Getir
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/30 hover:bg-slate-50/30 border-b border-slate-100">
                                    <TableHead className="font-bold text-slate-700 h-12 px-6">EĞİTMEN</TableHead>
                                    <TableHead className="font-bold text-slate-700 h-12">DERS</TableHead>
                                    <TableHead className="font-bold text-slate-700 h-12 text-center">SEANS</TableHead>
                                    <TableHead className="font-bold text-slate-700 h-12 text-center">REZERVASYON</TableHead>
                                    <TableHead className="font-bold text-slate-700 h-12 text-center">FARKLI ÜYE</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className={isLoading ? "opacity-40 pointer-events-none transition-opacity duration-300" : "transition-opacity duration-300"}>
                                {agendaData.map((item) => (
                                    <TableRow key={item.id} className="hover:bg-blue-50/30 transition-colors border-b border-slate-100">
                                        <TableCell className="font-bold text-slate-900 py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-black">
                                                    {item.trainer.charAt(0)}
                                                </div>
                                                {item.trainer}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium text-slate-600 truncate max-w-[200px]">
                                            <div className="flex items-center gap-2">
                                                <Dumbbell size={14} className="text-slate-400" />
                                                {item.lesson}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className="bg-slate-100 text-slate-700 font-black text-xs px-3 py-1 rounded-full border border-slate-200">
                                                {item.sessions}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className="bg-blue-50 text-blue-700 font-black text-xs px-3 py-1 rounded-full border border-blue-100">
                                                {item.reservations}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-1.5 text-slate-900 font-black">
                                                <Users size={14} className="text-slate-400" />
                                                {item.uniqueMembers}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* All-time Opened Classes Chart/List Toggle */}
                    <Card className="border-slate-200 shadow-sm overflow-hidden h-[360px]">
                        <CardHeader className="py-4 border-b border-slate-50 bg-slate-50/30 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                                <Dumbbell size={18} className="text-blue-600" />
                                Tüm Zamanların Açılan Dersleri
                            </CardTitle>
                            <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-slate-100 shadow-sm">
                                <button 
                                    onClick={() => setViewMode('chart')}
                                    className={`p-1.5 rounded-lg transition-all ${viewMode === 'chart' ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "text-slate-400 hover:bg-slate-50"}`}
                                    title="Grafik Görünümü"
                                >
                                    <BarChart2 size={16} />
                                </button>
                                <button 
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "text-slate-400 hover:bg-slate-50"}`}
                                    title="Liste Görünümü"
                                >
                                    <LayoutList size={16} />
                                </button>
                                <div className="ml-1 pr-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Oto</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 relative">
                            <div className="h-[250px] w-full transition-all duration-500">
                                {viewMode === 'chart' ? (
                                    <div className="animate-in fade-in zoom-in-95 duration-500 h-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={classesGrowthData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis 
                                                    dataKey="name" 
                                                    axisLine={false} 
                                                    tickLine={false} 
                                                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                                                    dy={10}
                                                />
                                                <YAxis 
                                                    axisLine={false} 
                                                    tickLine={false} 
                                                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                                                />
                                                <Tooltip 
                                                    cursor={{ fill: '#f8fafc' }}
                                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                                />
                                                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={35}>
                                                    {classesGrowthData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="animate-in fade-in slide-in-from-right-4 duration-500 h-full overflow-y-auto pr-2 custom-scrollbar">
                                        <div className="space-y-2">
                                            {[...classesGrowthData].sort((a,b) => b.count - a.count).map((item, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: item.color }}>
                                                            {idx + 1}
                                                        </div>
                                                        <span className="font-bold text-slate-700">{item.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg font-black text-slate-900">{item.count.toLocaleString()}</span>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Seans</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Popular Trainers Chart */}
                    <Card className="border-slate-200 shadow-sm overflow-hidden h-[360px]">
                        <CardHeader className="py-4 border-b border-slate-50 bg-slate-50/30 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                                <UserCheck size={18} className="text-blue-600" />
                                Tüm Zamanların Popüler Eğitmenleri
                            </CardTitle>
                            <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-slate-100 shadow-sm">
                                <button 
                                    onClick={() => setTrainerListViewMode('chart')}
                                    className={`p-1.5 rounded-lg transition-all ${trainerListViewMode === 'chart' ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "text-slate-400 hover:bg-slate-50"}`}
                                    title="Grafik Görünümü"
                                >
                                    <BarChart2 size={16} />
                                </button>
                                <button 
                                    onClick={() => setTrainerListViewMode('list')}
                                    className={`p-1.5 rounded-lg transition-all ${trainerListViewMode === 'list' ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "text-slate-400 hover:bg-slate-50"}`}
                                    title="Liste Görünümü"
                                >
                                    <LayoutList size={16} />
                                </button>
                                <div className="ml-1 pr-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Oto</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 relative">
                            <div className="h-[250px] w-full transition-all duration-500">
                                {trainerListViewMode === 'chart' ? (
                                    <div className="animate-in fade-in zoom-in-95 duration-500 h-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={popularTrainersData} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                                <XAxis type="number" hide />
                                                <YAxis 
                                                    dataKey="name" 
                                                    type="category" 
                                                    axisLine={false} 
                                                    tickLine={false}
                                                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                                                    width={80}
                                                />
                                                <Tooltip 
                                                    cursor={{ fill: '#f8fafc' }}
                                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                                />
                                                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={25}>
                                                    {popularTrainersData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="animate-in fade-in slide-in-from-right-4 duration-500 h-full overflow-y-auto pr-2 custom-scrollbar">
                                        <div className="space-y-2">
                                            {[...popularTrainersData].sort((a,b) => b.value - a.value).map((item, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: item.color }}>
                                                            {idx + 1}
                                                        </div>
                                                        <span className="font-bold text-slate-700">{item.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg font-black text-slate-900">{item.value.toLocaleString()}</span>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Puan</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Summary Info */}
                <div className="flex items-center justify-end gap-6 px-2 text-slate-500 text-sm font-medium">
                    <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>Son güncelleme: Az önce</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

