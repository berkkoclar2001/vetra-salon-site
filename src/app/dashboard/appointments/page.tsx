"use client";

import { useState, useEffect, Suspense } from "react";
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    startOfWeek,
    endOfWeek,
    addWeeks,
    subWeeks,
    addDays,
    subDays,
    parseISO
} from "date-fns";
import { tr } from "date-fns/locale";
import {
    ChevronLeft,
    ChevronRight,
    Users,
    X,
    Loader2,
    Plus,
    Minus,
    Trash2,
    Clock,
    User,
    Calendar as CalendarIcon,
    Table as TableIcon,
    LayoutList,
    FileText,
    Settings2,
    Bell,
    Info,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

import { getMonthlySessions, cancelAppointment, createSession, deleteSession, addParticipantToSession, updateSessionCapacity, getRecurringSessions, addRecurringSession, deleteRecurringSession } from "@/lib/services/sessionService";
import { getInstructors, addInstructor } from "@/lib/services/staffService";
import { getMembers } from "@/lib/services/memberService";
import { getBusinessHours } from "@/lib/services/managementService";
import { getReminders, addReminder, deleteReminder } from "@/lib/services/reminderService";
import { Session, Member, Participant, RecurringSession, BusinessHours, Instructor, StaffMember, Reminder } from "@/types";
import { cn } from "@/lib/utils";

import { useSearchParams } from "next/navigation";

function AppointmentsContent() {
    const searchParams = useSearchParams();
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
    const [sessions, setSessions] = useState<Session[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [instructors, setInstructors] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [mainTab, setMainTab] = useState<"calendar" | "list" | "sessions" | "reminders">("calendar");
    const [listViewMode, setListViewMode] = useState<"table" | "summary" | "members">("table");
    const [searchTerm, setSearchTerm] = useState("");
    const [recurringSessions, setRecurringSessions] = useState<RecurringSession[]>([]);
    const [businessHours, setBusinessHours] = useState<BusinessHours | null>(null);
    const [reminders, setReminders] = useState<Reminder[]>([]);

    // Detay Modalı State
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [tempCapacity, setTempCapacity] = useState<number | null>(null);
    const [isApplyingCapacity, setIsApplyingCapacity] = useState(false);

    // Hatırlatıcı Ajandası State
    const [isAddReminderOpen, setIsAddReminderOpen] = useState(false);
    const [selectedReminderDate, setSelectedReminderDate] = useState<string>("");
    const [newReminderText, setNewReminderText] = useState("");
    const [newReminderType, setNewReminderType] = useState<'info' | 'important'>('info');
    const [newReminderCreatedBy, setNewReminderCreatedBy] = useState("");
    const [newReminderColor, setNewReminderColor] = useState("#3B82F6");

    // Yeni Ders Ekleme State
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newSessionData, setNewSessionData] = useState<{
        date: string;
        time: string;
        activity: string;
        level: string;
        instructor: string;
        capacity: string;
        participants: Participant[];
    }>({
        date: format(new Date(), "yyyy-MM-dd"),
        time: "09:00",
        activity: "",
        level: "",
        instructor: "",
        capacity: "8",
        participants: []
    });
    const [addingSession, setAddingSession] = useState(false);
    const [isAddRecurringOpen, setIsAddRecurringOpen] = useState(false);
    const [newRecurringData, setNewRecurringData] = useState<any>({
        dayOfWeek: 1,
        time: "09:00",
        activity: "",
        level: "",
        instructor: "",
        capacity: 8
    });
    const [addingRecurring, setAddingRecurring] = useState(false);

    // Verileri çek (Ay değiştiğinde çalışır)
    useEffect(() => {
        const fetchInfos = async () => {
            setLoading(true);
            try {
                const [sessionsData, instructorsData, membersData] = await Promise.all([
                    getMonthlySessions(currentDate),
                    getInstructors(),
                    getMembers()
                ]);
                setSessions(sessionsData);
                setInstructors(instructorsData);
                setMembers(membersData);

                // İlk yüklemede varsayılan hocayı seç (eğer varsa)
                if (instructorsData.length > 0) {
                    setNewSessionData(prev => ({ ...prev, instructor: instructorsData[0].name }));
                }

            } catch (error) {
                console.error("Veriler çekilemedi", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInfos();
    }, [currentDate]);

    // Kalıcı seansları ve çalışma saatlerini çek
    useEffect(() => {
        const fetchRecurringAndHours = async () => {
            try {
                const [recurringData, hoursData] = await Promise.all([
                    getRecurringSessions(),
                    getBusinessHours()
                ]);
                setRecurringSessions(recurringData);
                setBusinessHours(hoursData);
            } catch (error) {
                console.error("Veriler çekilemedi", error);
            }
        };
        fetchRecurringAndHours();
    }, []);

    // Hatırlatıcıları çek
    useEffect(() => {
        const fetchRemindersData = async () => {
            try {
                const data = await getReminders();
                setReminders(data);
            } catch (error) {
                console.error("Hatırlatıcılar çekilemedi", error);
            }
        };
        fetchRemindersData();
    }, [mainTab]);

    // URL'den gelen action kontrolü
    useEffect(() => {
        if (searchParams.get("action") === "new") {
            setIsAddOpen(true);
        }
    }, [searchParams]);

    // Hoca listesi güncellendiğinde (örneğin yeni hoca eklendiğinde bunu yakalayabiliriz ama
    // mockta sayfayı yenilemek yetecek. Yine de `focus` eventinde re-fetch yapılabilir.)
    // Basitlik için sadece ilk açılışta ve ay değişiminde çekiyoruz.

    // Ay değiştirme
    // Navigasyon Değiştirme
    const handlePrev = () => {
        if (viewMode === "month") setCurrentDate(prev => subMonths(prev, 1));
        else if (viewMode === "week") setCurrentDate(prev => subWeeks(prev, 1));
        else setCurrentDate(prev => subDays(prev, 1));
    };

    const handleNext = () => {
        if (viewMode === "month") setCurrentDate(prev => addMonths(prev, 1));
        else if (viewMode === "week") setCurrentDate(prev => addWeeks(prev, 1));
        else setCurrentDate(prev => addDays(prev, 1));
    };

    const handleToday = () => setCurrentDate(new Date());

    // Takvim Grid Hesaplamaları
    const getCalendarDays = () => {
        if (viewMode === "month") {
            const monthStart = startOfMonth(currentDate);
            const monthEnd = endOfMonth(monthStart);
            const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
            const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
            return eachDayOfInterval({ start: startDate, end: endDate });
        } else if (viewMode === "week") {
            const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
            const endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
            return eachDayOfInterval({ start: startDate, end: endDate });
        } else {
            return [currentDate];
        }
    };

    const calendarDays = getCalendarDays();
    const weekDays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

    // --- HELPER: Görünen Seansları Filtrele (Kalıcı Seansları Dahil Et) ---
    const getVisibleSessions = (day: Date) => {
        const dayString = format(day, "yyyy-MM-dd");
        const dayOfWeek = day.getDay();
        const config = businessHours?.[dayOfWeek];

        // Eğer gün kapalıysa hiçbir seans gösterme (veya kapalı uyarısı gösterilebilir)
        if (config && !config.isOpen) return [];

        // 1. Somut seanslar (Veritabanında/State'de olanlar)
        // İş saatleri dışındakileri de filtreleyelim
        const concreteSessions = sessions.filter(s => {
            if (s.date !== dayString) return false;
            if (config && (s.time < config.open || s.time > config.close)) return false;
            return true;
        });

        // 2. Kalıcı seans şablonları
        // İş saatleri dışındakileri filtrele
        const templates = recurringSessions.filter(rs => {
            if (rs.dayOfWeek !== dayOfWeek) return false;
            if (config && (rs.time < config.open || rs.time > config.close)) return false;
            return true;
        });

        // Birleştir: Eğer template için o gün o saatte ayarlanmış bir seans yoksa sanal olarak ekle
        const combined = [...concreteSessions].map(s => {
            const instructor = instructors.find(i => i.name === s.instructor);
            return { ...s, color: instructor?.color };
        });

        templates.forEach(rs => {
            const isCreated = concreteSessions.some(cs => cs.time === rs.time && cs.activity === rs.activity);
            if (!isCreated) {
                const instructor = instructors.find(i => i.name === rs.instructor);
                // Sanal seans: Bir katılımcı eklenene kadar veya hoca manuel açana kadar şablon olarak görünür
                combined.push({
                    id: -(rs.id * 1000 + day.getDate()), // Geçici/Negatif ID
                    date: dayString,
                    time: rs.time,
                    activity: rs.activity,
                    instructor: rs.instructor,
                    color: instructor?.color,
                    capacity: rs.capacity,
                    enrolledCount: 0,
                    status: 'active',
                    participants: [],
                    isRecurring: true
                } as any);
            }
        });

        // Saat sırasına göre diz
        combined.sort((a, b) => a.time.localeCompare(b.time));

        let filtered = combined;
        const isToday = isSameDay(day, new Date());

        if (isToday) {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();

            filtered = combined.filter(s => {
                const [h, m] = s.time.split(':').map(Number);
                if (h < currentHour) return false;
                if (h === currentHour && m < currentMinute) return false;
                return true;
            });
        }

        // Ay modunda sadece ilk 3 tanesini göster
        return viewMode === "month" ? filtered.slice(0, 3) : filtered;
    };

    // --- HANDLERS ---
    const handleCancelParticipant = async (sessionId: number, participantId: number) => {
        setProcessingId(participantId);
        try {
            await cancelAppointment(sessionId, participantId);
            setSessions(prev => prev.map(s => {
                if (s.id === sessionId) {
                    const newParticipants = s.participants.map(p =>
                        p.id === participantId ? { ...p, status: 'cancelled' } as Participant : p
                    );
                    return {
                        ...s,
                        participants: newParticipants,
                        enrolledCount: newParticipants.filter(p => p.status !== 'cancelled').length,
                        status: 'active' // İptal gelince doluluk boşalabilir
                    } as Session;
                }
                return s;
            }));

            // Detay modalını güncelle
            if (selectedSession && selectedSession.id === sessionId) {
                const newParticipants = selectedSession.participants.map(p =>
                    p.id === participantId ? { ...p, status: 'cancelled' } as Participant : p
                );
                setSelectedSession({
                    ...selectedSession,
                    participants: newParticipants,
                    enrolledCount: newParticipants.filter(p => p.status !== 'cancelled').length,
                    status: 'active'
                });
            }
        } catch (error) {
            console.error(error);
            alert("İptal işlemi başarısız oldu.");
        } finally {
            setProcessingId(null);
        }
    };

    const handleAddParticipantToExisting = async (sessionId: number, member: Member) => {
        if (!selectedSession) return;
        if (selectedSession.enrolledCount >= selectedSession.capacity) {
            alert("Kapasite doldu!");
            return;
        }

        setProcessingId(member.id);
        try {
            const result = await addParticipantToSession(sessionId, {
                id: member.id,
                name: member.name,
                phone: member.phone,
                status: 'active' as const
            });

            if (result.success && result.participant) {
                const newParticipant = result.participant;
                setSessions(prev => prev.map(s => {
                    if (s.id === sessionId) {
                        const newParticipants = [...s.participants, newParticipant];
                        const count = newParticipants.filter(p => p.status !== 'cancelled').length;
                        return {
                            ...s,
                            participants: newParticipants,
                            enrolledCount: count,
                            status: count >= s.capacity ? 'full' : 'active'
                        } as Session;
                    }
                    return s;
                }));

                // Detay modalını güncelle
                const newParticipants = [...selectedSession.participants, newParticipant];
                const count = newParticipants.filter(p => p.status !== 'cancelled').length;
                setSelectedSession({
                    ...selectedSession,
                    participants: newParticipants as Participant[],
                    enrolledCount: count,
                    status: count >= selectedSession.capacity ? 'full' : 'active'
                });
            }
        } catch (error) {
            console.error(error);
            alert("Üye eklenemedi.");
        } finally {
            setProcessingId(null);
        }
    };

    const handleUpdateCapacity = (newCapacity: number) => {
        if (!selectedSession || newCapacity < 1) return;
        setTempCapacity(newCapacity);
    };

    const handleApplyCapacity = async () => {
        if (!selectedSession || tempCapacity === null || tempCapacity === selectedSession.capacity) return;

        setIsApplyingCapacity(true);
        try {
            if (selectedSession.id < 0) {
                // Sanal seansı somutlaştır (Concretize)
                const newSession = await createSession({
                    ...selectedSession,
                    id: undefined, // Yeni pozitif ID atanacak
                    capacity: tempCapacity,
                    status: (selectedSession.enrolledCount ?? 0) >= tempCapacity ? 'full' : 'active'
                });

                setSessions(prev => [...prev, newSession]);
                setSelectedSession(newSession);
            } else {
                // Mevcut seansı güncelle
                await updateSessionCapacity(selectedSession.id, tempCapacity);

                setSessions(prev => prev.map(s => {
                    if (s.id === selectedSession.id) {
                        return {
                            ...s,
                            capacity: tempCapacity,
                            status: s.enrolledCount >= tempCapacity ? 'full' : 'active'
                        };
                    }
                    return s;
                }));

                setSelectedSession(prev => prev ? {
                    ...prev,
                    capacity: tempCapacity,
                    status: prev.enrolledCount >= tempCapacity ? 'full' : 'active'
                } : null);
            }

            setTempCapacity(null);

        } catch (error) {
            console.error(error);
            alert("Kontenjan güncellenemedi.");
        } finally {
            setIsApplyingCapacity(false);
        }
    };

    const handleDeleteSession = async () => {
        if (!selectedSession) return;
        if (!confirm("Bu dersi ve tüm kayıtları silmek istediğinize emin misiniz?")) return;

        setProcessingId(selectedSession.id);
        try {
            await deleteSession(selectedSession.id);
            setSessions(prev => prev.filter(s => s.id !== selectedSession.id));
            setIsDetailOpen(false);
        } catch (error) {
            console.error(error);
            alert("Ders silinemedi.");
        } finally {
            setProcessingId(null);
        }
    };

    const handleAddSession = async () => {
        // Çalışma saatleri kontrolü
        if (businessHours) {
            const sessionDate = parseISO(newSessionData.date);
            const dayOfWeek = sessionDate.getDay();
            const config = businessHours[dayOfWeek];

            if (config) {
                if (!config.isOpen) {
                    alert("Salon bu gün kapalıdır!");
                    return;
                }
                if (newSessionData.time < config.open || newSessionData.time > config.close) {
                    alert(`Seçilen saat çalışma saatleri (${config.open} - ${config.close}) dışındadır!`);
                    return;
                }
            }
        }

        setAddingSession(true);
        try {
            const instructorName = newSessionData.instructor.trim();
            if (!instructorName) {
                alert("Lütfen bir eğitmen seçin.");
                return;
            }

            if (!newSessionData.activity || !newSessionData.level) {
                alert("Lütfen ders ve seviye seçin.");
                return;
            }

            const newSession = await createSession({
                id: Math.floor(Math.random() * 10000),
                ...newSessionData,
                capacity: parseInt(newSessionData.capacity),
                enrolledCount: newSessionData.participants.length,
                status: 'active'
            } as any);

            setSessions(prev => [...prev, newSession]);
            setIsAddOpen(false);
            setNewSessionData({
                date: format(new Date(), "yyyy-MM-dd"),
                time: "09:00",
                activity: "",
                level: "",
                instructor: "",
                capacity: "8",
                participants: []
            });
        } catch (error) {
            console.error("Ders oluşturulamadı.", error);
            alert("Ders oluşturulamadı.");
        } finally {
            setAddingSession(false);
        }
    };

    const handleAddRecurring = async (e: React.FormEvent) => {
        e.preventDefault();

        // Çalışma saatleri kontrolü
        if (businessHours) {
            const config = businessHours[newRecurringData.dayOfWeek];
            if (config) {
                if (!config.isOpen) {
                    alert("Seçilen gün için salon kapalıdır!");
                    return;
                }
                if (newRecurringData.time < config.open || newRecurringData.time > config.close) {
                    alert(`Seçilen saat çalışma saatleri (${config.open} - ${config.close}) dışındadır!`);
                    return;
                }
            }
        }

        setAddingRecurring(true);
        try {
            if (!newRecurringData.instructor || !newRecurringData.activity || !newRecurringData.level) {
                alert("Lütfen eğitmen, ders ve seviye seçin.");
                setAddingRecurring(false);
                return;
            }

            const added = await addRecurringSession({
                ...newRecurringData,
                level: newRecurringData.level
            } as any);
            setRecurringSessions([...recurringSessions, added]);
            setIsAddRecurringOpen(false);
            setNewRecurringData({
                dayOfWeek: 1,
                time: "09:00",
                activity: "",
                level: "",
                instructor: "",
                capacity: 8
            });
        } catch (error) {
            console.error(error);
            alert("Kalıcı seans eklenemedi.");
        } finally {
            setAddingRecurring(false);
        }
    };

    const handleDeleteRecurring = async (id: number) => {
        if (!confirm("Bu kalıcı seansı silmek istediğinize emin misiniz?")) return;
        try {
            await deleteRecurringSession(id);
            setRecurringSessions(recurringSessions.filter(s => s.id !== id));
        } catch (error) {
            console.error(error);
            alert("Silme işlemi başarısız.");
        }
    };

    const handleAddReminder = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const added = await addReminder({
                date: selectedReminderDate,
                text: newReminderText,
                type: newReminderType,
                createdBy: newReminderCreatedBy,
                color: newReminderColor
            });
            setReminders([...reminders, added]);
            setIsAddReminderOpen(false);
            setNewReminderText("");
            setNewReminderCreatedBy("");
            setNewReminderColor("#3B82F6");
        } catch (error) {
            console.error(error);
            alert("Hatırlatıcı eklenemedi.");
        }
    };

    const handleDeleteReminder = async (id: number) => {
        if (!confirm("Bu hatırlatıcıyı silmek istediğinize emin misiniz?")) return;
        try {
            await deleteReminder(id);
            setReminders(reminders.filter(r => r.id !== id));
        } catch (error) {
            console.error(error);
            alert("Silme işlemi başarısız.");
        }
    };

    return (
        <div className="space-y-6 h-full flex flex-col">

            {/* Main Tabs (Calendar / List) */}
            <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit self-center sm:self-start">
                <Button
                    variant={mainTab === "calendar" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setMainTab("calendar")}
                    className={cn(
                        "rounded-lg px-6 font-semibold transition-all",
                        mainTab === "calendar" ? "bg-white shadow-sm text-slate-900 border border-slate-200" : "text-slate-500 hover:text-slate-900"
                    )}
                >
                    <CalendarIcon size={16} className="mr-2" />
                    Takvim
                </Button>
                <Button
                    variant={mainTab === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setMainTab("list")}
                    className={cn(
                        "rounded-lg px-6 font-semibold transition-all",
                        mainTab === "list" ? "bg-white shadow-sm text-slate-900 border border-slate-200" : "text-slate-500 hover:text-slate-900"
                    )}
                >
                    <LayoutList size={16} className="mr-2" />
                    Rezervasyon Listesi
                </Button>
                <Button
                    variant={mainTab === "sessions" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setMainTab("sessions")}
                    className={cn(
                        "rounded-lg px-6 font-semibold transition-all",
                        mainTab === "sessions" ? "bg-white shadow-sm text-slate-900 border border-slate-200" : "text-slate-500 hover:text-slate-900"
                    )}
                >
                    <Settings2 size={16} className="mr-2" />
                    Sabit Seanslar
                </Button>
                <Button
                    variant={mainTab === "reminders" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setMainTab("reminders")}
                    className={cn(
                        "rounded-lg px-6 font-semibold transition-all",
                        mainTab === "reminders" ? "bg-white shadow-sm text-slate-900 border border-slate-200" : "text-slate-500 hover:text-slate-900"
                    )}
                >
                    <CalendarIcon size={16} className="mr-2" />
                    Hatırlatıcı Ajandası
                </Button>
            </div>

            {/* Header & Controls */}
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex flex-wrap items-center gap-4">
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        {mainTab === "calendar" ? "Ders Takvimi" : mainTab === "list" ? "Üye Rezervasyon Listesi" : mainTab === "sessions" ? "Sabit Seans Yönetimi" : "Hatırlatıcı Ajandası"}
                    </h1>

                    {mainTab === "calendar" && (
                        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
                            <Button
                                variant={viewMode === "month" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setViewMode("month")}
                                className={cn("h-8 text-xs px-4", viewMode === "month" ? "bg-white text-slate-900 shadow-sm hover:bg-white" : "text-slate-500 hover:text-slate-900")}
                            >
                                Ay
                            </Button>
                            <Button
                                variant={viewMode === "week" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setViewMode("week")}
                                className={cn("h-8 text-xs px-4", viewMode === "week" ? "bg-white text-slate-900 shadow-sm hover:bg-white" : "text-slate-500 hover:text-slate-900")}
                            >
                                Hafta
                            </Button>
                            <Button
                                variant={viewMode === "day" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setViewMode("day")}
                                className={cn("h-8 text-xs px-4", viewMode === "day" ? "bg-white text-slate-900 shadow-sm hover:bg-white" : "text-slate-500 hover:text-slate-900")}
                            >
                                Gün
                            </Button>
                        </div>
                    )}

                    {mainTab === "list" && (
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
                                <Button
                                    variant={listViewMode === "table" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setListViewMode("table")}
                                    className={cn("h-8 text-xs px-4 whitespace-nowrap", listViewMode === "table" ? "bg-white text-slate-900 shadow-sm hover:bg-white" : "text-slate-500 hover:text-slate-900")}
                                >
                                    <TableIcon size={14} className="mr-2" />
                                    Tablo Görünümü
                                </Button>
                                <Button
                                    variant={listViewMode === "summary" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => {
                                        setListViewMode("summary");
                                        setViewMode("day");
                                    }}
                                    className={cn("h-8 text-xs px-4 whitespace-nowrap", listViewMode === "summary" ? "bg-white text-slate-900 shadow-sm hover:bg-white" : "text-slate-500 hover:text-slate-900")}
                                >
                                    <FileText size={14} className="mr-2" />
                                    Günlük Özet Görünümü
                                </Button>
                                <Button
                                    variant={listViewMode === "members" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => {
                                        setListViewMode("members");
                                        setViewMode("week");
                                    }}
                                    className={cn("h-8 text-xs px-4 whitespace-nowrap", listViewMode === "members" ? "bg-white text-slate-900 shadow-sm hover:bg-white" : "text-slate-500 hover:text-slate-900")}
                                >
                                    <Users size={14} className="mr-2" />
                                    Üyeler Görünümü
                                </Button>
                            </div>

                            <div className="relative">
                                <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <Input
                                    placeholder="Ara (İsim/Telefon)..."
                                    className="pl-9 h-8 text-[11px] w-[180px] bg-white border-slate-200"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {(listViewMode === "summary" || listViewMode === "members") && (
                                <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-200 shadow-sm">
                                    <Button variant="ghost" size="icon" onClick={handlePrev} className="h-7 w-7 hover:bg-slate-50">
                                        <ChevronLeft className="h-3.5 w-3.5 text-slate-600" />
                                    </Button>
                                    <span className="text-[10px] font-bold text-slate-700 min-w-[110px] text-center px-1 select-none">
                                        {listViewMode === "members"
                                            ? `${format(startOfWeek(currentDate, { weekStartsOn: 1 }), "d MMM")} - ${format(endOfWeek(currentDate, { weekStartsOn: 1 }), "d MMM yyyy")}`
                                            : format(currentDate, "d MMMM yyyy", { locale: tr })
                                        }
                                    </span>
                                    <Button variant="ghost" size="icon" onClick={handleNext} className="h-7 w-7 hover:bg-slate-50">
                                        <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    { (mainTab === "calendar" || mainTab === "list") && (
                        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                                    <Plus size={16} />
                                    Ders Aç
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Yeni Ders Planla</DialogTitle>
                                    <DialogDescription>
                                        Tarih, saat ve eğitmen seçerek yeni ders oluşturun.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    {/* TARİH SEÇİMİ */}
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="date" className="text-right">Tarih</Label>
                                        <Input
                                            id="date"
                                            type="date"
                                            value={newSessionData.date}
                                            onChange={(e) => setNewSessionData({ ...newSessionData, date: e.target.value })}
                                            className="col-span-3"
                                        />
                                    </div>
                                    {/* SAAT SEÇİMİ */}
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="time" className="text-right">Saat</Label>
                                        <Input
                                            id="time"
                                            type="time"
                                            value={newSessionData.time}
                                            onChange={(e) => setNewSessionData({ ...newSessionData, time: e.target.value })}
                                            className="col-span-3"
                                        />
                                    </div>
                                    {/* EĞİTMEN SEÇİMİ (İLK SIRADA) */}
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="instructor" className="text-right">Eğitmen</Label>
                                        <div className="col-span-3">
                                            <Select
                                                value={newSessionData.instructor}
                                                onValueChange={(val) => {
                                                    setNewSessionData({
                                                        ...newSessionData,
                                                        instructor: val,
                                                        activity: "",
                                                        level: ""
                                                    });
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Eğitmen Seçin" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {instructors.map(instr => (
                                                        <SelectItem key={instr.id} value={instr.name}>{instr.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    {/* DERS SEÇİMİ (EĞİTMENE GÖRE FİLTRELİ) */}
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="activity" className="text-right">Ders</Label>
                                        <Select
                                            value={newSessionData.activity}
                                            disabled={!newSessionData.instructor}
                                            onValueChange={(val) => setNewSessionData({ ...newSessionData, activity: val, level: "" })}
                                        >
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder={newSessionData.instructor ? "Ders Seçin" : "Önce Eğitmen Seçin"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {newSessionData.instructor && instructors.find(i => i.name === newSessionData.instructor)?.branchLevels &&
                                                    Object.keys(instructors.find(i => i.name === newSessionData.instructor)!.branchLevels!).map(branch => (
                                                        <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {/* SEVİYE SEÇİMİ (EĞİTMEN VE DERSE GÖRE FİLTRELİ) */}
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="level" className="text-right">Seviye</Label>
                                        <Select
                                            value={newSessionData.level}
                                            disabled={!newSessionData.activity}
                                            onValueChange={(val: any) => setNewSessionData({ ...newSessionData, level: val })}
                                        >
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder={newSessionData.activity ? "Seviye Seçin" : "Önce Ders Seçin"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {newSessionData.activity && instructors.find(i => i.name === newSessionData.instructor)?.branchLevels?.[newSessionData.activity]?.map(l => (
                                                    <SelectItem key={l} value={l}>
                                                        {l === 'beginner' ? 'Başlangıç' : l === 'intermediate' ? 'Orta' : 'İleri'}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {/* KAPASİTE */}
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="capacity" className="text-right">Kapasite</Label>
                                        <Input
                                            id="capacity"
                                            type="number"
                                            value={newSessionData.capacity}
                                            onChange={(e) => setNewSessionData({ ...newSessionData, capacity: e.target.value })}
                                            className="col-span-3"
                                        />
                                    </div>

                                    <div className="border-t border-slate-100 mt-2 pt-4">
                                        <Label className="mb-2 block font-semibold text-slate-900">Katılımcı Ekle</Label>
                                        <div className="space-y-3">
                                            <Select
                                                onValueChange={(val) => {
                                                    const member = members.find(m => m.id.toString() === val);
                                                    if (member && !newSessionData.participants.find(p => p.id === member.id)) {
                                                        if (newSessionData.participants.length < parseInt(newSessionData.capacity)) {
                                                            const newParticipant: Participant = {
                                                                id: member.id,
                                                                name: member.name,
                                                                phone: member.phone,
                                                                status: 'active'
                                                            };
                                                            setNewSessionData(prev => ({
                                                                ...prev,
                                                                participants: [...prev.participants, newParticipant]
                                                            }));
                                                        } else {
                                                            alert("Kapasite doldu!");
                                                        }
                                                    }
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Üye ara ve seç..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <div className="p-2 border-b border-slate-100">
                                                        <Input
                                                            placeholder="İsim ile filtrele..."
                                                            className="h-8 text-xs"
                                                            onChange={() => {
                                                                // Select içindeki input her zaman kolay olmayabilir Radix'te, 
                                                                // ama basit bir filtreleme simülasyonu yapabiliriz.
                                                                // Aslında standart Select arama desteğine sahip değil ama 
                                                                // biz listeyi üyelerden dönerken filtreleyebiliriz.
                                                            }}
                                                        />
                                                    </div>
                                                    {members.map(member => (
                                                        <SelectItem key={member.id} value={member.id.toString()}>
                                                            <div className="flex flex-col">
                                                                <span className="font-medium">{member.name}</span>
                                                                <span className="text-[10px] text-slate-500">{member.phone} - {member.branch}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            {/* Seçili üyeler listesi */}
                                            <div className="flex flex-wrap gap-2">
                                                {newSessionData.participants.map(p => (
                                                    <div key={p.id} className="bg-blue-50 border border-blue-100 text-blue-700 px-2 py-1 rounded-md text-[10px] sm:text-xs flex items-center gap-2">
                                                        {p.name}
                                                        <button
                                                            onClick={() => setNewSessionData(prev => ({
                                                                ...prev,
                                                                participants: prev.participants.filter(item => item.id !== p.id)
                                                            }))}
                                                            className="hover:text-red-500"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                                {newSessionData.participants.length === 0 && (
                                                    <p className="text-[10px] text-slate-400 italic">Henüz üye eklenmedi.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => {
                                        setIsAddOpen(false);
                                        setNewSessionData(prev => ({ ...prev, participants: [] }));
                                    }}>İptal</Button>
                                    <Button onClick={handleAddSession} disabled={addingSession}>
                                        {addingSession ? "Oluşturuluyor..." : "Oluştur"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}

                    {mainTab === "sessions" && (
                        <Dialog open={isAddRecurringOpen} onOpenChange={setIsAddRecurringOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                                    <Plus size={16} />
                                    Sabit Seans Ekle
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Yeni Sabit Seans Ekle</DialogTitle>
                                    <DialogDescription>
                                        Haftalık tekrarlanacak ders programını buradan ayarlayın.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleAddRecurring} className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="day" className="text-right">Gün</Label>
                                        <Select
                                            value={newRecurringData.dayOfWeek.toString()}
                                            onValueChange={(val) => setNewRecurringData({ ...newRecurringData, dayOfWeek: parseInt(val) })}
                                        >
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">Pazartesi</SelectItem>
                                                <SelectItem value="2">Salı</SelectItem>
                                                <SelectItem value="3">Çarşamba</SelectItem>
                                                <SelectItem value="4">Perşembe</SelectItem>
                                                <SelectItem value="5">Cuma</SelectItem>
                                                <SelectItem value="6">Cumartesi</SelectItem>
                                                <SelectItem value="0">Pazar</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="rs-time" className="text-right">Saat</Label>
                                        <Input
                                            id="rs-time"
                                            type="time"
                                            value={newRecurringData.time}
                                            onChange={(e) => setNewRecurringData({ ...newRecurringData, time: e.target.value })}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="rs-instructor" className="text-right">Eğitmen</Label>
                                        <Select
                                            value={newRecurringData.instructor}
                                            onValueChange={(val) => setNewRecurringData({ ...newRecurringData, instructor: val, activity: "", level: "" })}
                                        >
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder="Eğitmen Seçin" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {instructors.map(instr => (
                                                    <SelectItem key={instr.id} value={instr.name}>{instr.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="rs-activity" className="text-right">Ders</Label>
                                        <Select
                                            value={newRecurringData.activity}
                                            disabled={!newRecurringData.instructor}
                                            onValueChange={(val) => setNewRecurringData({ ...newRecurringData, activity: val, level: "" })}
                                        >
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder={newRecurringData.instructor ? "Ders Seçin" : "Önce Eğitmen Seçin"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {newRecurringData.instructor && instructors.find(i => i.name === newRecurringData.instructor)?.branchLevels &&
                                                    Object.keys(instructors.find(i => i.name === newRecurringData.instructor)!.branchLevels!).map(branch => (
                                                        <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="rs-level" className="text-right">Seviye</Label>
                                        <Select
                                            value={newRecurringData.level}
                                            disabled={!newRecurringData.activity}
                                            onValueChange={(val: any) => setNewRecurringData({ ...newRecurringData, level: val })}
                                        >
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder={newRecurringData.activity ? "Seviye Seçin" : "Önce Ders Seçin"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {newRecurringData.activity && instructors.find(i => i.name === newRecurringData.instructor)?.branchLevels?.[newRecurringData.activity]?.map(l => (
                                                    <SelectItem key={l} value={l}>
                                                        {l === 'beginner' ? 'Başlangıç' : l === 'intermediate' ? 'Orta' : 'İleri'}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="rs-capacity" className="text-right">Kapasite</Label>
                                        <Input
                                            id="rs-capacity"
                                            type="number"
                                            value={newRecurringData.capacity}
                                            onChange={(e) => setNewRecurringData({ ...newRecurringData, capacity: parseInt(e.target.value) })}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => setIsAddRecurringOpen(false)}>İptal</Button>
                                        <Button type="submit" disabled={addingRecurring}>
                                            {addingRecurring ? "Ekleniyor..." : "Sabit Seans Ekle"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </div >

            {/* KONTROLLER VE GÖRÜNÜM (Takvim Modu) */}
            {
                mainTab === "calendar" && (
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center bg-slate-50 p-1 rounded-lg border border-slate-200">
                                <Button variant="ghost" size="icon" onClick={handlePrev} className="h-8 w-8 hover:bg-white hover:shadow-sm">
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="font-semibold text-slate-700 min-w-[140px] text-center select-none text-sm">
                                    {viewMode === "month"
                                        ? format(currentDate, "MMMM yyyy", { locale: tr })
                                        : viewMode === "week"
                                            ? `${format(startOfWeek(currentDate, { weekStartsOn: 1 }), "d MMM")} - ${format(endOfWeek(currentDate, { weekStartsOn: 1 }), "d MMM yyyy")}`
                                            : format(currentDate, "d MMMM yyyy", { locale: tr })
                                    }
                                </span>
                                <Button variant="ghost" size="icon" onClick={handleNext} className="h-8 w-8 hover:bg-white hover:shadow-sm">
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>

                            {!isSameDay(currentDate, new Date()) && (
                                <Button variant="outline" size="sm" onClick={handleToday} className="h-10 px-4 border-slate-200 text-slate-600 hover:text-slate-900">
                                    Bugün
                                </Button>
                            )}
                        </div>
                    </div>
                )
            }

            {/* REZERVASYON LİSTESİ MODU */}
            {
                mainTab === "list" && (
                    <div className="flex-1 overflow-hidden flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm">
                        {listViewMode === "table" ? (
                            <div className="flex-1 overflow-auto">
                                <Table>
                                    <TableHeader className="sticky top-0 bg-slate-50 z-10 shadow-sm">
                                        <TableRow>
                                            <TableHead className="w-[120px]">Tarih</TableHead>
                                            <TableHead>Üye</TableHead>
                                            <TableHead>Tel No</TableHead>
                                            <TableHead>Ders</TableHead>
                                            <TableHead>Eğitmen</TableHead>
                                            <TableHead className="w-[80px]">Saati</TableHead>
                                            <TableHead className="text-right">İşlem Seçeneği</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {(() => {
                                            // Katılımcıları (rezervasyonları) düz bir listeye çekiyoruz ve filtreliyoruz
                                            const allReservations = sessions.flatMap(session =>
                                                session.participants.map(p => ({
                                                    ...p,
                                                    sessionDate: session.date,
                                                    sessionTime: session.time,
                                                    sessionActivity: session.activity,
                                                    sessionInstructor: session.instructor,
                                                    sessionId: session.id,
                                                    sessionCapacity: session.capacity
                                                }))
                                            )
                                                .filter(res => {
                                                    if (!searchTerm) return true;
                                                    const sTerm = searchTerm.toLowerCase();
                                                    const memberInfo = members.find(m => String(m.id) === String(res.id));
                                                    return res.name.toLowerCase().includes(sTerm) ||
                                                        (memberInfo?.phone || res.phone || "").includes(sTerm);
                                                })
                                                .sort((a, b) => b.sessionDate.localeCompare(a.sessionDate) || a.sessionTime.localeCompare(b.sessionTime));

                                            if (allReservations.length === 0 && !loading) {
                                                return (
                                                    <TableRow>
                                                        <TableCell colSpan={7} className="h-32 text-center text-slate-400">
                                                            Görüntülenecek rezervasyon bulunamadı.
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            }

                                            return allReservations.map((res, idx) => {
                                                // ID tip uyuşmazlığı riskine karşı toString() ile kontrol ediyoruz
                                                const memberInfo = members.find(m => String(m.id) === String(res.id));

                                                return (
                                                    <TableRow key={`${res.sessionId}-${res.id}-${idx}`} className={cn(
                                                        "hover:bg-slate-50 transition-colors uppercase text-[11px]",
                                                        res.status === 'cancelled' && "opacity-60 bg-slate-50"
                                                    )}>
                                                        <TableCell className="font-medium text-slate-500 whitespace-nowrap">
                                                            {format(parseISO(res.sessionDate), "dd.MM.yyyy")}
                                                        </TableCell>
                                                        <TableCell className="font-bold text-slate-800">
                                                            {res.name}
                                                        </TableCell>
                                                        <TableCell className="text-blue-600 font-semibold">
                                                            {memberInfo?.phone || res.phone || "-"}
                                                        </TableCell>
                                                        <TableCell className="font-medium text-slate-700">
                                                            {res.sessionActivity}
                                                        </TableCell>
                                                        <TableCell className="text-slate-500">
                                                            {res.sessionInstructor || "-"}
                                                        </TableCell>
                                                        <TableCell className="font-extrabold text-blue-700">
                                                            {res.sessionTime}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {res.status !== 'cancelled' ? (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 text-[10px] font-bold gap-1 ml-auto border border-red-100"
                                                                    onClick={() => handleCancelParticipant(res.sessionId, res.id)}
                                                                    disabled={processingId === res.id}
                                                                >
                                                                    {processingId === res.id ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
                                                                    İPTAL ET
                                                                </Button>
                                                            ) : (
                                                                <span className="text-[9px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded font-bold">İPTAL EDİLDİ</span>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            });
                                        })()}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            listViewMode === "summary" ? (
                                <div className="flex-1 overflow-auto p-6 bg-slate-50/30">
                                    <div className="max-w-3xl mx-auto space-y-4">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                                <CalendarIcon size={20} className="text-blue-600" />
                                                {format(currentDate, "d MMMM yyyy, EEEE", { locale: tr })}
                                            </h3>
                                            <div className="text-xs font-medium text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                                                Toplam {sessions.filter(s => s.date === format(currentDate, "yyyy-MM-dd")).reduce((acc, s) => acc + s.enrolledCount, 0)} Rezervasyon
                                            </div>
                                        </div>

                                        {(() => {
                                            const todayStr = format(currentDate, "yyyy-MM-dd");
                                            const dailyReservations = sessions
                                                .filter(s => s.date === todayStr)
                                                .flatMap(session =>
                                                    session.participants.map(p => ({
                                                        time: session.time,
                                                        activity: session.activity,
                                                        memberName: p.name,
                                                        status: p.status
                                                    }))
                                                )
                                                .filter(res => {
                                                    if (!searchTerm) return true;
                                                    const sTerm = searchTerm.toLowerCase();
                                                    const memberInfo = members.find(m => m.name === res.memberName);
                                                    return res.memberName.toLowerCase().includes(sTerm) ||
                                                        (memberInfo?.phone || "").includes(sTerm);
                                                })
                                                .sort((a, b) => a.time.localeCompare(b.time));

                                            if (dailyReservations.length === 0) {
                                                return (
                                                    <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-200 shadow-sm">
                                                        <Clock size={48} className="mx-auto mb-4 text-slate-200" />
                                                        <p className="text-slate-500 font-medium">Bu tarihte yapılmış bir rezervasyon bulunmuyor.</p>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
                                                    {dailyReservations.map((res, idx) => (
                                                        <div key={idx} className={cn(
                                                            "px-6 py-4 flex items-center justify-between group hover:bg-slate-50 transition-colors",
                                                            res.status === 'cancelled' && "bg-slate-50/50 opacity-50"
                                                        )}>
                                                            <div className="flex items-center gap-4 text-sm">
                                                                <span className="font-extrabold text-blue-700 w-12">
                                                                    {res.time}
                                                                </span>
                                                                <span className="text-slate-300">|</span>
                                                                <span className="font-bold text-slate-700 min-w-[140px]">
                                                                    {res.activity}
                                                                </span>
                                                                <span className="text-slate-300">|</span>
                                                                <span className="font-semibold text-slate-900">
                                                                    {res.memberName}
                                                                </span>
                                                            </div>
                                                            {res.status === 'cancelled' && (
                                                                <span className="text-[9px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100">İPTAL EDİLDİ</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 overflow-auto bg-white">
                                    {(() => {
                                        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
                                        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

                                        const todayStr = format(new Date(), "yyyy-MM-dd");
                                        const weeklyReservations = sessions
                                            .filter(s => {
                                                const sDate = parseISO(s.date);
                                                return sDate >= weekStart && sDate <= weekEnd && s.date >= todayStr;
                                            })
                                            .flatMap(session =>
                                                session.participants.map(p => ({
                                                    ...p,
                                                    sessionDate: session.date,
                                                    sessionTime: session.time,
                                                    sessionActivity: session.activity,
                                                    sessionInstructor: session.instructor,
                                                    sessionId: session.id
                                                }))
                                            )
                                            .filter(res => {
                                                if (!searchTerm) return true;
                                                const sTerm = searchTerm.toLowerCase();
                                                const memberInfo = members.find(m => String(m.id) === String(res.id));
                                                return res.name.toLowerCase().includes(sTerm) ||
                                                    (memberInfo?.phone || res.phone || "").includes(sTerm);
                                            })
                                            .sort((a, b) => a.sessionDate.localeCompare(b.sessionDate) || a.sessionTime.localeCompare(b.sessionTime));

                                        if (weeklyReservations.length === 0) {
                                            return (
                                                <div className="p-12 text-center border-slate-200 bg-white">
                                                    <CalendarIcon size={48} className="mx-auto mb-4 text-slate-200" />
                                                    <p className="text-slate-500 font-medium font-bold">Bu haftaya ait kayıtlı üye rezervasyonu bulunmuyor.</p>
                                                </div>
                                            );
                                        }

                                        return (
                                            <Table>
                                                <TableHeader className="sticky top-0 bg-slate-50 z-10 shadow-sm border-b">
                                                    <TableRow className="hover:bg-transparent">
                                                        <TableHead className="w-[140px] px-6">Tarih / Gün</TableHead>
                                                        <TableHead className="w-[80px]">Saat</TableHead>
                                                        <TableHead className="px-6">Üye Adı</TableHead>
                                                        <TableHead>Ders / Aktivite</TableHead>
                                                        <TableHead>Eğitmen</TableHead>
                                                        <TableHead className="text-right px-6">İşlem</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {weeklyReservations.map((res, idx) => (
                                                        <TableRow key={idx} className={cn(
                                                            "hover:bg-slate-50 transition-colors uppercase text-[11px]",
                                                            res.status === 'cancelled' && "opacity-60 bg-slate-50"
                                                        )}>
                                                            <TableCell className="px-6">
                                                                <div className="flex flex-col">
                                                                    <span className="font-extrabold text-blue-700">
                                                                        {format(parseISO(res.sessionDate), "dd.MM.yyyy")}
                                                                    </span>
                                                                    <span className="font-black text-slate-400 text-[9px]">
                                                                        {format(parseISO(res.sessionDate), "EEEE", { locale: tr })}
                                                                    </span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="font-extrabold text-slate-800">
                                                                {res.sessionTime}
                                                            </TableCell>
                                                            <TableCell className="px-6 font-black text-slate-900 text-sm">
                                                                {res.name}
                                                            </TableCell>
                                                            <TableCell className="font-bold text-slate-700 uppercase">
                                                                {res.sessionActivity}
                                                            </TableCell>
                                                            <TableCell className="text-slate-500 font-semibold">
                                                                <div className="flex items-center gap-2">
                                                                    {(() => {
                                                                        const instr = instructors.find(i => i.name === res.sessionInstructor);
                                                                        return instr && (
                                                                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: instr.color }} />
                                                                        );
                                                                    })()}
                                                                    {res.sessionInstructor || "-"}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-right px-6">
                                                                {res.status === 'cancelled' ? (
                                                                    <span className="text-[9px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100">İPTAL EDİLDİ</span>
                                                                ) : (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 text-[10px] font-bold gap-1 ml-auto border border-red-100 px-3"
                                                                        onClick={() => handleCancelParticipant(res.sessionId, res.id)}
                                                                        disabled={processingId === res.id}
                                                                    >
                                                                        {processingId === res.id ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
                                                                        İPTAL ET
                                                                    </Button>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        );
                                    })()}
                                </div>
                            )
                        )}
                    </div>
                )
            }

            {/* SEANS YÖNETİMİ (SABİT SEANSLAR - HAFTALIK GÖRÜNÜM) */}
            {
                mainTab === "sessions" && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden min-h-[600px]">
                        {/* Gün Başlıkları */}
                        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
                            {[1, 2, 3, 4, 5, 6, 0].map(dayNum => (
                                <div key={dayNum} className="py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider border-r border-slate-200 last:border-r-0">
                                    {["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"][dayNum]}
                                </div>
                            ))}
                        </div>

                        {/* Seans Grid'i */}
                        <div className="grid grid-cols-7 flex-1 divide-x divide-slate-100 overflow-y-auto">
                            {[1, 2, 3, 4, 5, 6, 0].map(dayNum => {
                                const daySessions = recurringSessions
                                    .filter(rs => rs.dayOfWeek === dayNum)
                                    .sort((a, b) => a.time.localeCompare(b.time));

                                return (
                                    <div key={dayNum} className="min-h-[400px] p-2 bg-white flex flex-col gap-2">
                                        {daySessions.map(rs => (
                                            <div
                                                key={rs.id}
                                                className="group relative flex flex-col p-3 rounded-lg border border-blue-100 bg-blue-50/50 hover:bg-blue-50 transition-all shadow-sm"
                                            >
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="text-xs font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                                                        {rs.time}
                                                    </span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteRecurring(rs.id);
                                                        }}
                                                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 transition-opacity"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                                <h4 className="text-sm font-bold text-slate-900 leading-tight">
                                                    {rs.activity}
                                                </h4>
                                                <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-500 font-bold">
                                                    <div className="h-2 w-2 rounded-full mr-1" style={{
                                                        backgroundColor: instructors.find(i => i.name === rs.instructor)?.color || '#e2e8f0'
                                                    }} />
                                                    {rs.instructor}
                                                </div>
                                                <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                                                    <Users size={10} />
                                                    Kapasite: {rs.capacity}
                                                </div>
                                            </div>
                                        ))}
                                        {daySessions.length === 0 && (
                                            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-50 rounded-lg m-1">
                                                <span className="text-[10px] text-slate-300 italic text-center px-2">Seans yok</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )
            }

            {/* HATIRLATICI AJANDASI MODU */}
            {
                mainTab === "reminders" && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden min-h-[600px]">
                        {/* Ay Başlığı ve Navigasyon */}
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <h3 className="text-lg font-bold text-slate-800">
                                    {format(currentDate, "MMMM yyyy", { locale: tr })}
                                </h3>
                                <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                                    <Button variant="ghost" size="icon" onClick={handlePrev} className="h-8 w-8">
                                        <ChevronLeft size={16} />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={handleToday} className="px-3 text-xs font-semibold">
                                        Bugün
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={handleNext} className="h-8 w-8">
                                        <ChevronRight size={16} />
                                    </Button>
                                </div>
                            </div>
                            <div className="text-xs text-slate-500 font-medium">
                                Toplam {reminders.filter(r => r.date.startsWith(format(currentDate, "yyyy-MM"))).length} hatırlatıcı
                            </div>
                        </div>

                        {/* Takvim Grid */}
                        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
                            {weekDays.map(day => (
                                <div key={day} className="py-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 flex-1 divide-x divide-slate-100 divide-y border-b border-slate-200">
                            {calendarDays.map((day, idx) => {
                                const dateStr = format(day, "yyyy-MM-dd");
                                const isCurrentMonth = isSameMonth(day, currentDate);
                                const isToday = isSameDay(day, new Date());
                                const dayReminders = reminders.filter(r => r.date === dateStr);

                                return (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "min-h-[120px] p-2 hover:bg-slate-50/50 transition-colors group cursor-pointer flex flex-col gap-1",
                                            !isCurrentMonth && "bg-slate-50/30 opacity-40"
                                        )}
                                        onClick={() => {
                                            if (isCurrentMonth) {
                                                setSelectedReminderDate(dateStr);
                                                setIsAddReminderOpen(true);
                                            }
                                        }}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className={cn(
                                                "text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full transition-colors",
                                                isToday ? "bg-blue-600 text-white" : "text-slate-500 group-hover:text-blue-600"
                                            )}>
                                                {format(day, "d")}
                                            </span>
                                            {dayReminders.length > 0 && (
                                                <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 rounded-full">
                                                    {dayReminders.length}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-1 overflow-y-auto max-h-[80px] scrollbar-hide">
                                            {dayReminders.map(r => (
                                                <div
                                                    key={r.id}
                                                    className={cn(
                                                        "text-[10px] p-1.5 rounded border shadow-sm flex flex-col gap-0.5 group/item transition-all hover:brightness-95",
                                                        r.type === 'important' ? "border-red-500 border-2 animate-pulse-subtle" : "border-slate-100"
                                                    )}
                                                    style={{ 
                                                        backgroundColor: r.type === 'important' ? '#FEF2F2' : `${r.color}20`, 
                                                        borderLeft: `4px solid ${r.type === 'important' ? '#EF4444' : (r.color || '#3B82F6')}`, 
                                                        color: r.type === 'important' ? '#991B1B' : `${r.color}DD` 
                                                    }}
                                                >
                                                    <div className="flex items-start justify-between gap-1">
                                                        <div className="flex items-start gap-1 flex-1">
                                                            {r.type === 'important' && <AlertCircle size={10} className="text-red-600 shrink-0 mt-0.5" />}
                                                            <span className="font-bold leading-tight line-clamp-2">{r.text}</span>
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteReminder(r.id);
                                                            }}
                                                            className="opacity-0 group-hover/item:opacity-100 text-slate-400 hover:text-red-600 transition-opacity"
                                                        >
                                                            <Trash2 size={10} />
                                                        </button>
                                                    </div>
                                                    {r.createdBy && (
                                                        <span className="text-[9px] opacity-70 font-semibold truncate ml-3">
                                                            @{r.createdBy}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )
            }

            {/* Takvim Grid (Conditional Rendering) */}
            {
                mainTab === "calendar" && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden min-h-[600px]">
                        <div className={cn(
                            "grid border-b border-slate-200 bg-slate-50",
                            viewMode === "month" || viewMode === "week" ? "grid-cols-7" : "grid-cols-1"
                        )}>
                            {(viewMode === "month" || viewMode === "week" ? weekDays : [format(currentDate, "EEEE d MMMM", { locale: tr })]).map(day => (
                                <div key={day} className="py-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className={cn(
                            "grid flex-1 divide-x divide-slate-100 divide-y",
                            viewMode === "month" || viewMode === "week" ? "grid-cols-7" : "grid-cols-1",
                            viewMode === "month" ? "grid-rows-5" : "grid-rows-1"
                        )}>
                            {calendarDays.map((day, idx) => {
                                const isCurrentMonth = isSameMonth(day, currentDate);
                                const isToday = isSameDay(day, new Date());
                                const isSunday = day.getDay() === 0;
                                const visibleSessions = getVisibleSessions(day);

                                return (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "min-h-[100px] p-2 transition-colors hover:bg-slate-50 relative group flex flex-col gap-1",
                                            viewMode === "month" ? "h-auto" : "flex-1 overflow-y-auto",
                                            !isCurrentMonth && viewMode === "month" && "bg-slate-50/50 text-slate-400",
                                            isSunday && "bg-slate-100/50"
                                        )}
                                    >
                                        <div className="flex justify-between items-start">
                                            <span className={cn(
                                                "text-sm font-semibold h-7 w-7 flex items-center justify-center rounded-full",
                                                isToday ? "bg-blue-600 text-white shadow-md" : "text-slate-700"
                                            )}>
                                                {format(day, "d")}
                                            </span>
                                            {isSunday && <span className="text-[10px] text-slate-400 font-medium bg-slate-200 px-1.5 rounded">KAPALI</span>}
                                        </div>

                                        <div className={cn(
                                            "flex flex-col gap-1 mt-1",
                                            viewMode === "month" ? "overflow-hidden" : ""
                                        )}>
                                            {loading ? (
                                                idx === 0 && <Loader2 className="h-4 w-4 animate-spin mx-auto text-slate-300" />
                                            ) : (
                                                visibleSessions.map(session => (
                                                    <button
                                                        key={session.id}
                                                        onClick={() => {
                                                            setSelectedSession(session);
                                                            setTempCapacity(null); // Reset temp capacity on open
                                                            setIsDetailOpen(true);
                                                        }}
                                                        style={{
                                                            backgroundColor: session.color ? `${session.color}10` : undefined,
                                                            borderColor: session.color ? `${session.color}40` : undefined,
                                                            borderLeftWidth: session.color ? '4px' : '1px',
                                                            borderLeftColor: session.color
                                                        }}
                                                        className={cn(
                                                            "flex flex-col text-left px-3 py-2 rounded transition-all hover:scale-[1.01] active:scale-95 shadow-sm border",
                                                            !session.color && (
                                                                session.isRecurring
                                                                    ? "bg-emerald-50 border-emerald-100 hover:bg-emerald-100"
                                                                    : session.status === 'full'
                                                                        ? "bg-red-50 border-red-100 hover:bg-red-100"
                                                                        : "bg-blue-50 border-blue-100 hover:bg-blue-100"
                                                            ),
                                                            viewMode !== "month" && "py-3"
                                                        )}
                                                    >
                                                        <div className="flex justify-between items-center w-full">
                                                            <span className={cn(
                                                                "text-[10px] sm:text-xs font-bold",
                                                                !session.color && (session.isRecurring ? "text-emerald-700" : session.status === 'full' ? "text-red-700" : "text-blue-700")
                                                            )} style={{ color: session.color }}>
                                                                {session.time}
                                                            </span>
                                                            <div className="flex gap-1">
                                                                {session.isRecurring && (
                                                                    <span className="text-[8px] bg-emerald-200 text-emerald-800 px-1 rounded font-bold">SABİT</span>
                                                                )}
                                                                {viewMode !== "month" && (
                                                                    <span className={cn("text-[10px] px-1.5 rounded-full font-bold shadow-sm",
                                                                        session.status === 'full' ? "bg-red-100 text-red-700" : (session.isRecurring ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700")
                                                                    )}>
                                                                        {session.enrolledCount}/{session.capacity}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <span className={cn(
                                                            "text-[11px] sm:text-sm truncate font-bold mt-0.5 text-slate-800"
                                                        )}>
                                                            {session.activity}
                                                        </span>
                                                        {session.instructor && (
                                                            <span className="text-[10px] text-slate-500 truncate mt-1 flex items-center gap-1 font-semibold">
                                                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: session.color }} />
                                                                {session.instructor}
                                                            </span>
                                                        )}
                                                    </button>
                                                ))
                                            )}
                                            {visibleSessions.length === 0 && !loading && (
                                                <div className="flex flex-col items-center justify-center py-8 text-slate-400 opacity-60">
                                                    <CalendarIcon size={24} className="mb-2" />
                                                    <span className="text-xs">Ders bulunamadı</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )
            }

            {/* DETAY MODALI */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="flex justify-between items-start pr-4">
                            <div>
                                <DialogTitle className="flex items-center gap-2 text-slate-900 text-xl">
                                    {selectedSession?.activity}
                                </DialogTitle>
                                <DialogDescription className="mt-1 flex flex-col gap-1">
                                    <span className="flex items-center gap-2">
                                        <CalendarIcon size={14} />
                                        {selectedSession && format(parseISO(selectedSession.date), "d MMMM yyyy", { locale: tr })}
                                        <Clock size={14} className="ml-2" />
                                        {selectedSession?.time}
                                    </span>
                                    <span className="flex items-center gap-2 text-blue-600 font-medium">
                                        <User size={14} />
                                        {selectedSession?.instructor || "Eğitmen Yok"}
                                    </span>
                                </DialogDescription>
                            </div>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleDeleteSession}
                                disabled={processingId === selectedSession?.id}
                                className="h-8 px-2 text-xs"
                            >
                                {processingId === selectedSession?.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 size={14} className="mr-1" />}
                                Sil
                            </Button>
                        </div>
                    </DialogHeader>

                    <div className="space-y-4 py-2 border-t border-slate-100 mt-2">
                        <div className="flex items-center justify-between text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border">
                            <div className="flex flex-col">
                                <span className="font-semibold text-slate-900">Kontenjan Ayarı</span>
                                <span className="text-[10px] text-slate-500">Kapasiteyi değiştirip Uygula'ya basın</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {tempCapacity !== null && selectedSession && tempCapacity !== selectedSession.capacity && (
                                    <Button
                                        size="sm"
                                        className="h-8 text-[10px] font-bold bg-blue-600 hover:bg-blue-700 shadow-sm animate-in fade-in slide-in-from-right-2 duration-200"
                                        onClick={handleApplyCapacity}
                                        disabled={isApplyingCapacity}
                                    >
                                        {isApplyingCapacity ? <Loader2 size={12} className="animate-spin" /> : "UYGULA"}
                                    </Button>
                                )}
                                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md p-1 shadow-sm">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 rounded-sm hover:bg-red-50 hover:text-red-600"
                                        onClick={() => selectedSession && handleUpdateCapacity((tempCapacity ?? selectedSession.capacity) - 1)}
                                        disabled={isApplyingCapacity || (tempCapacity ?? selectedSession?.capacity ?? 1) === 1}
                                    >
                                        <Minus size={14} />
                                    </Button>
                                    <span className={cn(
                                        "font-black text-xs min-w-[2.5rem] text-center",
                                        (selectedSession?.enrolledCount ?? 0) >= (tempCapacity ?? selectedSession?.capacity ?? 0) ? "text-red-600" : "text-blue-600"
                                    )}>
                                        {selectedSession?.enrolledCount ?? 0} / {tempCapacity ?? selectedSession?.capacity ?? 0}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 rounded-sm hover:bg-green-50 hover:text-green-600"
                                        onClick={() => selectedSession && handleUpdateCapacity((tempCapacity ?? selectedSession.capacity) + 1)}
                                        disabled={isApplyingCapacity}
                                    >
                                        <Plus size={14} />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-sm font-semibold text-slate-900">Katılımcı Listesi</h4>
                                <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                                    {selectedSession?.enrolledCount} / {selectedSession?.capacity}
                                </span>
                            </div>

                            {/* Üye Ekleme Input (Existing Session) */}
                            <div className="mb-4">
                                <Input
                                    list="detail-member-list"
                                    placeholder="Derse üye ekle (isim yazın)..."
                                    className="h-9 text-xs"
                                    onBlur={(e) => {
                                        const val = e.target.value;
                                        if (val) {
                                            const member = members.find(m => `${m.name} - ${m.phone}` === val);
                                            if (member && selectedSession) {
                                                if (!selectedSession.participants.find(p => p.id === member.id && p.status !== 'cancelled')) {
                                                    handleAddParticipantToExisting(selectedSession.id, member);
                                                    e.target.value = "";
                                                } else {
                                                    alert("Üye zaten bu derste aktif!");
                                                }
                                            }
                                        }
                                    }}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        const member = members.find(m => m.name === val);
                                        if (member && selectedSession) {
                                            if (!selectedSession.participants.find(p => p.id === member.id && p.status !== 'cancelled')) {
                                                handleAddParticipantToExisting(selectedSession.id, member);
                                                e.target.value = "";
                                            }
                                        }
                                    }}
                                />
                                <datalist id="detail-member-list">
                                    {members.map(member => (
                                        <option key={member.id} value={`${member.name} - ${member.phone}`} />
                                    ))}
                                </datalist>
                            </div>

                            <div className="space-y-2">
                                {selectedSession?.participants.map(p => (
                                    <div key={p.id} className={cn(
                                        "flex items-center justify-between p-2 rounded border transition-colors",
                                        p.status === 'cancelled' ? "bg-slate-50 border-dashed opacity-60" : "bg-white border-slate-100"
                                    )}>
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                                                {p.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className={cn("text-sm font-medium", p.status === 'cancelled' && "line-through")}>{p.name}</p>
                                                {p.status === 'cancelled' && <p className="text-[10px] text-red-500">İptal Edildi</p>}
                                            </div>
                                        </div>
                                        {p.status !== 'cancelled' && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-7 w-7 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                                                onClick={() => handleCancelParticipant(selectedSession!.id, p.id)}
                                                disabled={processingId === p.id}
                                            >
                                                {processingId === p.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <X size={14} />}
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                {selectedSession?.participants.length === 0 && (
                                    <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed">
                                        <Users className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                                        <p className="text-xs text-slate-400">Henüz katılımcı yok</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        {/* HATIRLATICI EKLEME MODALI */}
        <Dialog open={isAddReminderOpen} onOpenChange={setIsAddReminderOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Bell className="text-blue-600" size={20} />
                        Hatırlatıcı Ekle ({selectedReminderDate ? format(parseISO(selectedReminderDate), "d MMMM", { locale: tr }) : ""})
                    </DialogTitle>
                    <DialogDescription>
                        Bu güne özel bir not veya hatırlatıcı ekleyin.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddReminder} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="reminder-text">Not / Hatırlatıcı</Label>
                        <Input
                            id="reminder-text"
                            value={newReminderText}
                            onChange={(e) => setNewReminderText(e.target.value)}
                            placeholder="Örn: Salon temizliği yapılacak..."
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Önem Derecesi</Label>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant={newReminderType === 'info' ? 'default' : 'outline'}
                                size="sm"
                                className={cn(
                                    "flex-1 transition-all", 
                                    newReminderType === 'info' ? "bg-blue-600 hover:bg-blue-700 shadow-md scale-105" : "text-slate-500"
                                )}
                                onClick={() => setNewReminderType('info')}
                            >
                                <Info size={14} className="mr-2" />
                                Normal
                            </Button>
                            <Button
                                type="button"
                                variant={newReminderType === 'important' ? 'destructive' : 'outline'}
                                size="sm"
                                className={cn(
                                    "flex-1 transition-all",
                                    newReminderType === 'important' ? "bg-red-600 hover:bg-red-700 shadow-lg scale-105 border-2 border-red-800" : "text-slate-500"
                                )}
                                onClick={() => setNewReminderType('important')}
                            >
                                <AlertCircle size={14} className="mr-2" />
                                Önemli
                            </Button>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="reminder-creator">Kimin Eklediği</Label>
                        <Select value={newReminderCreatedBy} onValueChange={(val) => {
                            setNewReminderCreatedBy(val);
                            const instructor = instructors.find(i => i.name === val);
                            if (instructor?.color) {
                                setNewReminderColor(instructor.color);
                            }
                        }}>
                            <SelectTrigger id="reminder-creator">
                                <SelectValue placeholder="Kişi Seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                {instructors.map(instr => (
                                    <SelectItem key={instr.id} value={instr.name}>{instr.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button type="button" variant="outline" onClick={() => setIsAddReminderOpen(false)}>İptal</Button>
                        <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800">Kaydet</Button>
                    </DialogFooter>
                </form>

                {/* Mevcut Hatırlatıcılar Listesi */}
                {selectedReminderDate && reminders.filter(r => r.date === selectedReminderDate).length > 0 && (
                    <div className="border-t pt-4 mt-2">
                        <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight">Bu Günün Hatırlatıcıları</h4>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto">
                            {reminders.filter(r => r.date === selectedReminderDate).map(r => (
                                <div key={r.id} className={cn(
                                    "flex items-center justify-between p-2 rounded border text-xs group transition-all",
                                    r.type === 'important' ? "border-red-500 border-2 shadow-sm animate-pulse-subtle" : "border-slate-100"
                                )} style={{ backgroundColor: r.type === 'important' ? '#FEF2F2' : `${r.color}15`, borderLeft: `6px solid ${r.type === 'important' ? '#EF4444' : (r.color || '#3B82F6')}` }}>
                                    <div className="flex flex-col flex-1">
                                        <div className="flex items-center gap-1.5">
                                            {r.type === 'important' && <AlertCircle size={12} className="text-red-600 shrink-0" />}
                                            <span className={cn("font-bold text-slate-800", r.type === 'important' && "text-red-900")}>{r.text}</span>
                                        </div>
                                        {r.createdBy && <span className="text-[10px] text-slate-500 font-medium ml-4">{r.createdBy} tarafından</span>}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleDeleteReminder(r.id)}
                                    >
                                        <Trash2 size={12} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    </div>
);
}

export default function AppointmentsPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
                    <p className="text-slate-500 text-sm">Yükleniyor...</p>
                </div>
            </div>
        }>
            <AppointmentsContent />
        </Suspense>
    );
}
