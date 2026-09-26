"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    ChevronLeft, 
    Users, 
    TrendingUp, 
    TrendingDown, 
    Calendar,
    ShoppingCart,
    DollarSign,
    CreditCard,
    Clock,
    CheckCircle2,
    Activity,
    MessageSquare,
    PieChart as PieIcon
} from "lucide-react";
import Link from "next/link";
import { 
    PieChart, 
    Pie, 
    Cell, 
    ResponsiveContainer, 
    Tooltip
} from "recharts";

// --- MOCK DATA (Using actual numbers instead of percentages) ---
const charts = [
    { title: "cinsiyet dağılımı", icon: Users, data: [{ name: "Erkek", value: 450, color: "#3b82f6" }, { name: "Kadın", value: 285, color: "#ec4899" }] },
    { title: "eklenen üye sayısı", icon: TrendingUp, data: [{ name: "Yeni", value: 124, color: "#10b981" }, { name: "Eski", value: 32, color: "#6366f1" }] },
    { title: "yapılan abonelik sayısı", icon: Calendar, data: [{ name: "Yıllık", value: 88, color: "#8b5cf6" }, { name: "Aylık", value: 142, color: "#f59e0b" }] },
    { title: "Vitamin Shop sayısı", icon: ShoppingCart, data: [{ name: "Satış", value: 542, color: "#0ea5e9" }, { name: "İade", value: 18, color: "#ef4444" }] },
    { title: "yenileme geliri", icon: DollarSign, data: [{ name: "TL", value: 45000, color: "#10b981" }] },
    { title: "ödeme planı vadeleri", icon: CreditCard, data: [{ name: "Peşin", value: 210, color: "#22c55e" }, { name: "Taksit", value: 95, color: "#3b82f6" }] },
    { title: "gider toplamı", icon: TrendingDown, data: [{ name: "Sabit", value: 12500, color: "#ef4444" }, { name: "Değişken", value: 8400, color: "#f97316" }] },
    { title: "açılan ders saati", icon: Clock, data: [{ name: "Grup", value: 156, color: "#8b5cf6" }, { name: "Özel", value: 48, color: "#ec4899" }] },
    { title: "rezervazyon yoklama", icon: CheckCircle2, data: [{ name: "Geldi", value: 842, color: "#10b981" }, { name: "Gelmedi", value: 124, color: "#ef4444" }] },
    { title: "dondurmalar", icon: Activity, data: [{ name: "Aktif", value: 1150, color: "#3b82f6" }, { name: "Dondurulmuş", value: 42, color: "#94a3b8" }] },
    { title: "ölçüm", icon: Activity, data: [{ name: "Tamam", value: 310, color: "#10b981" }, { name: "Eksik", value: 85, color: "#f59e0b" }] },
    { title: "sms gönderimi", icon: MessageSquare, data: [{ name: "Giden", value: 2450, color: "#10b981" }, { name: "Hata", value: 15, color: "#ef4444" }] },
    { title: "randevu", icon: Calendar, data: [{ name: "Onay", value: 185, color: "#10b981" }, { name: "İptal", value: 24, color: "#ef4444" }] },
    { title: "sanal pos", icon: CreditCard, data: [{ name: "Başarılı", value: 312, color: "#10b981" }, { name: "Hata", value: 4, color: "#ef4444" }] },
    { title: "toplam", icon: DollarSign, data: [{ name: "Ciro (TL)", value: 85400, color: "#10b981" }] },
    { title: "kar", icon: TrendingUp, data: [{ name: "Kar (TL)", value: 64500, color: "#10b981" }, { name: "Gider (TL)", value: 20900, color: "#ef4444" }] },
];

export default function FinancialReportsPage() {
    return (
        <div className="min-h-screen bg-slate-50/50 p-6 pb-20">
            <div className="max-w-[1400px] mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link 
                        href="/dashboard/reports"
                        className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-600 shadow-sm"
                    >
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Finansal Raporlar</h1>
                        <p className="text-sm text-slate-500 font-medium italic">Net sayısal veriler ve grafiksel analiz.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {charts.map((chart, index) => (
                        <Card key={index} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                            <CardHeader className="py-2 px-4 border-b border-slate-50 bg-slate-50/30 flex flex-row items-center justify-between">
                                <CardTitle className="text-[13px] font-black text-slate-800 uppercase tracking-tight">
                                    {chart.title}
                                </CardTitle>
                                <chart.icon size={16} className="text-blue-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                            </CardHeader>
                            <CardContent className="px-4 py-2">
                                <div className="h-[120px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={chart.data}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={30}
                                                outerRadius={50}
                                                paddingAngle={4}
                                                dataKey="value"
                                            >
                                                {chart.data.map((entry, i) => (
                                                    <Cell key={`cell-${i}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '13px', fontWeight: 'bold' }}
                                                formatter={(value) => [
                                                    typeof value === "number" ? value.toLocaleString() : String(value ?? ""),
                                                    '',
                                                ]}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-2 mb-2 space-y-1">
                                    {chart.data.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                                                <span className="text-[12px] font-bold text-slate-600 truncate">{item.name}</span>
                                            </div>
                                            <span className="text-[12px] font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md min-w-[35px] text-center">
                                                {item.value.toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
