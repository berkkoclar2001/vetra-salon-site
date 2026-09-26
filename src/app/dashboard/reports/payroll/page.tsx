"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { CommissionRule, PayoutLine, CommissionType } from "@/types";
import {
    getCommissionRules, addCommissionRule, updateCommissionRule,
    deleteCommissionRule, getPayoutForMonth, describeRule, COMMISSION_LABELS,
} from "@/lib/services/payrollService";
import { getInstructors } from "@/lib/services/staffService";
import { StaffMember } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format, addMonths, subMonths } from "date-fns";
import { tr } from "date-fns/locale";
import {
    Wallet, ChevronLeft, ChevronRight, ArrowLeft, Plus, Trash2,
    Loader2, ShieldAlert, Download, Settings2, Users, Calculator,
} from "lucide-react";

const RULE_TYPES: CommissionType[] = ["per_session", "revenue_share", "fixed"];

export default function PayrollReportPage() {
    const { user, isLoading: authLoading } = useAuth();
    const isAdmin = user?.role === "admin";

    const [month, setMonth] = useState<Date>(new Date());
    const [loading, setLoading] = useState(true);
    const [rows, setRows] = useState<PayoutLine[]>([]);
    const [rules, setRules] = useState<CommissionRule[]>([]);
    const [instructors, setInstructors] = useState<StaffMember[]>([]);

    const [rulesOpen, setRulesOpen] = useState(false);
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<CommissionRule | null>(null);
    const [form, setForm] = useState({
        staffId: "", type: "per_session" as CommissionType,
        rate: "", baseSalary: "", minSessions: "", isActive: true,
    });

    useEffect(() => { load(); }, [month]);

    const load = async () => {
        setLoading(true);
        try {
            const [payout, ruleList, staff] = await Promise.all([
                getPayoutForMonth(month), getCommissionRules(), getInstructors(),
            ]);
            setRows(payout); setRules(ruleList); setInstructors(staff);
        } catch (e) {
            console.error("Hakediş hesaplanamadı", e);
        } finally {
            setLoading(false);
        }
    };

    const openNewRule = () => {
        setEditing(null);
        setForm({ staffId: "", type: "per_session", rate: "", baseSalary: "", minSessions: "", isActive: true });
        setFormOpen(true);
    };

    const openEditRule = (r: CommissionRule) => {
        setEditing(r);
        setForm({
            staffId: String(r.staffId), type: r.type,
            rate: String(r.rate), baseSalary: String(r.baseSalary),
            minSessions: r.minSessions ? String(r.minSessions) : "", isActive: r.isActive,
        });
        setFormOpen(true);
    };

    const handleSaveRule = async (e: React.FormEvent) => {
        e.preventDefault();
        const staff = instructors.find(s => s.id === Number(form.staffId));
        if (!staff) return;

        const payload = {
            staffId: staff.id,
            staffName: staff.name,
            type: form.type,
            rate: Number(form.rate) || 0,
            baseSalary: Number(form.baseSalary) || 0,
            minSessions: form.minSessions ? Number(form.minSessions) : undefined,
            isActive: form.isActive,
        };

        if (editing) await updateCommissionRule(editing.id, payload);
        else await addCommissionRule(payload);

        setFormOpen(false);
        await load();
    };

    const handleDeleteRule = async (id: number) => {
        if (!confirm("Bu hakediş kuralı silinsin mi?")) return;
        await deleteCommissionRule(id);
        await load();
    };

    const exportCsv = () => {
        const header = ["Eğitmen", "Branş", "Kural", "Ders", "Katılım", "Üretilen Ciro", "Taban", "Prim", "Toplam"];
        const lines = rows.map(r => [
            r.staffName, r.branch ?? "", r.ruleLabel, r.sessionCount, r.attendedCount,
            r.generatedRevenue, r.baseSalary, r.commission, r.total,
        ].join(";"));
        const csv = "﻿" + [header.join(";"), ...lines].join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `hakedis-${format(month, "yyyy-MM")}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (authLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center h-[400px] gap-3">
                <ShieldAlert className="h-10 w-10 text-slate-300" />
                <h2 className="text-xl font-semibold text-slate-900">Yetkisiz Erişim</h2>
                <p className="text-sm text-slate-500">Hakediş raporu yalnızca yöneticilere açıktır.</p>
            </div>
        );
    }

    const totals = rows.reduce((acc, r) => ({
        base: acc.base + r.baseSalary,
        commission: acc.commission + r.commission,
        total: acc.total + r.total,
        revenue: acc.revenue + r.generatedRevenue,
        sessions: acc.sessions + r.sessionCount,
    }), { base: 0, commission: 0, total: 0, revenue: 0, sessions: 0 });

    const costRatio = totals.revenue > 0 ? Math.round((totals.total / totals.revenue) * 100) : 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/reports">
                        <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Hakediş Raporu</h1>
                        <p className="text-slate-500 text-sm mt-0.5">
                            Eğitmen kazançları taban ücret + prim kuralına göre hesaplanır.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-white rounded-lg border border-slate-200 shadow-sm">
                        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setMonth(subMonths(month, 1))}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="px-3 text-sm font-bold text-slate-700 min-w-[130px] text-center select-none">
                            {format(month, "MMMM yyyy", { locale: tr })}
                        </span>
                        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setMonth(addMonths(month, 1))}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setRulesOpen(true)}>
                        <Settings2 className="h-4 w-4 mr-2" /> Kurallar
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportCsv} disabled={rows.length === 0}>
                        <Download className="h-4 w-4 mr-2" /> CSV
                    </Button>
                </div>
            </div>

            {/* Özet */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-slate-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Toplam Hakediş</CardTitle>
                        <Wallet className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 tabular-nums">
                            ₺{totals.total.toLocaleString("tr-TR")}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{rows.length} eğitmen</p>
                    </CardContent>
                </Card>

                <Card className="border-slate-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Taban / Prim</CardTitle>
                        <Calculator className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 tabular-nums">
                            ₺{totals.commission.toLocaleString("tr-TR")}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                            ₺{totals.base.toLocaleString("tr-TR")} taban üzerine prim
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-slate-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Üretilen Ciro</CardTitle>
                        <Users className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 tabular-nums">
                            ₺{totals.revenue.toLocaleString("tr-TR")}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{totals.sessions} ders karşılığı</p>
                    </CardContent>
                </Card>

                <Card className={cn(
                    "border-slate-100 shadow-sm",
                    costRatio > 60 ? "bg-orange-50/60 border-orange-200" : "bg-slate-900 text-white"
                )}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className={cn("text-sm font-medium", costRatio > 60 ? "text-slate-500" : "text-slate-300")}>
                            Personel Maliyet Oranı
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={cn(
                            "text-2xl font-bold tabular-nums",
                            costRatio > 60 ? "text-orange-600" : "text-white"
                        )}>
                            %{costRatio}
                        </div>
                        <p className={cn("text-xs mt-1", costRatio > 60 ? "text-orange-700" : "text-slate-400")}>
                            {costRatio > 60 ? "Sağlıklı bandın üstünde" : "Ciroya oranla hakediş"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Döküm */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100 py-4">
                    <CardTitle className="text-base font-bold text-slate-800">
                        {format(month, "MMMM yyyy", { locale: tr })} Dökümü
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
                        </div>
                    ) : rows.length === 0 ? (
                        <div className="text-center py-12 text-sm text-slate-400">
                            Bu ay için tanımlı hakediş kuralı bulunmuyor.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Eğitmen</TableHead>
                                    <TableHead>Kural</TableHead>
                                    <TableHead className="text-right">Ders</TableHead>
                                    <TableHead className="text-right">Katılım</TableHead>
                                    <TableHead className="text-right">Üretilen Ciro</TableHead>
                                    <TableHead className="text-right">Taban</TableHead>
                                    <TableHead className="text-right">Prim</TableHead>
                                    <TableHead className="text-right">Toplam</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.map(r => (
                                    <TableRow key={r.staffId}>
                                        <TableCell>
                                            <div className="font-semibold text-slate-900">{r.staffName}</div>
                                            {r.branch && <div className="text-[11px] text-slate-400">{r.branch}</div>}
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-[11px] font-medium px-2 py-1 rounded bg-slate-100 text-slate-600">
                                                {r.ruleLabel}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums text-slate-700">{r.sessionCount}</TableCell>
                                        <TableCell className="text-right tabular-nums text-slate-700">{r.attendedCount}</TableCell>
                                        <TableCell className="text-right tabular-nums text-slate-600">
                                            ₺{r.generatedRevenue.toLocaleString("tr-TR")}
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums text-slate-600">
                                            ₺{r.baseSalary.toLocaleString("tr-TR")}
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums font-semibold text-emerald-600">
                                            {r.commission > 0 ? `₺${r.commission.toLocaleString("tr-TR")}` : "—"}
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums font-bold text-slate-900">
                                            ₺{r.total.toLocaleString("tr-TR")}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow className="bg-slate-50 font-bold">
                                    <TableCell colSpan={4} className="text-slate-900">Toplam</TableCell>
                                    <TableCell className="text-right tabular-nums">₺{totals.revenue.toLocaleString("tr-TR")}</TableCell>
                                    <TableCell className="text-right tabular-nums">₺{totals.base.toLocaleString("tr-TR")}</TableCell>
                                    <TableCell className="text-right tabular-nums text-emerald-700">₺{totals.commission.toLocaleString("tr-TR")}</TableCell>
                                    <TableCell className="text-right tabular-nums text-slate-900">₺{totals.total.toLocaleString("tr-TR")}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Kurallar */}
            <Dialog open={rulesOpen} onOpenChange={setRulesOpen}>
                <DialogContent className="sm:max-w-[640px]">
                    <DialogHeader>
                        <DialogTitle>Hakediş Kuralları</DialogTitle>
                        <DialogDescription>
                            Ders başı primde eşiğe kadar olan dersler taban ücretin karşılığı sayılır;
                            prim yalnızca eşiği aşan dersler için işler.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2 py-2 max-h-[380px] overflow-y-auto">
                        {rules.map(r => (
                            <div key={r.id} className={cn(
                                "flex items-center gap-3 rounded-lg border p-3",
                                r.isActive ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50 opacity-60"
                            )}>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-slate-900">{r.staffName}</div>
                                    <div className="text-xs text-slate-500">
                                        {describeRule(r)} · Taban ₺{r.baseSalary.toLocaleString("tr-TR")}
                                    </div>
                                </div>
                                <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => openEditRule(r)}>
                                    Düzenle
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-50"
                                    onClick={() => handleDeleteRule(r.id)}>
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        ))}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRulesOpen(false)}>Kapat</Button>
                        <Button className="bg-slate-900 text-white hover:bg-slate-800" onClick={openNewRule}>
                            <Plus className="h-4 w-4 mr-2" /> Yeni Kural
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Kural formu */}
            <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle>{editing ? "Kuralı Düzenle" : "Yeni Hakediş Kuralı"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSaveRule} className="grid gap-4 py-2">
                        <div className="grid gap-2">
                            <Label>Eğitmen</Label>
                            <Select value={form.staffId} onValueChange={v => setForm({ ...form, staffId: v })}>
                                <SelectTrigger><SelectValue placeholder="Eğitmen seçin" /></SelectTrigger>
                                <SelectContent>
                                    {instructors.map(s => (
                                        <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label>Hesaplama Tipi</Label>
                            <Select value={form.type} onValueChange={v => setForm({ ...form, type: v as CommissionType })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {RULE_TYPES.map(t => (
                                        <SelectItem key={t} value={t}>{COMMISSION_LABELS[t]}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="r-base">Taban Ücret (₺)</Label>
                                <Input id="r-base" type="number" value={form.baseSalary}
                                    onChange={e => setForm({ ...form, baseSalary: e.target.value })} />
                            </div>
                            {form.type !== "fixed" && (
                                <div className="grid gap-2">
                                    <Label htmlFor="r-rate">
                                        {form.type === "per_session" ? "Ders Başı (₺)" : "Ciro Payı (%)"}
                                    </Label>
                                    <Input id="r-rate" type="number" value={form.rate}
                                        onChange={e => setForm({ ...form, rate: e.target.value })} />
                                </div>
                            )}
                        </div>

                        {form.type === "per_session" && (
                            <div className="grid gap-2">
                                <Label htmlFor="r-min">Prim Eşiği (ders)</Label>
                                <Input id="r-min" type="number" value={form.minSessions}
                                    onChange={e => setForm({ ...form, minSessions: e.target.value })}
                                    placeholder="Boş bırakılırsa tüm dersler prime dahil" />
                            </div>
                        )}

                        <label className="flex items-center gap-2 text-sm text-slate-600">
                            <input type="checkbox" checked={form.isActive}
                                onChange={e => setForm({ ...form, isActive: e.target.checked })}
                                className="h-4 w-4 rounded border-slate-300" />
                            Kural aktif
                        </label>

                        <DialogFooter className="mt-2">
                            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>İptal</Button>
                            <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800">Kaydet</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
