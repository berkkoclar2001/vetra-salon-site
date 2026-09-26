"use client";

import { useState, useEffect } from "react";
import { getMembers } from "@/lib/services/memberService";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
    ChevronLeft, 
    Snowflake, 
    Calendar, 
    User, 
    Clock, 
    Search,
    RefreshCw,
    Loader2,
    FileSpreadsheet
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";



export default function FreezeReportsPage() {
    const [pageSize, setPageSize] = useState("10");
    const [isLoading, setIsLoading] = useState(false);

    const [freezes, setFreezes] = useState<any[]>([]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const members = await getMembers();
            // Assign dummy freeze data to some members for report visualization
            const mapped = members.slice(0, 24).map((m, i) => ({
                id: i + 1,
                memberName: m.name,
                subscription: m.membershipType || "Aylık Paket",
                freezeDate: "15.03.2024",
                startDate: "15.04.2024",
                remainingDays: Math.floor(Math.random() * 30) + 1
            }));
            setFreezes(mapped);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRefresh = () => {
        fetchData();
    };

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
                                <span className="text-blue-600">Dondurma</span> Raporları
                            </h1>
                            <p className="text-sm text-slate-500 font-medium italic">Üyelik dondurma işlemleri ve kalan süre analizi.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                         <Button 
                            onClick={handleRefresh}
                            disabled={isLoading}
                            variant="outline"
                            className="bg-white border-slate-200 text-slate-600 font-bold h-10 px-4 rounded-xl shadow-sm hover:bg-slate-50"
                        >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-slate-200 shadow-sm border-l-4 border-l-blue-500">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-black text-slate-500 uppercase tracking-wider">Aktif Dondurulan</p>
                                <Snowflake className="text-blue-500 h-5 w-5" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900">{freezes.length} Üye</h3>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Şu an dondurulmuş durumda</p>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm border-l-4 border-l-indigo-500">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-black text-slate-500 uppercase tracking-wider">Bu Ay Yapılan</p>
                                <Calendar className="text-indigo-500 h-5 w-5" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900">12 İşlem</h3>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Mart ayı toplam işlem</p>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm border-l-4 border-l-emerald-500">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-black text-slate-500 uppercase tracking-wider">Geri Dönüş Oranı</p>
                                <RefreshCw className="text-emerald-500 h-5 w-5" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900">%92</h3>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Dondurma sonrası aktifleşme</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main List Section */}
                <Card className="border-slate-200 shadow-md overflow-hidden">
                    <CardHeader className="bg-white border-b border-slate-100 py-6 px-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                                    <Snowflake className="text-blue-600" />
                                    Dondurulan Üyelik Listesi
                                </CardTitle>
                                <CardDescription className="text-slate-500 font-medium">Aktif ve geçmiş dondurma işlemleri listesi.</CardDescription>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Göster:</span>
                                <Select value={pageSize} onValueChange={setPageSize}>
                                    <SelectTrigger className="w-[110px] h-9 bg-slate-50 border-slate-200 text-xs font-bold rounded-xl shadow-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">10 Kayıt</SelectItem>
                                        <SelectItem value="25">25 Kayıt</SelectItem>
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
                                    <TableHead className="w-[80px] font-black text-slate-500 uppercase text-[10px] px-8 py-4 text-center">Sıra No</TableHead>
                                    <TableHead className="font-black text-slate-500 uppercase text-[10px] py-4">Üye</TableHead>
                                    <TableHead className="font-black text-slate-500 uppercase text-[10px] py-4">Abonelik</TableHead>
                                    <TableHead className="font-black text-slate-500 uppercase text-[10px] py-4">Dondurma Tarihi</TableHead>
                                    <TableHead className="font-black text-slate-500 uppercase text-[10px] py-4">Başlama Tarihi</TableHead>
                                    <TableHead className="font-black text-blue-600 uppercase text-[10px] py-4 text-right pr-8">Kalan Gün Sayısı</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className={isLoading ? "opacity-40 transition-opacity" : ""}>
                                {(pageSize === "all" ? freezes : freezes.slice(0, parseInt(pageSize))).map((item) => (
                                    <TableRow key={item.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                        <TableCell className="px-8 py-4 font-bold text-slate-400 text-center">{item.id}</TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-[10px] font-black">
                                                    {item.memberName.charAt(0)}
                                                </div>
                                                <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.memberName}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 font-bold text-slate-600">
                                            {item.subscription}
                                        </TableCell>
                                        <TableCell className="py-4 font-medium text-slate-500 text-xs">
                                            {item.freezeDate}
                                        </TableCell>
                                        <TableCell className="py-4 font-medium text-slate-500 text-xs">
                                            {item.startDate}
                                        </TableCell>
                                        <TableCell className="py-4 text-right pr-8">
                                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-black border border-blue-100/50 shadow-sm shadow-blue-500/5">
                                                {item.remainingDays} Gün
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Info Footer */}
                <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                            <Clock size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-900 uppercase">Dondurma Bilgilendirme</p>
                            <p className="text-xs text-slate-500 font-medium">Listelenen üyelerin dondurma süreleri dolduğunda sistem otomatik olarak üyelikleri aktif hale getirecektir.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
