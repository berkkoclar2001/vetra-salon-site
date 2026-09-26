"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
    NotificationTemplate, NotificationLog, NotificationTrigger,
    NotificationChannel, Member,
} from "@/types";
import {
    getTemplates, addTemplate, updateTemplate, deleteTemplate,
    getLogs, sendToMembers, renderTemplate,
    getPendingNotifications, PendingNotification,
    TRIGGER_LABELS, TRIGGER_HINTS, TEMPLATE_VARIABLES,
} from "@/lib/services/notificationService";
import { getMembers } from "@/lib/services/memberService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import {
    BellRing, Plus, Trash2, Send, MessageSquare, Mail, Loader2,
    Zap, History, FileText, ShieldAlert, CircleCheck, CircleX,
    Clock, Eye, Power,
} from "lucide-react";

type Tab = "queue" | "templates" | "history";

const EMPTY_TEMPLATE: Omit<NotificationTemplate, "id"> = {
    name: "", trigger: "package_ending", channel: "sms",
    offsetDays: 0, isActive: true,
    body: "Merhaba {{ad}}, ",
};

const TRIGGERS: NotificationTrigger[] = [
    "package_ending", "membership_expiring", "birthday",
    "session_reminder", "inactive_member", "manual",
];

export default function NotificationsPage() {
    const { user, isLoading: authLoading } = useAuth();
    const isAdmin = user?.role === "admin";

    const [tab, setTab] = useState<Tab>("queue");
    const [loading, setLoading] = useState(true);
    const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
    const [logs, setLogs] = useState<NotificationLog[]>([]);
    const [pending, setPending] = useState<PendingNotification[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [sending, setSending] = useState(false);

    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<NotificationTemplate | null>(null);
    const [form, setForm] = useState<Omit<NotificationTemplate, "id">>(EMPTY_TEMPLATE);

    const [previewTemplate, setPreviewTemplate] = useState<NotificationTemplate | null>(null);

    useEffect(() => { loadAll(); }, []);

    const loadAll = async () => {
        setLoading(true);
        try {
            const [t, l, p, m] = await Promise.all([
                getTemplates(), getLogs(), getPendingNotifications(), getMembers(),
            ]);
            setTemplates(t); setLogs(l); setPending(p); setMembers(m);
        } catch (e) {
            console.error("Bildirim verisi yüklenemedi", e);
        } finally {
            setLoading(false);
        }
    };

    const openNew = () => {
        setEditing(null);
        setForm(EMPTY_TEMPLATE);
        setFormOpen(true);
    };

    const openEdit = (t: NotificationTemplate) => {
        setEditing(t);
        setForm({
            name: t.name,
            trigger: t.trigger,
            channel: t.channel,
            body: t.body,
            offsetDays: t.offsetDays,
            isActive: t.isActive,
        });
        setFormOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editing) await updateTemplate(editing.id, form);
        else await addTemplate(form);
        setFormOpen(false);
        await loadAll();
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bu şablon silinsin mi?")) return;
        await deleteTemplate(id);
        await loadAll();
    };

    const handleToggle = async (t: NotificationTemplate) => {
        await updateTemplate(t.id, { isActive: !t.isActive });
        await loadAll();
    };

    const handleSendQueue = async () => {
        if (pending.length === 0) return;
        setSending(true);
        try {
            // Aynı şablona düşen üyeler tek seferde gönderilir
            const grouped = new Map<number, { template: NotificationTemplate; members: Member[] }>();
            pending.forEach(p => {
                const entry = grouped.get(p.template.id);
                if (entry) entry.members.push(p.member);
                else grouped.set(p.template.id, { template: p.template, members: [p.member] });
            });
            for (const { template, members: ms } of grouped.values()) {
                await sendToMembers(template, ms);
            }
            await loadAll();
            setTab("history");
        } finally {
            setSending(false);
        }
    };

    const insertVariable = (key: string) => {
        setForm(f => ({ ...f, body: f.body + key }));
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
                <p className="text-sm text-slate-500">Bildirim merkezi yalnızca yöneticiler tarafından yönetilebilir.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
            </div>
        );
    }

    const activeCount = templates.filter(t => t.isActive).length;
    const sentToday = logs.filter(l => l.sentAt.startsWith(new Date().toISOString().slice(0, 10))).length;
    const failedCount = logs.filter(l => l.status === "failed").length;

    const tabs: { id: Tab; title: string; icon: typeof Zap; badge?: number }[] = [
        { id: "queue", title: "Gönderim Kuyruğu", icon: Zap, badge: pending.length },
        { id: "templates", title: "Şablonlar", icon: FileText },
        { id: "history", title: "Gönderim Geçmişi", icon: History },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Bildirim Merkezi</h1>
                <p className="text-slate-500 text-sm">
                    Şablonu yaz, tetikleyicisini seç; sistem kuralı sağlayan üyeleri kuyruğa alsın.
                </p>
            </div>

            {/* Özet */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className={cn("border-slate-100 shadow-sm", pending.length > 0 && "bg-blue-50/60 border-blue-200")}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Kuyrukta Bekleyen</CardTitle>
                        <Zap className={cn("h-4 w-4", pending.length > 0 ? "text-blue-500" : "text-slate-300")} />
                    </CardHeader>
                    <CardContent>
                        <div className={cn("text-2xl font-bold tabular-nums", pending.length > 0 ? "text-blue-600" : "text-slate-900")}>
                            {pending.length}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">gönderim hazır</p>
                    </CardContent>
                </Card>

                <Card className="border-slate-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Aktif Şablon</CardTitle>
                        <FileText className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 tabular-nums">{activeCount}</div>
                        <p className="text-xs text-slate-400 mt-1">{templates.length} şablondan</p>
                    </CardContent>
                </Card>

                <Card className="border-slate-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Bugün Gönderilen</CardTitle>
                        <Send className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 tabular-nums">{sentToday}</div>
                        <p className="text-xs text-slate-400 mt-1">mesaj</p>
                    </CardContent>
                </Card>

                <Card className={cn("border-slate-100 shadow-sm", failedCount > 0 && "bg-red-50/50 border-red-200")}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Ulaşmayan</CardTitle>
                        <CircleX className={cn("h-4 w-4", failedCount > 0 ? "text-red-500" : "text-slate-300")} />
                    </CardHeader>
                    <CardContent>
                        <div className={cn("text-2xl font-bold tabular-nums", failedCount > 0 ? "text-red-600" : "text-slate-900")}>
                            {failedCount}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">numara kontrolü gerekiyor</p>
                    </CardContent>
                </Card>
            </div>

            {/* Sekmeler */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100">
                {tabs.map(t => (
                    <Button
                        key={t.id}
                        variant={tab === t.id ? "default" : "outline"}
                        className={cn(
                            "flex items-center gap-2 whitespace-nowrap transition-all",
                            tab === t.id ? "bg-slate-900 text-white shadow-md" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        )}
                        onClick={() => setTab(t.id)}
                    >
                        <t.icon size={16} className={tab === t.id ? "text-blue-400" : "text-slate-400"} />
                        {t.title}
                        {t.badge ? (
                            <span className={cn(
                                "ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                                tab === t.id ? "bg-blue-400 text-slate-900" : "bg-blue-100 text-blue-700"
                            )}>
                                {t.badge}
                            </span>
                        ) : null}
                    </Button>
                ))}
            </div>

            {/* ── KUYRUK ── */}
            {tab === "queue" && (
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-slate-100 py-4">
                        <div>
                            <CardTitle className="text-base font-bold text-slate-800">Bugün gönderilecekler</CardTitle>
                            <p className="text-xs text-slate-500 mt-1">
                                Aktif şablonların tetikleyici kuralları bugünün verisine uygulandı.
                            </p>
                        </div>
                        <Button
                            size="sm"
                            className="bg-slate-900 text-white hover:bg-slate-800"
                            disabled={pending.length === 0 || sending}
                            onClick={handleSendQueue}
                        >
                            {sending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                            Tümünü Gönder ({pending.length})
                        </Button>
                    </CardHeader>
                    <CardContent className="pt-4">
                        {pending.length === 0 ? (
                            <div className="text-center py-12">
                                <CircleCheck className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
                                <p className="text-sm font-medium text-slate-700">Kuyruk boş.</p>
                                <p className="text-xs text-slate-400 mt-1">Şu an kuralları sağlayan üye yok.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {pending.map((p, i) => (
                                    <div key={`${p.template.id}-${p.member.id}-${i}`}
                                        className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/60 p-3">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="h-9 w-9 shrink-0 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                                                {p.template.channel === "sms"
                                                    ? <MessageSquare className="h-4 w-4 text-blue-500" />
                                                    : <Mail className="h-4 w-4 text-purple-500" />}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-sm font-semibold text-slate-900 truncate">{p.member.name}</div>
                                                <div className="text-xs text-slate-500 truncate">
                                                    {renderTemplate(p.template.body, p.member)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-white border border-slate-200 text-slate-500">
                                                {p.template.name}
                                            </span>
                                            <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-amber-50 text-amber-700">
                                                {p.reason}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* ── ŞABLONLAR ── */}
            {tab === "templates" && (
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-slate-100 py-4">
                        <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-slate-400" />
                            Mesaj Şablonları
                        </CardTitle>
                        <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800" onClick={openNew}>
                            <Plus className="h-4 w-4 mr-2" /> Yeni Şablon
                        </Button>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-3">
                        {templates.map(t => (
                            <div key={t.id} className={cn(
                                "rounded-xl border p-4 transition-all",
                                t.isActive ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50/60 opacity-70"
                            )}>
                                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                            <h3 className="text-sm font-bold text-slate-900">{t.name}</h3>
                                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                                {TRIGGER_LABELS[t.trigger]}
                                            </span>
                                            <span className={cn(
                                                "text-[10px] font-bold uppercase px-2 py-0.5 rounded inline-flex items-center gap-1",
                                                t.channel === "sms" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                                            )}>
                                                {t.channel === "sms" ? <MessageSquare className="h-2.5 w-2.5" /> : <Mail className="h-2.5 w-2.5" />}
                                                {t.channel === "sms" ? "SMS" : "E-posta"}
                                            </span>
                                            {t.offsetDays > 0 && (
                                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-700 inline-flex items-center gap-1">
                                                    <Clock className="h-2.5 w-2.5" />
                                                    {t.offsetDays} gün önce
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed font-mono bg-slate-50 rounded-md px-3 py-2 border border-slate-100">
                                            {t.body}
                                        </p>
                                        <p className="text-[11px] text-slate-400 mt-1.5">{TRIGGER_HINTS[t.trigger]}</p>
                                    </div>
                                    <div className="flex sm:flex-col items-center gap-1 shrink-0">
                                        <Button size="icon" variant="ghost" className="h-8 w-8" title="Önizle"
                                            onClick={() => setPreviewTemplate(t)}>
                                            <Eye className="h-3.5 w-3.5 text-slate-400" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8"
                                            title={t.isActive ? "Duraklat" : "Etkinleştir"}
                                            onClick={() => handleToggle(t)}>
                                            <Power className={cn("h-3.5 w-3.5", t.isActive ? "text-emerald-500" : "text-slate-300")} />
                                        </Button>
                                        <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => openEdit(t)}>
                                            Düzenle
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-50"
                                            onClick={() => handleDelete(t.id)}>
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* ── GEÇMİŞ ── */}
            {tab === "history" && (
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="border-b border-slate-100 py-4">
                        <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                            <History className="h-4 w-4 text-slate-400" />
                            Gönderim Geçmişi ({logs.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tarih</TableHead>
                                    <TableHead>Üye</TableHead>
                                    <TableHead>Şablon</TableHead>
                                    <TableHead>Kanal</TableHead>
                                    <TableHead>Durum</TableHead>
                                    <TableHead>İçerik</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.map(l => (
                                    <TableRow key={l.id}>
                                        <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                                            {format(new Date(l.sentAt), "d MMM HH:mm", { locale: tr })}
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm font-medium text-slate-900">{l.memberName}</div>
                                            <div className="text-[11px] text-slate-400">{l.memberPhone}</div>
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-600">{l.templateName}</TableCell>
                                        <TableCell>
                                            <span className={cn(
                                                "text-[10px] font-bold uppercase px-2 py-0.5 rounded",
                                                l.channel === "sms" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                                            )}>
                                                {l.channel === "sms" ? "SMS" : "E-posta"}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className={cn(
                                                "text-[10px] font-bold uppercase px-2 py-0.5 rounded",
                                                l.status === "sent" ? "bg-emerald-50 text-emerald-700" :
                                                l.status === "queued" ? "bg-amber-50 text-amber-700" :
                                                "bg-red-50 text-red-700"
                                            )}>
                                                {l.status === "sent" ? "Ulaştı" : l.status === "queued" ? "Kuyrukta" : "Başarısız"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-500 max-w-md truncate">{l.preview}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {/* Şablon formu */}
            <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{editing ? "Şablonu Düzenle" : "Yeni Şablon"}</DialogTitle>
                        <DialogDescription>
                            Metne değişken eklemek için aşağıdaki etiketlere tıklayın.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="grid gap-4 py-2">
                        <div className="grid gap-2">
                            <Label htmlFor="t-name">Şablon Adı</Label>
                            <Input id="t-name" required value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                placeholder="Örn: Paket Bitiyor Uyarısı" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="grid gap-2 sm:col-span-2">
                                <Label>Tetikleyici</Label>
                                <Select value={form.trigger} onValueChange={v => setForm({ ...form, trigger: v as NotificationTrigger })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {TRIGGERS.map(t => (
                                            <SelectItem key={t} value={t}>{TRIGGER_LABELS[t]}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Kanal</Label>
                                <Select value={form.channel} onValueChange={v => setForm({ ...form, channel: v as NotificationChannel })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sms">SMS</SelectItem>
                                        <SelectItem value="email">E-posta</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <p className="text-[11px] text-slate-500 -mt-2">{TRIGGER_HINTS[form.trigger]}</p>

                        {(form.trigger === "membership_expiring" || form.trigger === "session_reminder" || form.trigger === "inactive_member") && (
                            <div className="grid gap-2">
                                <Label htmlFor="t-offset">Kaç gün önce/sonra</Label>
                                <Input id="t-offset" type="number" min="0" value={form.offsetDays}
                                    onChange={e => setForm({ ...form, offsetDays: Number(e.target.value) })} />
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="t-body">Mesaj Metni</Label>
                            <Textarea id="t-body" required rows={4} value={form.body}
                                onChange={e => setForm({ ...form, body: e.target.value })}
                                className="font-mono text-sm" />
                            <div className="flex flex-wrap gap-1.5 mt-1">
                                {TEMPLATE_VARIABLES.map(v => (
                                    <button key={v.key} type="button" title={v.desc}
                                        onClick={() => insertVariable(v.key)}
                                        className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-mono text-slate-600 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                                        {v.key}
                                    </button>
                                ))}
                            </div>
                            <p className="text-[11px] text-slate-400">
                                {form.body.length} karakter — SMS 160 karakterde bir kredi harcar.
                            </p>
                        </div>

                        <label className="flex items-center gap-2 text-sm text-slate-600">
                            <input type="checkbox" checked={form.isActive}
                                onChange={e => setForm({ ...form, isActive: e.target.checked })}
                                className="h-4 w-4 rounded border-slate-300" />
                            Şablon aktif (tetikleyici çalışsın)
                        </label>

                        <DialogFooter className="mt-2">
                            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>İptal</Button>
                            <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800">Kaydet</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Önizleme */}
            <Dialog open={!!previewTemplate} onOpenChange={(o) => !o && setPreviewTemplate(null)}>
                <DialogContent className="sm:max-w-[460px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <BellRing className="h-4 w-4 text-slate-400" />
                            {previewTemplate?.name}
                        </DialogTitle>
                        <DialogDescription>
                            Gerçek üye verisiyle doldurulmuş hâli.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 py-2 max-h-[360px] overflow-y-auto">
                        {previewTemplate && members.slice(0, 4).map(m => (
                            <div key={m.id} className="rounded-lg bg-slate-900 text-white p-3">
                                <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1.5">
                                    {m.name} · {m.phone}
                                </div>
                                <p className="text-sm leading-relaxed">
                                    {renderTemplate(previewTemplate.body, m)}
                                </p>
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPreviewTemplate(null)}>Kapat</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
