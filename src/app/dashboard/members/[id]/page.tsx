"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Member, MemberNote, Session, MeasurementDefinition,
    MeasurementRecord, MemberWorkoutPlan, MemberSubscription,
} from "@/types";
import { getMemberById, getMemberNotes } from "@/lib/services/memberService";
import { getMonthlySessions } from "@/lib/services/sessionService";
import { getMeasurements } from "@/lib/services/definitionService";
import {
    getMeasurementRecords, addMeasurementRecord, compareRecords,
    getWorkoutPlans,
} from "@/lib/services/progressService";
import { getMemberSubscription, getConsumption } from "@/lib/services/packageService";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import {
    Loader2, ArrowLeft, Mail, Phone, MapPin, Calendar, CreditCard,
    Dumbbell, History, MessageSquare, Clock, TrendingUp, TrendingDown,
    Minus, Ruler, ClipboardList, Plus, LayoutList, CalendarRange,
    Timer, Repeat, Snowflake,
} from "lucide-react";

type Tab = "overview" | "progress" | "workout";

const DAY_NAMES = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

export default function MemberProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();

    const [member, setMember] = useState<Member | null>(null);
    const [notes, setNotes] = useState<MemberNote[]>([]);
    const [history, setHistory] = useState<Session[]>([]);
    const [definitions, setDefinitions] = useState<MeasurementDefinition[]>([]);
    const [records, setRecords] = useState<MeasurementRecord[]>([]);
    const [plans, setPlans] = useState<MemberWorkoutPlan[]>([]);
    const [subscription, setSubscription] = useState<MemberSubscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<Tab>("overview");

    // Gelişim grafiğinde hangi ölçüm çizilecek
    const [chartMetric, setChartMetric] = useState<string>("");

    // Yeni ölçüm formu
    const [measureOpen, setMeasureOpen] = useState(false);
    const [measureForm, setMeasureForm] = useState<Record<number, string>>({});
    const [measureNote, setMeasureNote] = useState("");
    const [savingMeasure, setSavingMeasure] = useState(false);

    const memberId = Number(params.id);

    useEffect(() => {
        if (memberId) loadData();
    }, [memberId]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [memberData, notesData, allSessions, defs, recs, planList, sub] = await Promise.all([
                getMemberById(memberId),
                getMemberNotes(),
                getMonthlySessions(new Date()),
                getMeasurements(),
                getMeasurementRecords(memberId),
                getWorkoutPlans(memberId),
                getMemberSubscription(memberId),
            ]);

            setMember(memberData);
            setNotes(notesData.filter(n => n.memberId === memberId));
            setDefinitions(defs);
            setRecords(recs);
            setPlans(planList);
            setSubscription(sub);

            if (defs.length > 0) setChartMetric(String(defs[0].id));

            const memberHistory = allSessions
                .filter(s => s.participants.some(p => p.id === memberId))
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5);
            setHistory(memberHistory);
        } catch (error) {
            console.error("Veri yüklenirken hata:", error);
        } finally {
            setLoading(false);
        }
    };

    // ── Gelişim hesapları ──────────────────────────────────────

    const chartData = useMemo(() => {
        const defId = Number(chartMetric);
        return records
            .map(r => ({
                date: format(parseISO(r.date), "d MMM", { locale: tr }),
                value: r.values.find(v => v.definitionId === defId)?.value ?? null,
            }))
            .filter(d => d.value !== null);
    }, [records, chartMetric]);

    const comparison = useMemo(() => {
        if (records.length < 2) return null;
        return compareRecords(records[0], records[records.length - 1]);
    }, [records]);

    const activeMetric = definitions.find(d => d.id === Number(chartMetric));

    const openMeasureForm = () => {
        const last = records[records.length - 1];
        const seed: Record<number, string> = {};
        definitions.forEach(d => {
            const prev = last?.values.find(v => v.definitionId === d.id);
            seed[d.id] = prev ? String(prev.value) : "";
        });
        setMeasureForm(seed);
        setMeasureNote("");
        setMeasureOpen(true);
    };

    const handleSaveMeasurement = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingMeasure(true);
        try {
            const values = definitions
                .filter(d => measureForm[d.id] !== "" && measureForm[d.id] !== undefined)
                .map(d => ({ definitionId: d.id, value: Number(measureForm[d.id]) }));

            await addMeasurementRecord({
                memberId,
                date: format(new Date(), "yyyy-MM-dd"),
                values,
                recordedBy: user?.username ?? "Bilinmiyor",
                note: measureNote || undefined,
            });
            setMeasureOpen(false);
            await loadData();
            setTab("progress");
        } finally {
            setSavingMeasure(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        );
    }

    if (!member) {
        return (
            <div className="flex flex-col items-center justify-center h-[400px] gap-4">
                <p className="text-slate-500">Üye bulunamadı.</p>
                <Button onClick={() => router.back()}>Geri Dön</Button>
            </div>
        );
    }

    const consumption = subscription ? getConsumption(subscription) : null;

    const tabs: { id: Tab; title: string; icon: typeof LayoutList }[] = [
        { id: "overview", title: "Genel", icon: LayoutList },
        { id: "progress", title: "Gelişim Takibi", icon: Ruler },
        { id: "workout", title: "Antrenman Planı", icon: ClipboardList },
    ];

    return (
        <div className="space-y-6 pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Üye Profili</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── SOL KOLON ── */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-slate-100 shadow-sm overflow-hidden">
                        <div className="h-24 bg-gradient-to-r from-slate-900 to-slate-800" />
                        <CardContent className="pt-0 -mt-12 text-center">
                            <Avatar className="h-24 w-24 mx-auto border-4 border-white shadow-md">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback className="bg-slate-100 text-slate-600 text-2xl font-bold">
                                    {member.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <h2 className="mt-4 text-xl font-bold text-slate-900">{member.name}</h2>
                            <p className="text-sm text-indigo-600 font-medium">{member.profession || "Branş Belirtilmemiş"}</p>

                            <div className={cn(
                                "mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                member.status === "active" ? "bg-green-100 text-green-800 border-green-200" :
                                member.status === "frozen" ? "bg-blue-100 text-blue-800 border-blue-200" :
                                "bg-slate-100 text-slate-700 border-slate-200"
                            )}>
                                {member.status === "active" ? "Aktif" : member.status === "frozen" ? "Dondurulmuş" : "Pasif"}
                            </div>

                            <div className="mt-8 space-y-4 text-left">
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                                        <Mail className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <span className="truncate">{member.email || "—"}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                                        <Phone className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <span>{member.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                                        <MapPin className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <span className="line-clamp-2">{member.address || "Adres belirtilmemiş"}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Aktif paket */}
                    {subscription && consumption && (
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                    <CreditCard className="h-3.5 w-3.5" />
                                    Aktif Paket
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex items-start justify-between gap-2">
                                        <span className="text-base font-bold text-slate-900 leading-tight">
                                            {subscription.packageName}
                                        </span>
                                        <span className={cn(
                                            "shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded",
                                            subscription.status === "active" ? "bg-emerald-50 text-emerald-700" :
                                            subscription.status === "frozen" ? "bg-blue-50 text-blue-700" :
                                            "bg-slate-100 text-slate-500"
                                        )}>
                                            {subscription.status === "active" ? "Aktif" :
                                             subscription.status === "frozen" ? "Donduruldu" : "Süresi doldu"}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {subscription.billingType === "session" ? "Ders adedi bazlı" :
                                         subscription.billingType === "duration" ? "Süre bazlı" :
                                         "Karma — ders ve süre birlikte"}
                                    </p>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500">Kullanım</span>
                                        <span className="font-bold text-slate-700 tabular-nums">%{consumption.percent}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className={cn(
                                            "h-full rounded-full transition-all duration-500",
                                            consumption.percent >= 85 ? "bg-orange-500" :
                                            consumption.percent >= 60 ? "bg-amber-400" : "bg-emerald-500"
                                        )} style={{ width: `${consumption.percent}%` }} />
                                    </div>
                                    {consumption.limiter && (
                                        <p className="text-[11px] text-slate-400">
                                            {consumption.limiter === "session"
                                                ? "Ders hakkı daha hızlı tükeniyor"
                                                : "Süre daha hızlı tükeniyor"}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-1">
                                    {consumption.remainingSessions !== null && (
                                        <div className="rounded-lg bg-slate-50 p-2.5">
                                            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-slate-400 font-semibold">
                                                <Repeat className="h-3 w-3" /> Kalan Ders
                                            </div>
                                            <div className="text-lg font-bold text-slate-900 tabular-nums mt-0.5">
                                                {consumption.remainingSessions}
                                            </div>
                                        </div>
                                    )}
                                    {consumption.remainingDays !== null && (
                                        <div className="rounded-lg bg-slate-50 p-2.5">
                                            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-slate-400 font-semibold">
                                                <Timer className="h-3 w-3" /> Kalan Gün
                                            </div>
                                            <div className="text-lg font-bold text-slate-900 tabular-nums mt-0.5">
                                                {consumption.remainingDays}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {subscription.frozenDaysUsed > 0 && (
                                    <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
                                        <Snowflake className="h-3.5 w-3.5 shrink-0" />
                                        {subscription.frozenDaysUsed} gün dondurma hakkı kullanıldı.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    <Card className="border-slate-100 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-400">Üyelik Detayları</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-slate-400" />
                                    <span className="text-sm text-slate-600">Üyelik Tipi</span>
                                </div>
                                <span className="text-sm font-semibold text-slate-900">{member.membershipType}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                <div className="flex items-center gap-2">
                                    <Dumbbell className="h-4 w-4 text-slate-400" />
                                    <span className="text-sm text-slate-600">Kalan Hak</span>
                                </div>
                                <span className="text-sm font-bold text-indigo-600 tabular-nums">{member.remainingSessions} Seans</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-slate-400" />
                                    <span className="text-sm text-slate-600">Katılım Tarihi</span>
                                </div>
                                <span className="text-sm font-medium text-slate-900">{member.joinDate}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ── SAĞ KOLON ── */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100">
                        {tabs.map(t => (
                            <Button
                                key={t.id}
                                variant={tab === t.id ? "default" : "outline"}
                                size="sm"
                                className={cn(
                                    "flex items-center gap-2 whitespace-nowrap",
                                    tab === t.id ? "bg-slate-900 text-white shadow-md" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                )}
                                onClick={() => setTab(t.id)}
                            >
                                <t.icon size={15} className={tab === t.id ? "text-blue-400" : "text-slate-400"} />
                                {t.title}
                            </Button>
                        ))}
                    </div>

                    {/* ── GENEL ── */}
                    {tab === "overview" && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Card className="border-slate-100 shadow-sm bg-gradient-to-br from-indigo-50 to-white">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-indigo-900">Son Ödeme</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-indigo-600 tabular-nums">
                                            ₺{member.paymentAmount?.toLocaleString("tr-TR") || 0}
                                        </div>
                                        <p className="text-xs text-indigo-600/60 mt-1">{member.paymentMethod} — {member.lastPaymentDate}</p>
                                    </CardContent>
                                </Card>
                                <Card className="border-slate-100 shadow-sm bg-gradient-to-br from-emerald-50 to-white">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-emerald-900">Favori Branş</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-emerald-600">{member.branch || "—"}</div>
                                        <p className="text-xs text-emerald-600/60 mt-1">
                                            {member.level === "beginner" ? "Başlangıç" : member.level === "intermediate" ? "Orta" : "İleri"} Seviye
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card className="border-slate-100 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                        <History className="h-5 w-5 text-slate-400" />
                                        Son Katılım Geçmişi
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {history.length === 0 ? (
                                        <div className="text-center py-8 text-slate-500 text-sm">Katılım kaydı bulunamadı.</div>
                                    ) : (
                                        <div className="space-y-4">
                                            {history.map((session) => (
                                                <div key={session.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-50 hover:bg-slate-50 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                                                            <Dumbbell className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-semibold text-slate-900">{session.activity}</div>
                                                            <div className="text-xs text-slate-500">{session.instructor} ile</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm font-medium text-slate-900">{session.date}</div>
                                                        <div className="text-xs text-slate-500 flex items-center justify-end gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {session.time}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="border-slate-100 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                        <MessageSquare className="h-5 w-5 text-slate-400" />
                                        Üye Notları
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {notes.length === 0 ? (
                                        <div className="text-center py-8 text-slate-500 text-sm">Üye hakkında not bulunmuyor.</div>
                                    ) : (
                                        <div className="space-y-4">
                                            {notes.map((note) => (
                                                <div key={note.id} className={cn(
                                                    "p-4 rounded-lg border",
                                                    note.type === "danger" ? "bg-red-50/50 border-red-100" :
                                                    note.type === "warning" ? "bg-orange-50/50 border-orange-100" :
                                                    note.type === "success" ? "bg-green-50/50 border-green-100" :
                                                    "bg-blue-50/50 border-blue-100"
                                                )}>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className={cn(
                                                            "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                                                            note.type === "danger" ? "bg-red-100 text-red-700" :
                                                            note.type === "warning" ? "bg-orange-100 text-orange-700" :
                                                            note.type === "success" ? "bg-green-100 text-green-700" :
                                                            "bg-blue-100 text-blue-700"
                                                        )}>
                                                            {note.type}
                                                        </span>
                                                        <span className="text-xs text-slate-400">{format(new Date(note.date), "d MMM yyyy", { locale: tr })}</span>
                                                    </div>
                                                    <p className="text-sm text-slate-700 leading-relaxed">{note.note}</p>
                                                    <div className="mt-2 text-[10px] text-slate-400 italic">Ekleyen: {note.createdBy}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* ── GELİŞİM TAKİBİ ── */}
                    {tab === "progress" && (
                        <div className="space-y-6">
                            {comparison && records.length >= 2 && (
                                <Card className="border-slate-200 shadow-sm">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base font-bold text-slate-800">İlk ölçümden bugüne</CardTitle>
                                        <p className="text-xs text-slate-500">
                                            {format(parseISO(records[0].date), "d MMM yyyy", { locale: tr })} → {format(parseISO(records[records.length - 1].date), "d MMM yyyy", { locale: tr })}
                                        </p>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                                            {comparison.map(c => {
                                                const def = definitions.find(d => d.id === c.definitionId);
                                                if (!def) return null;
                                                const up = c.delta > 0;
                                                const flat = c.delta === 0;
                                                return (
                                                    <div key={c.definitionId} className="rounded-lg border border-slate-100 bg-slate-50/60 p-3">
                                                        <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{def.name}</div>
                                                        <div className="mt-1 text-lg font-bold text-slate-900 tabular-nums">
                                                            {c.to}<span className="text-xs font-medium text-slate-400 ml-0.5">{def.unit}</span>
                                                        </div>
                                                        <div className={cn(
                                                            "mt-1 flex items-center gap-1 text-xs font-semibold tabular-nums",
                                                            flat ? "text-slate-400" : up ? "text-orange-600" : "text-emerald-600"
                                                        )}>
                                                            {flat ? <Minus className="h-3 w-3" /> : up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                                            {up ? "+" : ""}{c.delta} {def.unit}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
                                    <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                                        <Ruler className="h-4 w-4 text-slate-400" />
                                        Ölçüm Grafiği
                                    </CardTitle>
                                    <div className="flex items-center gap-2">
                                        <Select value={chartMetric} onValueChange={setChartMetric}>
                                            <SelectTrigger className="h-9 w-[160px] text-xs"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {definitions.map(d => (
                                                    <SelectItem key={d.id} value={String(d.id)}>{d.name} ({d.unit})</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800" onClick={openMeasureForm}>
                                            <Plus className="h-4 w-4 mr-1.5" /> Ölçüm Ekle
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {chartData.length < 2 ? (
                                        <div className="text-center py-12">
                                            <Ruler className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                                            <p className="text-sm text-slate-500">Grafik için en az iki ölçüm gerekiyor.</p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                Ölçülecek alanlar Tanımlamalar &rsaquo; Ölçüm Tanımları ekranından yönetilir.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="h-[280px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={chartData} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                                                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}
                                                        domain={["dataMin - 2", "dataMax + 2"]} />
                                                    <Tooltip
                                                        contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                                                        formatter={(v) => [`${v} ${activeMetric?.unit ?? ""}`, activeMetric?.name ?? ""]}
                                                    />
                                                    <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2.5}
                                                        dot={{ r: 4, fill: "#2563eb" }} activeDot={{ r: 6 }} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="border-slate-100 shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base font-bold text-slate-800">Ölçüm Kayıtları ({records.length})</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {records.length === 0 ? (
                                        <p className="text-sm text-slate-400 text-center py-8">Henüz ölçüm kaydı girilmemiş.</p>
                                    ) : (
                                        [...records].reverse().map(r => (
                                            <div key={r.id} className="rounded-lg border border-slate-100 p-3">
                                                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                                    <span className="text-sm font-semibold text-slate-900">
                                                        {format(parseISO(r.date), "d MMMM yyyy", { locale: tr })}
                                                    </span>
                                                    <span className="text-[11px] text-slate-400">Ölçen: {r.recordedBy}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {r.values.map(v => {
                                                        const def = definitions.find(d => d.id === v.definitionId);
                                                        if (!def) return null;
                                                        return (
                                                            <span key={v.definitionId} className="rounded bg-slate-50 border border-slate-100 px-2 py-1 text-xs">
                                                                <span className="text-slate-500">{def.name}</span>
                                                                <span className="ml-1.5 font-bold text-slate-900 tabular-nums">{v.value}{def.unit}</span>
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                                {r.note && <p className="mt-2 text-xs text-slate-500 italic">{r.note}</p>}
                                            </div>
                                        ))
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* ── ANTRENMAN PLANI ── */}
                    {tab === "workout" && (
                        <div className="space-y-6">
                            {plans.length === 0 ? (
                                <Card className="border-slate-100 shadow-sm">
                                    <CardContent className="py-12 text-center">
                                        <ClipboardList className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                                        <p className="text-sm text-slate-500">Bu üyeye atanmış antrenman planı yok.</p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Program şablonları Tanımlamalar &rsaquo; Eğitim / Çalışma Programları ekranından yönetilir.
                                        </p>
                                    </CardContent>
                                </Card>
                            ) : (
                                plans.map(plan => (
                                    <Card key={plan.id} className={cn(
                                        "border-slate-200 shadow-sm",
                                        plan.status === "completed" && "opacity-70"
                                    )}>
                                        <CardHeader className="border-b border-slate-100 pb-4">
                                            <div className="flex flex-wrap items-start justify-between gap-3">
                                                <div>
                                                    <CardTitle className="text-base font-bold text-slate-900">{plan.title}</CardTitle>
                                                    <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                                                        <span className="flex items-center gap-1">
                                                            <CalendarRange className="h-3 w-3" />
                                                            {format(parseISO(plan.startDate), "d MMM yyyy", { locale: tr })}
                                                            {plan.endDate && ` — ${format(parseISO(plan.endDate), "d MMM yyyy", { locale: tr })}`}
                                                        </span>
                                                        <span>Hazırlayan: {plan.assignedBy}</span>
                                                    </p>
                                                </div>
                                                <span className={cn(
                                                    "text-[10px] font-bold uppercase px-2 py-1 rounded shrink-0",
                                                    plan.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                                                )}>
                                                    {plan.status === "active" ? "Yürürlükte" : "Tamamlandı"}
                                                </span>
                                            </div>
                                            {plan.note && (
                                                <p className="mt-3 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2 text-xs text-amber-800">
                                                    {plan.note}
                                                </p>
                                            )}
                                        </CardHeader>
                                        <CardContent className="pt-4 space-y-4">
                                            {plan.days.map((day, di) => (
                                                <div key={di} className="rounded-lg border border-slate-100 overflow-hidden">
                                                    <div className="flex items-center justify-between bg-slate-50 px-4 py-2.5 border-b border-slate-100">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                                                {DAY_NAMES[day.dayOfWeek]}
                                                            </span>
                                                            <span className="text-sm font-bold text-slate-900">{day.title}</span>
                                                        </div>
                                                        <span className="text-xs text-slate-500 tabular-nums">{day.items.length} hareket</span>
                                                    </div>
                                                    <div className="divide-y divide-slate-50">
                                                        {day.items.map((item, ii) => (
                                                            <div key={ii} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2.5">
                                                                <span className="flex-1 min-w-[140px] text-sm font-medium text-slate-800">
                                                                    {item.exerciseName}
                                                                </span>
                                                                <span className="text-xs text-slate-600 tabular-nums">
                                                                    <b className="text-slate-900">{item.sets}</b> set × <b className="text-slate-900">{item.reps}</b>
                                                                </span>
                                                                {item.weight && (
                                                                    <span className="text-xs text-slate-500 tabular-nums">{item.weight}</span>
                                                                )}
                                                                {item.restSeconds && (
                                                                    <span className="text-xs text-slate-400 tabular-nums flex items-center gap-1">
                                                                        <Timer className="h-3 w-3" /> {item.restSeconds}sn
                                                                    </span>
                                                                )}
                                                                {item.note && (
                                                                    <span className="w-full text-[11px] text-slate-400 italic">{item.note}</span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Ölçüm ekleme */}
            <Dialog open={measureOpen} onOpenChange={setMeasureOpen}>
                <DialogContent className="sm:max-w-[460px]">
                    <DialogHeader>
                        <DialogTitle>Yeni Ölçüm — {member.name}</DialogTitle>
                        <DialogDescription>
                            Alanlar Tanımlamalar ekranındaki ölçüm listesinden gelir. Son değerler önceden dolduruldu.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveMeasurement} className="grid gap-3 py-2">
                        {definitions.map(d => (
                            <div key={d.id} className="grid grid-cols-[1fr_120px] items-center gap-3">
                                <Label htmlFor={`m-${d.id}`} className="text-sm text-slate-600">
                                    {d.name} <span className="text-slate-400">({d.unit})</span>
                                </Label>
                                <Input
                                    id={`m-${d.id}`}
                                    type="number"
                                    step="0.1"
                                    value={measureForm[d.id] ?? ""}
                                    onChange={e => setMeasureForm({ ...measureForm, [d.id]: e.target.value })}
                                    className="tabular-nums"
                                />
                            </div>
                        ))}
                        <div className="grid gap-2 mt-1">
                            <Label htmlFor="m-note">Not</Label>
                            <Textarea id="m-note" rows={2} value={measureNote}
                                onChange={e => setMeasureNote(e.target.value)}
                                placeholder="Opsiyonel — örn: kardiyo yükü artırıldı." />
                        </div>
                        <DialogFooter className="mt-2">
                            <Button type="button" variant="outline" onClick={() => setMeasureOpen(false)}>İptal</Button>
                            <Button type="submit" disabled={savingMeasure} className="bg-slate-900 text-white hover:bg-slate-800">
                                {savingMeasure && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                Kaydet
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
