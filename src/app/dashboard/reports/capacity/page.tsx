"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
    ChevronLeft, 
    Calendar, 
    BarChart3, 
    Users, 
    Clock, 
    Activity,
    Search,
    ChevronDown,
    ArrowRight
} from "lucide-react";
import Link from "next/link";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// --- MOCK DATA ---
const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const hours = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];

// Mock density data
const trainersList = ["Ahmet Yılmaz", "Ayşe Demir", "Mehmet Kaya", "Zeynep Aksoy", "Caner Yıldız"];
const lessonsList = ["Pilates Reformer", "Yoga Flow", "Crossfit Core", "Zumba Party", "Kick Boks"];

const densityData = days.map(day => hours.map(() => ({
    value: Math.floor(Math.random() * 100),
    trainer: trainersList[Math.floor(Math.random() * trainersList.length)],
    lesson: lessonsList[Math.floor(Math.random() * lessonsList.length)]
})));

const getDensityColor = (value: number) => {
    if (value < 20) return "bg-slate-50";
    if (value < 40) return "bg-blue-100 text-blue-800";
    if (value < 60) return "bg-blue-300 text-blue-900";
    if (value < 80) return "bg-blue-500 text-white";
    return "bg-blue-700 text-white";
};

export default function CapacityReportPage() {
    const [period, setPeriod] = useState("bu-hafta");
    const [isLoading, setIsLoading] = useState(false);

    const handleRefresh = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 800);
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
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                                <span className="text-blue-600">Kapasite</span> Raporu
                            </h1>
                            <p className="text-sm text-slate-500 font-medium italic">Katılım yoğunluğu ve verimlilik analizi.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Select value={period} onValueChange={setPeriod}>
                            <SelectTrigger className="w-[180px] bg-white border-slate-200 font-bold text-slate-700 h-10 shadow-sm">
                                <Calendar className="mr-2 h-4 w-4 text-blue-500" />
                                <SelectValue placeholder="Dönem Seçin" />
                            </SelectTrigger>
                            <SelectContent className="border-slate-200 shadow-xl">
                                <SelectItem value="gecen-ay">Geçen Ay</SelectItem>
                                <SelectItem value="mevcut-ay">Mevcut Ay</SelectItem>
                                <SelectItem value="gecen-hafta">Geçen Hafta</SelectItem>
                                <SelectItem value="bu-hafta">Bu Hafta</SelectItem>
                                <SelectItem value="sonraki-hafta">Sonraki Hafta</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button 
                            onClick={handleRefresh}
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-xs px-6 h-10 shadow-lg shadow-blue-100"
                        >
                            {isLoading ? "Yükleniyor..." : "Analiz Et"}
                        </Button>
                    </div>
                </div>

                {/* KPI Section */}
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-500 ${isLoading ? 'opacity-50 grayscale' : ''}`}>
                    <Card className="border-slate-200 shadow-sm border-l-4 border-l-blue-600">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-bold text-slate-500 uppercase">Ortalama Doluluk</p>
                                <Activity className="text-blue-600 h-5 w-5" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900">%68.4</h3>
                            <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
                                <BarChart3 size={12} />
                                %4.2 artış
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm border-l-4 border-l-indigo-600">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-bold text-slate-500 uppercase">Pik Saatler</p>
                                <Clock className="text-indigo-600 h-5 w-5" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900">18:00 - 21:00</h3>
                            <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">İş Çıkışı Yoğunluğu</p>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm border-l-4 border-l-emerald-600">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-bold text-slate-500 uppercase">Kapasite Verimliliği</p>
                                <Users className="text-emerald-600 h-5 w-5" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900">%82</h3>
                            <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">Optimize Edilmiş Seanslar</p>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm border-l-4 border-l-amber-600">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-bold text-slate-500 uppercase">Bekleyen Rezervasyon</p>
                                <Calendar className="text-amber-600 h-5 w-5" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900">142</h3>
                            <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">Gelecek Haftaya Aktarım</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Density Matrix (Yoğunluk Haritası) */}
                <Card className="border-slate-200 shadow-md overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-6 px-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                                    <Activity className="text-blue-600" />
                                    Katılımcı Yoğunluk Haritası
                                </CardTitle>
                                <CardDescription className="text-slate-500 font-medium mt-1">
                                    Haftalık ders saatlerine göre üye katılım yoğunluğu ve doluluk oranları.
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded bg-slate-100 border border-slate-200" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Düşük</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded bg-blue-300" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Orta</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded bg-blue-700" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Yüksek</span>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="relative overflow-x-auto">
                            <div className="min-w-[800px]">
                                {/* Header Row (Days) */}
                                <div className="grid grid-cols-[100px_repeat(7,1fr)] mb-4">
                                    <div /> {/* Spacer for Time column */}
                                    {days.map(day => (
                                        <div key={day} className="text-center">
                                            <span className="text-xs font-black text-slate-700 uppercase tracking-wider">{day}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Data Rows (Hours) */}
                                {hours.map((hour, hourIdx) => (
                                    <div key={hour} className="grid grid-cols-[100px_repeat(7,1fr)] gap-2 mb-2">
                                        <div className="flex items-center justify-end pr-4">
                                            <span className="text-xs font-bold text-slate-500">{hour}</span>
                                        </div>
                                        {days.map((_, dayIdx) => {
                                            const item = densityData[dayIdx][hourIdx];
                                            return (
                                                <div 
                                                    key={dayIdx} 
                                                    className={`h-24 rounded-xl border border-white/50 flex flex-col items-center justify-center transition-all hover:scale-105 hover:shadow-lg cursor-pointer group p-2 text-center ${getDensityColor(item.value)}`}
                                                >
                                                    <span className="text-sm font-black opacity-90">%{item.value} <span className="text-[10px] font-bold opacity-60">Doluluk</span></span>
                                                    <div className="mt-1 flex flex-col items-center">
                                                        <span className="text-[10px] font-black uppercase truncate max-w-full leading-tight">{item.lesson}</span>
                                                        <span className="text-[9px] font-bold opacity-70 truncate max-w-full italic">{item.trainer}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>



                {/* Additional Stats Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-bold text-slate-800">En Çok Açılan Dersler & Kapasite</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { name: "Pilates Reformer", sessions: 420, capacityPct: 92, color: "bg-blue-600" },
                                { name: "Yoga Flow", sessions: 310, capacityPct: 78, color: "bg-indigo-600" },
                                { name: "Crossfit Core", sessions: 540, capacityPct: 85, color: "bg-emerald-600" },
                                { name: "Zumba Party", sessions: 280, capacityPct: 62, color: "bg-amber-600" },
                            ].map((item, i) => (
                                <div key={i} className="p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-10 w-10 rounded-xl ${item.color} flex items-center justify-center text-white`}>
                                                <Activity size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{item.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">{item.sessions} Toplam Seans</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-black text-slate-900">%{item.capacityPct}</span>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase">Doluluk</p>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
                                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.capacityPct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm bg-blue-600 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Activity size={200} />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-white text-xl font-black uppercase">Kapasite Tavsiyesi</CardTitle>
                            <CardDescription className="text-blue-100 font-medium italic">Veri analizi sonucunda yapay zeka önerileri.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 relative z-10">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                <p className="text-sm font-medium leading-relaxed">
                                    "Salı günü 18:00 seanslarında %95 doluluk oranına ulaşıldı. Bu saat dilimine ek bir seans veya eğitmen ataması yaparak beklemedeki 24 üyeyi sisteme dahil edebilirsiniz."
                                </p>
                                <Button className="mt-4 bg-white text-blue-600 font-black hover:bg-blue-50 w-full rounded-xl">
                                    Seans Planla
                                    <ArrowRight size={16} className="ml-2" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                                    <p className="text-[10px] font-bold uppercase opacity-70">En Verimli Gün</p>
                                    <p className="text-lg font-black">Çarşamba</p>
                                </div>
                                <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                                    <p className="text-[10px] font-bold uppercase opacity-70">Genişleme Potansiyeli</p>
                                    <p className="text-lg font-black">%24.5</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
