"use client";

import { useState, useEffect } from "react";
import { getMembers } from "@/lib/services/memberService";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
    ChevronLeft, 
    Search,
    RefreshCw,
    Loader2,
    ArrowRight,
    Users,
    CreditCard,
    Calendar,
    Activity
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
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";



export default function MembershipReportsPage() {
    const [pageSize, setPageSize] = useState("10");
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [memberships, setMemberships] = useState<any[]>([]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const members = await getMembers();
            const mapped = members.map(m => ({
                id: m.id,
                name: m.name,
                type: m.membershipType,
                remainingDays: m.remainingSessions * 3 + " Gün", // mock calculation
                credits: m.remainingSessions,
                balance: m.paymentAmount + "₺",
                status: m.status === 'active' ? 'Aktif' : (m.status === 'frozen' ? 'Dondurulmuş' : 'Pasif')
            }));
            setMemberships(mapped);
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

    const filteredData = memberships.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                                <span className="text-blue-600">Yeni</span> Üyelik Raporları
                            </h1>
                            <p className="text-sm text-slate-500 font-medium italic">Aktif üyeliklerin detaylı takibi ve cari durum analizi.</p>
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

                {/* Main List Section */}
                <Card className="border-slate-200 shadow-md overflow-hidden">
                    <CardHeader className="bg-white border-b border-slate-100 py-6 px-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-500 uppercase">Show</span>
                                    <Select value={pageSize} onValueChange={setPageSize}>
                                        <SelectTrigger className="w-[80px] h-9 bg-slate-50 border-slate-200 text-xs font-bold rounded-lg shadow-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="10">10</SelectItem>
                                            <SelectItem value="25">25</SelectItem>
                                            <SelectItem value="50">50</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <span className="text-xs font-bold text-slate-500 uppercase">entries</span>
                                </div>
                            </div>
                            
                            <div className="relative w-full md:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input 
                                    placeholder="Search..." 
                                    className="pl-10 bg-slate-50 border-slate-200 h-9 text-sm font-medium rounded-lg"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow className="border-slate-100 hover:bg-transparent">
                                    <TableHead className="w-[60px] font-black text-slate-500 uppercase text-[11px] px-8 py-4">#</TableHead>
                                    <TableHead className="font-black text-slate-500 uppercase text-[11px] py-4">Üye</TableHead>
                                    <TableHead className="font-black text-slate-500 uppercase text-[11px] py-4">Üyelik</TableHead>
                                    <TableHead className="font-black text-slate-500 uppercase text-[11px] py-4">Kalan Gün</TableHead>
                                    <TableHead className="font-black text-slate-500 uppercase text-[11px] py-4">Kredi</TableHead>
                                    <TableHead className="font-black text-slate-500 uppercase text-[11px] py-4 text-right pr-8">Cari Durum</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className={isLoading ? "opacity-40 transition-opacity" : ""}>
                                {filteredData.map((item) => (
                                    <TableRow key={item.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                        <TableCell className="px-8 py-5 font-bold text-slate-400">{item.id}</TableCell>
                                        <TableCell className="py-5">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2">
                                                    <Search size={14} className="text-red-500 stroke-[3px]" />
                                                    <Link 
                                                        href={`/dashboard/members/${item.id}`}
                                                        className="font-bold text-blue-600 hover:underline cursor-pointer transition-colors"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                </div>
                                                <div className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded flex items-center justify-center gap-1 w-fit">
                                                    <Activity size={10} className="fill-white" />
                                                    Üyelik Durumu : {item.status}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-5 font-bold text-slate-700 text-sm">
                                            {item.type}
                                        </TableCell>
                                        <TableCell className="py-5 font-bold text-slate-600">
                                            {item.remainingDays}
                                        </TableCell>
                                        <TableCell className="py-5 font-bold text-slate-600">
                                            {item.credits}
                                        </TableCell>
                                        <TableCell className={`py-5 text-right pr-8 font-bold ${item.balance !== "0₺" ? "text-red-600" : "text-slate-900"}`}>
                                            {item.balance}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Footer Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                    <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200 relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase opacity-70 tracking-widest mb-1">Toplam Aktif Üyelik</p>
                            <h3 className="text-3xl font-black">{memberships.filter(m => m.status === 'Aktif').length}</h3>
                        </div>
                        <Users className="absolute -right-4 -bottom-4 h-24 w-24 opacity-10 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    
                    <div className="bg-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-200 relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase opacity-70 tracking-widest mb-1">Toplam Kredi Yükü</p>
                            <h3 className="text-3xl font-black">{memberships.reduce((acc, m) => acc + m.credits, 0)}</h3>
                        </div>
                        <CreditCard className="absolute -right-4 -bottom-4 h-24 w-24 opacity-10 group-hover:scale-110 transition-transform duration-500" />
                    </div>

                    <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg shadow-slate-200 relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase opacity-70 tracking-widest mb-1">Bekleyen Tahsilat</p>
                            <h3 className="text-3xl font-black">{memberships.reduce((acc, m) => acc + parseInt(m.balance.replace('₺', '') || '0'), 0)}₺</h3>
                        </div>
                        <Calendar className="absolute -right-4 -bottom-4 h-24 w-24 opacity-10 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                </div>
            </div>
        </div>
    );
}

