"use client";

import { useState, useEffect } from "react";
import { getMonthlySessions } from "@/lib/services/sessionService";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
    ChevronLeft, 
    Calendar, 
    Search,
    Loader2,
    RefreshCw,
    BookmarkCheck,
    Clock,
    User,
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

const months = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

const years = ["2024", "2025", "2026"];



export default function ReservationReportsPage() {
    const [selectedMonth, setSelectedMonth] = useState("Mart");
    const [selectedYear, setSelectedYear] = useState("2024");
    const [pageSize, setPageSize] = useState("10");
    const [isLoading, setIsLoading] = useState(false);

    const [reservations, setReservations] = useState<any[]>([]);

    const handleFetch = async () => {
        setIsLoading(true);
        try {
            const sessions = await getMonthlySessions(new Date());
            const flatRes: any[] = [];
            sessions.forEach(s => {
                s.participants.forEach(p => {
                    flatRes.push({
                        id: flatRes.length + 1,
                        trainerName: s.instructor,
                        lessonName: s.activity,
                        startDate: s.date + " " + s.time,
                        endDate: s.date + " " + (parseInt(s.time.split(":")[0]) + 1).toString().padStart(2, '0') + ":00",
                        memberName: p.name
                    });
                });
            });
            setReservations(flatRes);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        handleFetch();
    }, []);

    const handleExport = () => {
        const currentData = pageSize === "all" ? reservations : reservations.slice(0, parseInt(pageSize));
        
        // Create CSV Content
        const headers = ["Sıra No", "Eğitmen Adı", "Ders", "Başlangıç Tarihi", "Bitiş Tarihi", "Üye Adı"];
        const rows = currentData.map(res => [
            res.id,
            res.trainerName,
            res.lessonName,
            res.startDate,
            res.endDate,
            res.memberName
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `rezervasyon_raporu_${selectedMonth}_${selectedYear}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                                <span className="text-blue-600">Rezervasyon</span> Raporları
                            </h1>
                            <p className="text-sm text-slate-500 font-medium italic">Rezervasyon ve ön rezervasyon analizi.</p>
                        </div>
                    </div>
                </div>

                {/* Top Grid: Lists & Filters */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Rezervasyon Listesi (Summary) */}
                    <Card className="border-slate-200 shadow-sm border-l-4 border-l-blue-600 overflow-hidden group hover:shadow-md transition-all">
                        <CardHeader className="py-4 px-6">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-bold text-slate-500 uppercase">Rezervasyon Listesi</CardTitle>
                                <BookmarkCheck className="text-blue-600 h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent className="py-2 px-6">
                            <h3 className="text-3xl font-black text-slate-900">{reservations.length}</h3>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Bu Ay Toplam</p>
                        </CardContent>
                    </Card>

                    {/* Ön Rezervasyon Listesi (Summary) */}
                    <Card className="border-slate-200 shadow-sm border-l-4 border-l-amber-500 overflow-hidden group hover:shadow-md transition-all">
                        <CardHeader className="py-4 px-6">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-bold text-slate-500 uppercase">Ön Rezervasyon Listesi</CardTitle>
                                <Clock className="text-amber-500 h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent className="py-2 px-6">
                            <h3 className="text-3xl font-black text-slate-900">{Math.floor(reservations.length * 0.2)}</h3>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Bekleyen Talepler</p>
                        </CardContent>
                    </Card>

                    {/* Filters & Fetch Button (Spans 2 columns) */}
                    <Card className="lg:col-span-2 border-slate-200 shadow-sm bg-slate-900 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Calendar size={120} />
                        </div>
                        <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 h-full relative z-10">
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                    <SelectTrigger className="w-full sm:w-[140px] bg-white/10 border-white/20 text-white font-bold h-11 rounded-xl">
                                        <SelectValue placeholder="Ay" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                    </SelectContent>
                                </Select>

                                <Select value={selectedYear} onValueChange={setSelectedYear}>
                                    <SelectTrigger className="w-full sm:w-[110px] bg-white/10 border-white/20 text-white font-bold h-11 rounded-xl">
                                        <SelectValue placeholder="Yıl" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button 
                                onClick={handleFetch}
                                disabled={isLoading}
                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-xs px-8 h-11 rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Getiriliyor...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Getir
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Table Section */}
                <Card className="border-slate-200 shadow-md overflow-hidden">
                    <CardHeader className="bg-white border-b border-slate-100 py-6 px-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                                    <Clock className="text-blue-600" />
                                    Detaylı Rezervasyon Listesi
                                </CardTitle>
                                <CardDescription className="text-slate-500 font-medium">Seçilen dönemdeki tüm rezervasyon hareketleri.</CardDescription>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Göster:</span>
                                <Select value={pageSize} onValueChange={setPageSize}>
                                    <SelectTrigger className="w-[100px] h-9 bg-slate-50 border-slate-200 text-xs font-bold rounded-lg shadow-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">10 Kayıt</SelectItem>
                                        <SelectItem value="50">50 Kayıt</SelectItem>
                                        <SelectItem value="100">100 Kayıt</SelectItem>
                                        <SelectItem value="200">200 Kayıt</SelectItem>
                                        <SelectItem value="all">Tümü</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="h-9 w-20 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs shadow-sm border border-blue-100">
                                    {pageSize === "all" ? reservations.length : pageSize} / {reservations.length}
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow className="border-slate-100 hover:bg-transparent">
                                    <TableHead className="w-[80px] font-black text-slate-500 uppercase text-[10px] px-8 py-4 text-center">Sıra No</TableHead>
                                    <TableHead className="font-black text-slate-500 uppercase text-[10px] py-4">
                                        <div className="flex items-center gap-2">
                                            <User size={12} className="text-blue-500" />
                                            Eğitmen Adı
                                        </div>
                                    </TableHead>
                                    <TableHead className="font-black text-slate-500 uppercase text-[10px] py-4">Ders</TableHead>
                                    <TableHead className="font-black text-slate-500 uppercase text-[10px] py-4">Başlangıç Tarihi</TableHead>
                                    <TableHead className="font-black text-slate-500 uppercase text-[10px] py-4">Bitiş Tarihi</TableHead>
                                    <TableHead className="font-black text-slate-500 uppercase text-[10px] py-4">Üye Adı</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className={isLoading ? "opacity-40 transition-opacity" : ""}>
                                {(pageSize === "all" ? reservations : reservations.slice(0, parseInt(pageSize))).map((res) => (
                                    <TableRow key={res.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                        <TableCell className="px-8 font-bold text-slate-400 text-center">{res.id}</TableCell>
                                        <TableCell>
                                            <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{res.trainerName}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl text-[10px] font-black inline-block uppercase tracking-wide border border-blue-100/50 shadow-sm shadow-blue-500/5">
                                                {res.lessonName}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-500 font-medium text-xs">{res.startDate}</TableCell>
                                        <TableCell className="text-slate-500 font-medium text-xs">{res.endDate}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                                    {res.memberName.charAt(0)}
                                                </div>
                                                <span className="font-bold text-slate-900">{res.memberName}</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <div className="bg-slate-50 border-t border-slate-100 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-start gap-3 max-w-2xl text-slate-500">
                            <div className="mt-1 p-1 bg-blue-100 text-blue-600 rounded-md">
                                <Search size={14} />
                            </div>
                            <p className="text-[11px] font-medium leading-relaxed">
                                Görüntülenen sonuçları excel'e aktarabilirsiniz. <br />
                                <span className="text-slate-400">Tüm sonuçları almak için sol üst köşeden tümünü görüntüle yaparak Excel olarak indir düğmesine basınız.</span>
                            </p>
                        </div>
                        <Button 
                            onClick={handleExport}
                            variant="outline"
                            className="bg-white border-blue-200 text-blue-600 font-black uppercase text-xs px-6 h-11 rounded-xl shadow-sm hover:bg-blue-50 hover:border-blue-300 transition-all flex items-center gap-2 shrink-0"
                        >
                            <FileSpreadsheet size={16} />
                            Excel Olarak İndir
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
