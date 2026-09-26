"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    CreditCard, 
    Activity, 
    Dumbbell, 
    Calendar,
    ChevronLeft
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const topRevenueMembers = [
    { name: "Mehmet Demir", amount: "₺18.200", plan: "Yıllık Platin" },
    { name: "Ayşe Kaya", amount: "₺15.400", plan: "Yıllık Altın" },
    { name: "Can Özkan", amount: "₺12.900", plan: "6 Aylık Platin" },
    { name: "Elif Yıldız", amount: "₺11.800", plan: "Yıllık Standart" },
    { name: "Burak Yılmaz", amount: "₺10.500", plan: "Yıllık Altın" },
    { name: "Selin Ak", amount: "₺9.800", plan: "6 Aylık Altın" },
    { name: "Deniz Soylu", amount: "₺9.200", plan: "Yıllık Standart" },
    { name: "Mert Aydın", amount: "₺8.900", plan: "6 Aylık Gümüş" },
    { name: "Pınar Ege", amount: "₺8.400", plan: "Yıllık Standart" },
    { name: "Arda Tekin", amount: "₺7.900", plan: "6 Aylık Standart" },
];

const lessonParticipation = [
    { name: "Selin Ak", count: 42, favorite: "Crossfit" },
    { name: "Burak Yılmaz", count: 38, favorite: "Spinning" },
    { name: "Ayşe Kaya", count: 35, favorite: "Yoga" },
    { name: "Mehmet Demir", count: 32, favorite: "Crossfit" },
    { name: "Elif Yıldız", count: 30, favorite: "Pilates" },
    { name: "Can Özkan", count: 28, favorite: "Crossfit" },
    { name: "Pınar Ege", count: 25, favorite: "Pilates" },
    { name: "Mert Aydın", count: 24, favorite: "Spinning" },
    { name: "Arda Tekin", count: 22, favorite: "Yoga" },
    { name: "Deniz Soylu", count: 20, favorite: "Pilates" },
];

const entryParticipation = [
    { name: "Can Özkan", count: 64, lastEntry: "Bugün 09:12" },
    { name: "Mehmet Demir", count: 58, lastEntry: "Bugün 07:45" },
    { name: "Elif Yıldız", count: 52, lastEntry: "Dün 18:30" },
    { name: "Burak Yılmaz", count: 48, lastEntry: "Dün 14:15" },
    { name: "Selin Ak", count: 45, lastEntry: "Dün 10:00" },
    { name: "Ayşe Kaya", count: 42, lastEntry: "12 Mart 17:20" },
    { name: "Mert Aydın", count: 38, lastEntry: "11 Mart 19:45" },
    { name: "Deniz Soylu", count: 35, lastEntry: "11 Mart 08:30" },
    { name: "Arda Tekin", count: 32, lastEntry: "10 Mart 09:12" },
    { name: "Pınar Ege", count: 28, lastEntry: "09 Mart 14:15" },
];

const inactiveActiveMembers = [
    { name: "Osman Koç", days: 18, lastRez: "22 Şub" },
    { name: "Gamze Yıldır", days: 16, lastRez: "24 Şub" },
    { name: "Hakan Sert", days: 14, lastRez: "26 Şub" },
    { name: "Zeynep Al", days: 12, lastRez: "28 Şub" },
    { name: "Kemal Gül", days: 11, lastRez: "1 Mar" },
    { name: "Aslı Tan", days: 10, lastRez: "2 Mar" },
    { name: "Emre Ak", days: 9, lastRez: "3 Mar" },
    { name: "Füsun Dağ", days: 8, lastRez: "4 Mar" },
    { name: "Tarık Yol", days: 8, lastRez: "4 Mar" },
    { name: "İclal Su", days: 7, lastRez: "5 Mar" },
];

export default function MemberReportsPage() {
    return (
        <div className="min-h-screen bg-slate-50/50 p-6 pb-20">
            <div className="max-w-[1400px] mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link 
                        href="/dashboard/reports"
                        className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-600"
                    >
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Üye Raporları</h1>
                        <p className="text-sm text-slate-500 font-medium">Üye performansı ve katılım istatistiklerini takip edin.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold">En Çok Kazandıran Üyeler</CardTitle>
                                <CardDescription>En yüksek ciro sağlayan ilk 10 üye.</CardDescription>
                            </div>
                            <CreditCard className="text-green-600" size={20} />
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100">
                                {topRevenueMembers.map((member, i) => (
                                    <Link 
                                        key={i} 
                                        href={`/dashboard/members/M00${i+1}`} // Placeholder ID logic
                                        className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{member.name}</p>
                                                <p className="text-xs text-slate-400">{member.plan}</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-black text-green-600">{member.amount}</span>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold">Ders Katılım Şampiyonları</CardTitle>
                                <CardDescription>Grup derslerine en çok katılan 10 üye.</CardDescription>
                            </div>
                            <Activity className="text-blue-600" size={20} />
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100">
                                {lessonParticipation.map((member, i) => (
                                    <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-600">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{member.name}</p>
                                                <p className="text-xs text-slate-400">Favori: {member.favorite}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-slate-900">{member.count}</p>
                                            <p className="text-[10px] text-slate-400 uppercase font-bold">KATILIM</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold">Turnike Katılım Şampiyonları</CardTitle>
                                <CardDescription>Tesis giriş sayısı en yüksek 10 üye.</CardDescription>
                            </div>
                            <Dumbbell className="text-purple-600" size={20} />
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100">
                                {entryParticipation.map((member, i) => (
                                    <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center text-xs font-bold text-purple-600">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{member.name}</p>
                                                <p className="text-xs text-slate-400">Son Giriş: {member.lastEntry}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-slate-900">{member.count}</p>
                                            <p className="text-[10px] text-slate-400 uppercase font-bold">GİRİŞ</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm border-amber-200 bg-amber-50/10">
                        <CardHeader className="border-b border-amber-100 flex flex-row items-center justify-between bg-white">
                            <div>
                                <CardTitle className="text-lg font-bold text-slate-900">Pasifleşen Aktif Üyeler</CardTitle>
                                <CardDescription>Aktif üyeliği olup 1 haftadır gelmeyenler.</CardDescription>
                            </div>
                            <Calendar className="text-amber-500" size={20} />
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100 bg-white">
                                {inactiveActiveMembers.map((member, i) => (
                                    <div key={i} className="p-4 flex items-center justify-between hover:bg-amber-50/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center text-xs font-bold text-amber-600">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{member.name}</p>
                                                <p className="text-xs text-slate-400">Son Rezervasyon: {member.lastRez}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-amber-600">{member.days}</p>
                                            <p className="text-[10px] text-slate-400 uppercase font-bold">GÜNDÜR YOK</p>
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
