"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
    Users,
    CreditCard,
    CalendarClock,
    Plus,
    Loader2,
    AlertTriangle,
    MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getMonthlySessions } from "@/lib/services/sessionService";
import { getMembers, addMember } from "@/lib/services/memberService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Session, Member } from "@/types";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import WeeklyChart from "@/components/dashboard/WeeklyChart";

export default function DashboardPage() {
    const { user } = useAuth();
    const [todaySessions, setTodaySessions] = useState<Session[]>([]);
    const [allSessions, setAllSessions] = useState<Session[]>([]);
    const [lowBalanceMembers, setLowBalanceMembers] = useState<Member[]>([]);
    const [totalMembers, setTotalMembers] = useState(0);
    const [activeMembersNum, setActiveMembersNum] = useState(0);
    const [passiveMembersNum, setPassiveMembersNum] = useState(0);
    const [preRegMembersNum, setPreRegMembersNum] = useState(0);
    const [monthlyRevenue, setMonthlyRevenue] = useState(0);
    const [loading, setLoading] = useState(true);
    // const [completedCount, setCompletedCount] = useState(0); // Kaldırıldı
    const [activityStats, setActivityStats] = useState<{ name: string, count: number, completed: number }[]>([]);

    // Quick Add Member State
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [newMemberData, setNewMemberData] = useState({ name: "", phone: "", branch: "" });

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Bu ayın tüm derslerini çek
            const now = new Date();
            const sessions = await getMonthlySessions(now);
            setAllSessions(sessions);

            // 2. Bugüne ait olanları filtrele
            const todayStr = format(now, "yyyy-MM-dd");
            const todays = sessions.filter(s => s.date === todayStr);

            // Saat sırasına göre diz
            todays.sort((a, b) => a.time.localeCompare(b.time));
            setTodaySessions(todays);

            // 3. Aktivite İstatistikleri
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();

            const isCompleted = (time: string) => {
                const [h, m] = time.split(':').map(Number);
                return h < currentHour || (h === currentHour && m < currentMinute);
            };

            // const completed = todays.filter(s => isCompleted(s.time)).length;
            // setCompletedCount(completed);

            const stats: Record<string, { total: number, completed: number }> = {};
            todays.forEach(s => {
                if (!stats[s.activity]) {
                    stats[s.activity] = { total: 0, completed: 0 };
                }
                stats[s.activity].total += 1;
                if (isCompleted(s.time)) {
                    stats[s.activity].completed += 1;
                }
            });

            const sortedStats = Object.entries(stats)
                .map(([name, data]) => ({
                    name,
                    count: data.total,
                    completed: data.completed
                }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 3); // İlk 3 tanesini göster
            setActivityStats(sortedStats);

            // 4. Kritik Bakiye ve Ciro Hesaplama
            const members = await getMembers();
            setTotalMembers(members.length); // Toplam üye sayısını güncelle
            setActiveMembersNum(members.filter(m => m.status === 'active').length);
            setPassiveMembersNum(members.filter(m => m.status === 'passive').length);
            setPreRegMembersNum(members.filter(m => m.status === 'pre-registration').length);

            const alerts = members.filter(m => m.remainingSessions <= 3);
            setLowBalanceMembers(alerts);

            // Ciro Hesaplama (Bu ay yapılan ödemeler)
            const currentMonthPrefix = format(now, "yyyy-MM");
            const revenue = members
                .filter(m =>
                    m.lastPaymentDate?.startsWith(currentMonthPrefix) &&
                    m.paymentMethod !== 'Ödeme Alınmadı'
                )
                .reduce((sum, m) => sum + (m.paymentAmount || 0), 0);
            setMonthlyRevenue(revenue);

        } catch (error) {
            console.error("Veri hatası", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleQuickAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addMember({
                name: newMemberData.name,
                phone: newMemberData.phone,
                branch: newMemberData.branch,
                email: "",
                status: "active",
                membershipType: "Standart",
                remainingSessions: 0,
                paymentAmount: 0,
                paymentMethod: "Nakit",
                addedBy: user?.username || 'Bilinmiyor',
                joinDate: new Date().toISOString().split('T')[0]
            } as any);
            setIsAddMemberOpen(false);
            setNewMemberData({ name: "", phone: "", branch: "" });
            alert("Üye başarıyla eklendi");
            fetchData(); // Refresh counts
        } catch (error) {
            console.error("Hızlı üye ekleme hatası", error);
            alert("Bir hata oluştu");
        }
    };

    const handleSendSMS = () => {
        alert(`${lowBalanceMembers.length} üyeye hatırlatma SMS'i gönderildi!`);
    };

    return (
        <div className="space-y-8">

            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Yönetim Paneli</h1>
                    <p className="text-slate-500 mt-1">
                        Hoş geldin <span className="font-semibold text-slate-800">{user?.username}</span>, bugünün özeti aşağıda.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/dashboard/appointments?action=new">
                        <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Yeni Randevu
                        </Button>
                    </Link>
                    <Button size="sm" variant="outline" onClick={() => setIsAddMemberOpen(true)}>
                        Hızlı Üye Ekle
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Card 1: Member Statistics (Combined) */}
                <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Üye Durumları</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-slate-500">Toplam</p>
                                <div className="text-xl font-bold text-slate-900">{totalMembers}</div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-slate-500">Aktif</p>
                                <div className="text-xl font-bold text-green-600">{activeMembersNum}</div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-slate-500">Pasif</p>
                                <div className="text-xl font-bold text-red-600">{passiveMembersNum}</div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-slate-500">Ön Kayıt</p>
                                <div className="text-xl font-bold text-orange-600">{preRegMembersNum}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Card 2: Today's Appointments */}
                <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Bugünkü Randevular</CardTitle>
                        <CalendarClock className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
                        ) : (
                            <div className="space-y-3">
                                <div className="flex items-baseline gap-2">
                                    <div className="text-2xl font-bold text-slate-900">{todaySessions.length}</div>
                                    <span className="text-xs text-slate-500 font-medium">Toplam Ders</span>
                                </div>

                                <div className="space-y-1.5">
                                    {activityStats.length > 0 ? (
                                        activityStats.map((stat, idx) => (
                                            <div key={idx} className="flex flex-col gap-0.5 text-xs">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center font-semibold text-slate-700">
                                                        <div className={`h-1.5 w-1.5 rounded-full mr-2 ${stat.completed === stat.count ? 'bg-green-500' : 'bg-blue-500'}`} />
                                                        {stat.name}
                                                    </div>
                                                    <span className="text-slate-500">
                                                        {stat.completed}/{stat.count} Bitti
                                                    </span>
                                                </div>
                                                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden ml-3.5" style={{ width: 'calc(100% - 14px)' }}>
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-500 ${stat.completed === stat.count ? 'bg-green-500' : 'bg-blue-500'}`}
                                                        style={{ width: `${(stat.completed / stat.count) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-400">Ders bulunamadı</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Card 3: Low Balance Alerts */}
                <Card className={`border-slate-100 shadow-sm hover:shadow-md transition-shadow ${lowBalanceMembers.length > 0 ? 'bg-orange-50/50 border-orange-200' : ''}`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Paketi Bitenler</CardTitle>
                        <AlertTriangle className={`h-4 w-4 ${lowBalanceMembers.length > 0 ? 'text-orange-500 animate-pulse' : 'text-slate-300'}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <div className={`text-2xl font-bold ${lowBalanceMembers.length > 0 ? 'text-orange-600' : 'text-slate-900'}`}>
                                    {lowBalanceMembers.length}
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                    Üyenin hakkı 3 veya daha az
                                </p>
                            </div>
                            {lowBalanceMembers.length > 0 && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleSendSMS}
                                    className="h-8 text-xs border-orange-200 text-orange-700 hover:bg-orange-100 hover:text-orange-800"
                                >
                                    <MessageSquare className="mr-1.5 h-3 w-3" />
                                    SMS
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Card 4: Monthly Revenue (Live) - Only for Admin */}
                {user?.role === 'admin' && (
                    <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow bg-slate-900 text-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-300">Bu Ayki Ciro</CardTitle>
                            <CreditCard className="h-4 w-4 text-slate-300" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">
                                ₺{monthlyRevenue.toLocaleString()}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                                Son güncelleme: {format(new Date(), 'HH:mm')}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Card 4: Staff Profile - Only for Staff */}
                {user?.role === 'staff' && (
                    <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                        <div className="flex h-32">
                            <div className="w-32 h-full relative shrink-0 overflow-hidden bg-slate-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="/anil.jpeg"
                                    alt="Anıl Hoca"
                                    className="object-cover w-full h-full scale-125 transition-transform duration-500 hover:scale-110 object-[50%_35%]"
                                />
                            </div>
                            <div className="flex-1 p-4 flex flex-col justify-center">
                                <h3 className="font-bold text-lg text-slate-900">{user?.username || 'Personel'}</h3>
                                <p className="text-sm text-slate-500 mb-2">Eğitmen / Personel</p>
                                <div className="text-xs text-green-600 font-medium flex items-center bg-green-50 px-2.5 py-1 rounded w-fit">
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></div>
                                    Aktif
                                </div>
                            </div>
                        </div>
                    </Card>
                )}
            </div>

            {/* Recent Activity / Schedule */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Chart Area (Weekly Schedule) */}
                <Card className="col-span-2 border-slate-100 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-slate-800">Randevu Yoğunluğu</CardTitle>
                        <CardDescription>Önümüzdeki 7 günün doluluk oranı</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center pt-2">
                        {loading ? <Loader2 className="h-8 w-8 animate-spin text-slate-300" /> : <WeeklyChart sessions={allSessions} />}
                    </CardContent>
                </Card>

                {/* Today's Schedule List */}
                <Card className="col-span-1 border-slate-100 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-slate-800">Yaklaşan Randevular</CardTitle>
                        <CardDescription>Bugün ({format(new Date(), 'd MMMM', { locale: tr })})</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                            {loading ? (
                                <div className="flex justify-center py-4">
                                    <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
                                </div>
                            ) : todaySessions.length === 0 ? (
                                <p className="text-sm text-slate-400 text-center py-4">Bugün için planlanmış randevu yok.</p>
                            ) : (
                                <>
                                    {todaySessions.map((session) => (
                                        <div key={session.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-50 bg-slate-50/50 hover:bg-slate-100 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                                    {session.time}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">{session.activity}</p>
                                                    <p className="text-xs text-slate-500">{session.instructor || 'Eğitmen Yok'}</p>
                                                </div>
                                            </div>
                                            {session.status === 'full' ? (
                                                <div className="h-2 w-2 rounded-full bg-red-500" title="Dolu"></div>
                                            ) : (
                                                <div className="h-2 w-2 rounded-full bg-green-500" title="Yer Var"></div>
                                            )}
                                        </div>
                                    ))}
                                    <Link href="/dashboard/appointments">
                                        <Button variant="ghost" className="w-full text-xs text-slate-500 mt-2">
                                            Tümünü Gör
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* Quick Add Member Modal */}
            <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Hızlı Üye Ekle</DialogTitle>
                        <DialogDescription>
                            Sisteme hızlıca yeni bir üye kaydedin. Detaylı bilgileri daha sonra Üyeler sayfasından güncelleyebilirsiniz.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleQuickAddMember} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="quick-name">Ad Soyad</Label>
                            <Input
                                id="quick-name"
                                value={newMemberData.name}
                                onChange={(e) => setNewMemberData({ ...newMemberData, name: e.target.value })}
                                required
                                placeholder="Örn: Ahmet Yılmaz"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="quick-phone">Telefon</Label>
                            <Input
                                id="quick-phone"
                                value={newMemberData.phone}
                                onChange={(e) => setNewMemberData({ ...newMemberData, phone: e.target.value })}
                                required
                                placeholder="05XX XXX XX XX"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="quick-branch">İlgilendiği Branş (Opsiyonel)</Label>
                            <Input
                                id="quick-branch"
                                value={newMemberData.branch}
                                onChange={(e) => setNewMemberData({ ...newMemberData, branch: e.target.value })}
                                placeholder="Örn: Reformer Pilates"
                            />
                        </div>
                        <DialogFooter className="mt-4">
                            <Button type="button" variant="outline" onClick={() => setIsAddMemberOpen(false)}>İptal</Button>
                            <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800">Kaydet</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

        </div>
    );
}
