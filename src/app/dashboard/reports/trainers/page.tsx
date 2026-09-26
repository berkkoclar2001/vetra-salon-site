"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
    ChevronLeft, 
    Users, 
    Dumbbell, 
    Calendar, 
    UserCheck,
    Search,
    Clock,
    TrendingUp,
    Star,
    Fingerprint,
    Info,
    History
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

// --- MOCK DATA ---
const trainerData = [
    { 
        id: 1, 
        name: "Ahmet Yılmaz", 
        lesson: "Pilates Reformer", 
        sessions: 42, 
        reservations: 168, 
        uniqueMembers: 24, 
        rating: 4.9,
        lastEntryDate: "15.03.2024 09:15",
        assignedMembers: [
            { name: "Berk Aydın", lastEntry: "15.03.2024 10:00" },
            { name: "Selin Yılmaz", lastEntry: "14.03.2024 18:30" },
            { name: "Can Yıldız", lastEntry: "15.03.2024 08:45" }
        ],
        turnstileHistory: ["15.03.2024 09:12", "14.03.2024 08:55", "13.03.2024 09:05"]
    },
    { 
        id: 2, 
        name: "Ayşe Demir", 
        lesson: "Yoga Flow", 
        sessions: 38, 
        reservations: 145, 
        uniqueMembers: 18, 
        rating: 4.8,
        lastEntryDate: "15.03.2024 10:30",
        assignedMembers: [
            { name: "Derya Deniz", lastEntry: "15.03.2024 11:00" },
            { name: "Mert Kar", lastEntry: "14.03.2024 14:20" }
        ],
        turnstileHistory: ["15.03.2024 10:25", "14.03.2024 10:15"]
    },
    { 
        id: 3, 
        name: "Mehmet Kaya", 
        lesson: "Crossfit", 
        sessions: 56, 
        reservations: 210, 
        uniqueMembers: 32, 
        rating: 4.7,
        lastEntryDate: "15.03.2024 07:45",
        assignedMembers: [
            { name: "Ali Vural", lastEntry: "15.03.2024 08:00" }
        ],
        turnstileHistory: ["15.03.2024 07:40", "14.03.2024 07:35"]
    },
    { 
        id: 4, 
        name: "Zeynep Aksoy", 
        lesson: "Zumba", 
        sessions: 24, 
        reservations: 180, 
        uniqueMembers: 45, 
        rating: 5.0,
        lastEntryDate: "14.03.2024 19:00",
        assignedMembers: [],
        turnstileHistory: ["14.03.2024 18:55"]
    }
];

export default function TrainerReportsPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredTrainers = trainerData.filter(trainer => 
        trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trainer.lesson.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 pb-20">
            <div className="max-w-[1400px] mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <Link 
                            href="/dashboard/reports"
                            className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-600 shadow-sm"
                        >
                            <ChevronLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                                <span className="text-blue-600">Eğitmen</span> Raporları
                            </h1>
                            <p className="text-sm text-slate-500 font-medium italic">Eğitmen bazlı performans ve katılım analizi.</p>
                        </div>
                    </div>

                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <Input 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Eğitmen veya ders ara..." 
                            className="pl-12 bg-white border-slate-200 h-12 rounded-2xl shadow-sm focus-visible:ring-blue-500 transition-all font-medium"
                        />
                    </div>
                </div>

                {/* Trainer Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredTrainers.map((trainer) => (
                        <Card key={trainer.id} className="group border-slate-200 shadow-sm hover:shadow-2xl hover:border-blue-200 transition-all duration-300 overflow-hidden bg-white flex flex-col">
                            <CardHeader className="pb-4 relative">
                                <div className="absolute top-6 right-6 flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded-lg border border-amber-100">
                                    <Star size={12} className="fill-amber-600" />
                                    <span className="text-[10px] font-black">{trainer.rating}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-200 group-hover:rotate-3 transition-transform duration-300">
                                        {trainer.name.charAt(0)}
                                    </div>
                                    <div className="space-y-1">
                                        <CardTitle className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{trainer.name}</CardTitle>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                            <span className="flex items-center gap-1 text-blue-600">
                                                <Calendar size={12} />
                                                Giriş: {trainer.lastEntryDate}
                                            </span>
                                            <span className="text-slate-300">|</span>
                                            <span className="flex items-center gap-1 text-indigo-600">
                                                <Dumbbell size={12} />
                                                Ders: {trainer.lesson}
                                            </span>
                                            <span className="text-slate-300">|</span>
                                            <span className="flex items-center gap-1 text-emerald-600">
                                                <Users size={12} />
                                                {trainer.uniqueMembers} Öğrenci
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6 flex-grow">
                                {/* Action Buttons Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Atalı Üyeler Butonu */}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4 rounded-2xl border-slate-100 bg-slate-50/50 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all group/btn">
                                                <div className="p-2 bg-white rounded-xl shadow-sm group-hover/btn:bg-blue-600 group-hover/btn:text-white transition-colors">
                                                    <UserCheck size={20} />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-tighter">Atalı Üyeler</span>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-md bg-white rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
                                            <div className="bg-blue-600 p-6 text-white">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                                                        <UserCheck size={24} />
                                                    </div>
                                                    <DialogTitle className="text-xl font-black uppercase tracking-tight">Atalı Üyeler ve Girişleri</DialogTitle>
                                                </div>
                                                <p className="text-blue-100 text-sm italic">{trainer.name} eğitmenine tanımlı aktif üyeler.</p>
                                            </div>
                                            <div className="p-6 max-h-[400px] overflow-y-auto space-y-3">
                                                {trainer.assignedMembers.length > 0 ? trainer.assignedMembers.map((member, i) => (
                                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-black">
                                                                {member.name.charAt(0)}
                                                            </div>
                                                            <span className="font-bold text-slate-900">{member.name}</span>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[9px] font-bold text-slate-400 uppercase">Son Giriş</p>
                                                            <p className="text-xs font-black text-slate-600">{member.lastEntry}</p>
                                                        </div>
                                                    </div>
                                                )) : (
                                                    <div className="text-center py-10 text-slate-400 italic text-sm">Tanımlı üye bulunamadı.</div>
                                                )}
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                    {/* Turnike Girişleri Butonu */}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4 rounded-2xl border-slate-100 bg-slate-50/50 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 transition-all group/btn">
                                                <div className="p-2 bg-white rounded-xl shadow-sm group-hover/btn:bg-emerald-600 group-hover/btn:text-white transition-colors">
                                                    <Fingerprint size={20} />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-tighter">Turnike Girişleri</span>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-md bg-white rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
                                            <div className="bg-emerald-600 p-6 text-white">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                                                        <Fingerprint size={24} />
                                                    </div>
                                                    <DialogTitle className="text-xl font-black uppercase tracking-tight">Eğitmen Turnike Girişi</DialogTitle>
                                                </div>
                                                <p className="text-emerald-100 text-sm italic">{trainer.name} için son giriş kayıtları.</p>
                                            </div>
                                            <div className="p-6 max-h-[400px] overflow-y-auto space-y-3">
                                                {trainer.turnstileHistory.map((time, i) => (
                                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                        <div className="flex items-center gap-3 text-slate-600">
                                                            <History size={16} className="text-emerald-500" />
                                                            <span className="font-bold">Giriş Kaydı</span>
                                                        </div>
                                                        <span className="text-sm font-black text-slate-900">{time}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                {/* Summary Stats */}
                                <div className="bg-slate-900 rounded-2xl p-4 text-white relative overflow-hidden group-hover:bg-blue-900 transition-colors">
                                    <div className="flex items-center justify-between relative z-10">
                                        <div>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Kapasite Doluluk</p>
                                            <p className="text-lg font-black tracking-tight">%{Math.floor(Math.random() * 30) + 70}</p>
                                        </div>
                                        <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-xs">
                                            {trainer.reservations}
                                        </div>
                                    </div>
                                    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-150 transition-transform duration-700">
                                        <TrendingUp size={80} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {filteredTrainers.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <Search size={48} className="mb-4 opacity-10" />
                        <p className="font-bold uppercase text-sm tracking-widest">Aramanızla eşleşen eğitmen bulunamadı.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
