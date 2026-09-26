"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
    ChevronLeft, 
    CreditCard, 
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    Calendar,
    Wallet,
    AlertCircle,
    MessageSquare,
    Users
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// Mock Data for "Ödeme Planı Vade Toplamları" (Expanded)
const debtData = Array.from({ length: 50 }).map((_, i) => {
    const year = 2024 - Math.floor(i / 12);
    const monthIdx = 11 - (i % 12);
    const monthsArr = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    
    return {
        period: `${year} ${monthsArr[monthIdx]}`,
        paid: `${(Math.floor(Math.random() * 50) + 100) * 1000} ₺`,
        unpaid: `${(Math.floor(Math.random() * 20)) * 1000} ₺`,
        total: `0 ₺` // Will calculate below
    };
}).map(item => ({
    ...item,
    total: `${(parseInt(item.paid.replace(/\D/g, '')) + parseInt(item.unpaid.replace(/\D/g, ''))).toLocaleString('tr-TR')} ₺`,
    paid: parseInt(item.paid.replace(/\D/g, '')).toLocaleString('tr-TR') + " ₺",
    unpaid: parseInt(item.unpaid.replace(/\D/g, '')).toLocaleString('tr-TR') + " ₺"
}));

// Mock Data for "Eksik Ödemeli Üye Listesi" (Expanded)
const incompletePaymentMembers = Array.from({ length: 100 }).map((_, i) => ({
    id: i + 1,
    name: ["Ahmet Erdem", "Buse Aydın", "Caner Yıldız", "Deniz Kaya", "Ece Demir", "Fatih Çelik", "Gamze Ak", "Hakan Yılmaz", "İlayda Şahin", "Kaan Arslan"][i % 10],
    membership: ["Reformer Pilates", "Yoga Flow", "Kick Boks", "Fitness", "Crossfit"][i % 5],
    remainingDays: Math.floor(Math.random() * 150),
    balance: `-${(Math.floor(Math.random() * 50) + 5) * 100} ₺`
}));

export default function DebtReportsPage() {
    const [pageSize, setPageSize] = useState("10");
    const [memberPageSize, setMemberPageSize] = useState("10");

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 pb-20">
            <div className="max-w-[1400px] mx-auto space-y-6">
                {/* Header Section */}
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
                                <span className="text-red-600">Borç</span> Raporları
                            </h1>
                            <p className="text-sm text-slate-500 font-medium italic">Finansal alacaklar ve ödeme planı analizi.</p>
                        </div>
                    </div>
                </div>

                {/* KPI/Summary Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-slate-200 shadow-sm border-l-4 border-l-emerald-500">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Toplam Ödenmiş</p>
                                <div className="p-2 bg-emerald-50 rounded-lg">
                                    <TrendingUp size={18} className="text-emerald-600" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900">498.000 ₺</h3>
                            <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase">
                                <ArrowUpRight size={14} /> %12 Artış (Geçen Ay)
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm border-l-4 border-l-red-500">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Toplam Ödenmemiş (Borç)</p>
                                <div className="p-2 bg-red-50 rounded-lg">
                                    <AlertCircle size={18} className="text-red-600" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900">68.950 ₺</h3>
                            <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-red-600 uppercase">
                                <ArrowDownRight size={14} /> %4 Azalış (Geçen Ay)
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm border-l-4 border-l-blue-600">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tahsilat Oranı</p>
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Wallet size={18} className="text-blue-600" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900">%87.8</h3>
                            <div className="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-blue-600 h-full rounded-full" style={{ width: "87.8%" }} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main List Section */}
                <Card className="border-slate-200 shadow-md overflow-hidden">
                    <CardHeader className="bg-white border-b border-slate-100 py-6 px-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                                    <Calendar className="text-blue-600" />
                                    Ödeme Planı Vade Toplamları
                                </CardTitle>
                                <CardDescription className="text-slate-500 font-medium">Aylara göre ödeme durumu ve vade takibi.</CardDescription>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Göster:</span>
                                <Select value={pageSize} onValueChange={setPageSize}>
                                    <SelectTrigger className="w-[110px] h-9 bg-slate-50 border-slate-200 text-xs font-bold rounded-xl shadow-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">10 Kayıt</SelectItem>
                                        <SelectItem value="50">50 Kayıt</SelectItem>
                                        <SelectItem value="all">Tümü</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow className="border-slate-100 hover:bg-transparent">
                                    <TableHead className="font-black text-slate-500 uppercase text-[10px] px-8 py-4">Yıl - Ay</TableHead>
                                    <TableHead className="font-black text-emerald-600 uppercase text-[10px] py-4">Toplam Ödenmiş</TableHead>
                                    <TableHead className="font-black text-red-600 uppercase text-[10px] py-4">Toplam Ödenmemiş</TableHead>
                                    <TableHead className="font-black text-slate-900 uppercase text-[10px] py-4 text-right pr-8">Genel Toplam</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {(pageSize === "all" ? debtData : debtData.slice(0, parseInt(pageSize))).map((item, idx) => (
                                    <TableRow key={idx} className="border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                        <TableCell className="px-8 py-4 font-bold text-slate-700">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-slate-300" />
                                                {item.period}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-xs font-black border border-emerald-100/50 shadow-sm shadow-emerald-500/5 inline-block">
                                                {item.paid}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <span className="bg-red-50 text-red-700 px-3 py-1 rounded-lg text-xs font-black border border-red-100/50 shadow-sm shadow-red-500/5 inline-block">
                                                {item.unpaid}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-4 text-right pr-8 font-black text-slate-900">
                                            {item.total}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Incomplete Payment Members List */}
                <Card className="border-slate-200 shadow-md overflow-hidden">
                    <CardHeader className="bg-white border-b border-slate-100 py-6 px-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                                    <Users className="text-red-500" />
                                    Eksik Ödemeli Üye Listesi
                                </CardTitle>
                                <CardDescription className="text-slate-500 font-medium">Ödemesi beklenen veya bakiyesi eksik olan üyeler.</CardDescription>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Göster:</span>
                                <Select value={memberPageSize} onValueChange={setMemberPageSize}>
                                    <SelectTrigger className="w-[110px] h-9 bg-slate-50 border-slate-200 text-xs font-bold rounded-xl shadow-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">10 Kayıt</SelectItem>
                                        <SelectItem value="50">50 Kayıt</SelectItem>
                                        <SelectItem value="100">100 Kayıt</SelectItem>
                                        <SelectItem value="all">Tümü</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow className="border-slate-100 hover:bg-transparent">
                                    <TableHead className="w-[80px] font-black text-slate-500 uppercase text-[10px] px-8 py-4 text-center">Sıra No</TableHead>
                                    <TableHead className="font-black text-slate-500 uppercase text-[10px] py-4">Üye</TableHead>
                                    <TableHead className="font-black text-slate-500 uppercase text-[10px] py-4">Üyelik</TableHead>
                                    <TableHead className="font-black text-slate-500 uppercase text-[10px] py-4">Kalan Gün</TableHead>
                                    <TableHead className="font-black text-red-600 uppercase text-[10px] py-4">Cari Durum</TableHead>
                                    <TableHead className="font-black text-slate-900 uppercase text-[10px] py-4 text-right pr-8">İşlemler</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {(memberPageSize === "all" ? incompletePaymentMembers : incompletePaymentMembers.slice(0, parseInt(memberPageSize))).map((member) => (
                                    <TableRow key={member.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                        <TableCell className="px-8 py-4 font-bold text-slate-400 text-center">{member.id}</TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-slate-900">{member.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-black inline-block uppercase tracking-tight border border-slate-200/50 shadow-sm shadow-slate-500/5">
                                                {member.membership}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 font-bold text-slate-600">
                                            <span className={`${member.remainingDays <= 10 ? 'text-red-600 font-black' : 'text-slate-600'}`}>
                                                {member.remainingDays} Gün
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <span className="font-black text-red-600">
                                                {member.balance}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-4 text-right pr-8">
                                            <Button 
                                                size="sm"
                                                variant="outline"
                                                className="h-8 bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all rounded-lg text-[10px] font-black uppercase flex items-center gap-2 ml-auto"
                                                onClick={() => alert(`${member.name} kullanıcısına hatırlatma SMS'i gönderildi.`)}
                                            >
                                                <MessageSquare size={12} />
                                                SMS Gönder
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Information Card */}
                <Card className="border-slate-200 border-dashed bg-transparent shadow-none">
                    <CardContent className="p-6 flex items-start gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                            <AlertCircle size={24} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-black text-slate-900 uppercase">Önemli Not</p>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                Bu rapor, sistemde tanımlanan tüm taksitlerin ve vadelerin toplamlarını yansıtmaktadır. 
                                <span className="text-red-500"> Kırmızı alanlar</span> tahsilatı gecikmiş veya vadesi gelmiş henüz ödenmemiş tutarları temsil eder.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
