"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Clock, Loader2, Save, Users, Plus, Trash2, Check, Search, User, Palette } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getBusinessHours, updateBusinessHours, getSessionDuration, updateSessionDuration } from "@/lib/services/managementService";
import { getInstructors, addInstructor, deleteInstructor } from "@/lib/services/staffService";
import { BusinessHours, Instructor } from "@/types";

const DAYS = [
    { id: 1, name: "Pazartesi" },
    { id: 2, name: "Salı" },
    { id: 3, name: "Çarşamba" },
    { id: 4, name: "Perşembe" },
    { id: 5, name: "Cuma" },
    { id: 6, name: "Cumartesi" },
    { id: 0, name: "Pazar" },
];

const PERSONNEL_COLORS = [
    "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
    "#EC4899", "#06B6D4", "#F97316", "#64748B", "#14B8A6",
    "#84cc16", "#a855f7", "#6366f1", "#f43f5e", "#d946ef"
];

export default function ManagementPage() {
    const [hours, setHours] = useState<BusinessHours | null>(null);
    const [sessionDuration, setSessionDuration] = useState<number>(60);
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [isHoursDialogOpen, setIsHoursDialogOpen] = useState(false);
    const [isStaffDialogOpen, setIsStaffDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Personel State
    const [newStaffName, setNewStaffName] = useState("");
    const [newStaffTC, setNewStaffTC] = useState("");
    const [newStaffPhone, setNewStaffPhone] = useState("");
    const [newStaffEmail, setNewStaffEmail] = useState("");
    const [newStaffBranch, setNewStaffBranch] = useState("");
    const [newStaffAvatar, setNewStaffAvatar] = useState("");
    const [newStaffStartDate, setNewStaffStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [newStaffEndDate, setNewStaffEndDate] = useState("");
    const [instructorSearchTerm, setInstructorSearchTerm] = useState("");
    const [selectedColor, setSelectedColor] = useState(PERSONNEL_COLORS[0]);
    const [addingStaff, setAddingStaff] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [hoursData, instructorsData, durationData] = await Promise.all([
                getBusinessHours(),
                getInstructors(),
                getSessionDuration()
            ]);
            setHours(hoursData);
            setInstructors(instructorsData);
            setSessionDuration(durationData);
        } catch (error) {
            console.error("Veriler yüklenemedi", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveHours = async () => {
        if (!hours) return;
        setSaving(true);
        try {
            await Promise.all([
                updateBusinessHours(hours),
                updateSessionDuration(sessionDuration)
            ]);
            setIsHoursDialogOpen(false);
        } catch (error) {
            console.error("Kaydedilemedi", error);
            alert("İşlem başarısız.");
        } finally {
            setSaving(false);
        }
    };

    const handleAddStaff = async () => {
        if (!newStaffName.trim() || !newStaffTC.trim() || !newStaffPhone.trim() || !newStaffEmail.trim() || !newStaffBranch.trim() || !newStaffStartDate) {
            alert("Lütfen tüm alanları doldurun!");
            return;
        }

        // TC No Kontrolü (11 haneli mi?)
        if (newStaffTC.length !== 11) {
            alert("TC Kimlik Numarası 11 haneli olmalıdır!");
            return;
        }

        // Renk çakışma kontrolü
        if (instructors.some(i => i.color === selectedColor)) {
            alert("Bu renk zaten başka bir personele atanmış! Lütfen farklı bir renk seçin.");
            return;
        }

        setAddingStaff(true);
        try {
            const newStaff = await addInstructor({
                name: newStaffName,
                tc: newStaffTC,
                phone: newStaffPhone,
                email: newStaffEmail,
                branch: newStaffBranch,
                color: selectedColor,
                startDate: newStaffStartDate,
                endDate: newStaffEndDate || undefined,
                avatar: newStaffAvatar || undefined
            });
            setInstructors([...instructors, newStaff]);
            // Formu temizle
            setNewStaffName("");
            setNewStaffTC("");
            setNewStaffPhone("");
            setNewStaffEmail("");
            setNewStaffBranch("");
            setNewStaffAvatar("");
            setNewStaffEndDate("");
            setNewStaffStartDate(new Date().toISOString().split('T')[0]);

            // Kullanılmayan ilk rengi seç
            const availableColor = PERSONNEL_COLORS.find(c => !instructors.some(i => i.color === c) && c !== selectedColor);
            if (availableColor) setSelectedColor(availableColor);
        } catch (error: any) {
            alert(error.message || "Personel eklenemedi.");
        } finally {
            setAddingStaff(false);
        }
    };

    const handleDeleteStaff = async (id: number) => {
        if (!confirm("Bu personeli silmek istediğinize emin misiniz?")) return;
        try {
            await deleteInstructor(id);
            setInstructors(instructors.filter(i => i.id !== id));
        } catch (error) {
            alert("Silme işlemi başarısız.");
        }
    };

    const filteredInstructors = instructors.filter(i =>
        i.name.toLowerCase().includes(instructorSearchTerm.toLowerCase()) ||
        i.branch?.toLowerCase().includes(instructorSearchTerm.toLowerCase()) ||
        i.startDate?.includes(instructorSearchTerm)
    );

    const updateDay = (dayId: number, field: string, value: any) => {
        if (!hours) return;
        setHours({
            ...hours,
            [dayId]: {
                ...hours[dayId],
                [field]: value
            }
        });
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Salon Yönetimi</h1>
                <p className="text-slate-500">
                    Salon ayarlarını ve genel yönetim işlemlerini buradan gerçekleştirebilirsiniz.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {/* ÇALIŞMA SAATLERİ KARTI */}
                <Card className="border-slate-100 shadow-sm hover:border-blue-100 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                <Clock size={20} />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-slate-800">Çalışma Saatleri</CardTitle>
                                <CardDescription className="text-xs">Haftalık salon programı</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={() => setIsHoursDialogOpen(true)}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm hover:shadow-md transition-all duration-300 rounded-lg h-9 text-sm"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />}
                            Saatleri Düzenle
                        </Button>
                    </CardContent>
                </Card>

                {/* PERSONEL YÖNETİMİ KARTI */}
                <Card className="border-slate-100 shadow-sm hover:border-emerald-100 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                                <Users size={20} />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-slate-800">Personel Yönetimi</CardTitle>
                                <CardDescription className="text-xs">Eğitmen ve renk tanımları</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={() => setIsStaffDialogOpen(true)}
                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm hover:shadow-md transition-all duration-300 rounded-lg h-9 text-sm"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Users className="mr-2 h-4 w-4" />}
                            Personel Yönet
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* SAATLER DİALOG */}
            <Dialog open={isHoursDialogOpen} onOpenChange={setIsHoursDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Çalışma Saatlerini Düzenle</DialogTitle>
                        <DialogDescription>
                            Her gün için çalışma saatlerini belirleyin. Kapalı olan günlerde randevu verilemeyecektir.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4 mb-2 border-b border-slate-100">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-slate-700">Ders Süresi / Zaman Atama Aralığı (Dakika)</Label>
                            <Input
                                type="number"
                                value={sessionDuration}
                                onChange={(e) => setSessionDuration(Number(e.target.value))}
                                min={15}
                                step={5}
                                className="w-32 bg-white"
                            />
                            <p className="text-xs text-slate-500">
                                Takvimdeki randevu slotları bu süre baz alınarak hesaplanacaktır.
                            </p>
                        </div>
                    </div>

                    {hours && (
                        <div className="space-y-4 py-4">
                            {DAYS.map((day) => (
                                <div key={day.id} className="grid grid-cols-4 items-center gap-4 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={hours[day.id].isOpen}
                                            onChange={(e) => updateDay(day.id, 'isOpen', e.target.checked)}
                                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                                        />
                                        <span className={`font-medium text-sm ${!hours[day.id].isOpen ? 'text-slate-400' : 'text-slate-700'}`}>
                                            {day.name}
                                        </span>
                                    </div>

                                    <div className="col-span-3 flex items-center gap-2">
                                        <Input
                                            type="time"
                                            value={hours[day.id].open}
                                            disabled={!hours[day.id].isOpen}
                                            onChange={(e) => updateDay(day.id, 'open', e.target.value)}
                                            className="bg-white"
                                        />
                                        <span className="text-slate-400">-</span>
                                        <Input
                                            type="time"
                                            value={hours[day.id].close}
                                            disabled={!hours[day.id].isOpen}
                                            onChange={(e) => updateDay(day.id, 'close', e.target.value)}
                                            className="bg-white"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsHoursDialogOpen(false)}>İptal</Button>
                        <Button
                            onClick={handleSaveHours}
                            disabled={saving}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Değişiklikleri Kaydet
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* PERSONEL DİALOG */}
            <Dialog open={isStaffDialogOpen} onOpenChange={setIsStaffDialogOpen}>
                <DialogContent className="max-w-xl max-h-[95vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Personel Yönetimi</DialogTitle>
                        <DialogDescription>
                            Sanal takvimde dersleri ayırmak için her personele benzersiz bir renk atayın.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* EKLEME FORMU */}
                        <div className="grid gap-6">
                            <div className="space-y-4">
                                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 gap-3">
                                    <Label htmlFor="staff-avatar-upload" className="cursor-pointer group relative">
                                        <Avatar className="h-20 w-20 border-2 border-white shadow-md group-hover:border-slate-300 transition-all">
                                            <AvatarImage src={newStaffAvatar} />
                                            <AvatarFallback className="bg-white text-slate-300">
                                                <User size={32} />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Plus size={20} className="text-white" />
                                        </div>
                                    </Label>
                                    <input
                                        id="staff-avatar-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setNewStaffAvatar(reader.result as string);
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    <div className="text-center">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase">Profil Fotoğrafı</p>
                                        <p className="text-[9px] text-slate-400">Yüklemek için tıklayın</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ad Soyad</Label>
                                        <Input
                                            placeholder="Örn: Ahmet Hoca"
                                            value={newStaffName}
                                            onChange={(e) => setNewStaffName(e.target.value)}
                                            className="h-10 bg-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">T.C. Kimlik No</Label>
                                        <Input
                                            placeholder="11 Haneli"
                                            maxLength={11}
                                            value={newStaffTC}
                                            onChange={(e) => setNewStaffTC(e.target.value.replace(/\D/g, ""))}
                                            className="h-10 bg-white"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Telefon</Label>
                                        <Input
                                            placeholder="05..."
                                            value={newStaffPhone}
                                            onChange={(e) => setNewStaffPhone(e.target.value)}
                                            className="h-10 bg-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">E-posta</Label>
                                        <Input
                                            placeholder="hoca@salon.com"
                                            type="email"
                                            value={newStaffEmail}
                                            onChange={(e) => setNewStaffEmail(e.target.value)}
                                            className="h-10 bg-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Branş</Label>
                                    <Input
                                        placeholder="Örn: Reformer Pilates, Yoga"
                                        value={newStaffBranch}
                                        onChange={(e) => setNewStaffBranch(e.target.value)}
                                        className="h-10 bg-white"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Katılım Tarihi</Label>
                                        <Input
                                            type="date"
                                            value={newStaffStartDate}
                                            onChange={(e) => setNewStaffStartDate(e.target.value)}
                                            className="h-10 bg-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sözleşme Bitiş (Opsiyonel)</Label>
                                        <Input
                                            type="date"
                                            value={newStaffEndDate}
                                            onChange={(e) => setNewStaffEndDate(e.target.value)}
                                            className="h-10 bg-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Takvim Rengi</Label>
                                        <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-md border border-slate-200">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedColor }} />
                                            <span className="text-[10px] font-mono font-bold text-slate-600 uppercase">{selectedColor}</span>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                                        <div className="p-3 border-b border-slate-50 bg-slate-50/30">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 text-center">Önerilen Renkler</p>
                                            <div className="flex flex-wrap gap-2 justify-center">
                                                {PERSONNEL_COLORS.map((color) => {
                                                    const isUsed = instructors.some(i => i.color === color);
                                                    return (
                                                        <button
                                                            key={color}
                                                            onClick={() => !isUsed && setSelectedColor(color)}
                                                            disabled={isUsed}
                                                            className={`h-7 w-7 rounded-full border-2 transition-all relative flex items-center justify-center ${selectedColor === color ? 'border-slate-900 scale-110 shadow-md ring-2 ring-slate-100' : 'border-transparent'
                                                                } ${isUsed ? 'opacity-5 cursor-not-allowed grayscale' : 'hover:scale-110 shadow-sm'}`}
                                                            style={{ backgroundColor: color }}
                                                        >
                                                            {selectedColor === color && <Check size={12} className="text-white drop-shadow-sm" />}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="p-3 flex items-center justify-between gap-4 bg-slate-50/50">
                                            <div className="flex flex-col gap-0.5">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Özel Renk Belirle</p>
                                                <p className="text-[9px] text-slate-400">Benzersiz bir ton seçin</p>
                                            </div>
                                            <div className="relative">
                                                <Label
                                                    htmlFor="mgmt-custom-color"
                                                    className="flex items-center gap-2.5 px-3 py-2 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 hover:shadow-md hover:bg-slate-50 transition-all cursor-pointer group"
                                                >
                                                    <div
                                                        className="w-5 h-5 rounded-full border border-black/5 shadow-inner"
                                                        style={{ backgroundColor: selectedColor || PERSONNEL_COLORS[0] }}
                                                    />
                                                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Renk Paleti</span>
                                                    <Palette size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                                                </Label>
                                                <input
                                                    id="mgmt-custom-color"
                                                    type="color"
                                                    value={selectedColor || PERSONNEL_COLORS[0]}
                                                    onChange={(e) => setSelectedColor(e.target.value)}
                                                    className="sr-only"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleAddStaff}
                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white h-11"
                                    disabled={addingStaff || !newStaffName.trim()}
                                >
                                    {addingStaff ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                    Personel Kaydı Oluştur
                                </Button>
                            </div>

                            <div className="border-t border-slate-100 pt-4 space-y-3">
                                <div className="flex items-center justify-between gap-4">
                                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Kayıtlı Personeller ({filteredInstructors.length})</Label>
                                    <div className="relative flex-1 max-w-[200px]">
                                        <Input
                                            placeholder="Ara (Ad, Branş, Tarih)..."
                                            value={instructorSearchTerm}
                                            onChange={(e) => setInstructorSearchTerm(e.target.value)}
                                            className="h-8 text-[11px] pl-7 bg-slate-50"
                                        />
                                        <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-slate-400" />
                                    </div>
                                </div>

                                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                                    {filteredInstructors.length === 0 ? (
                                        <div className="p-8 text-center border-2 border-dashed border-slate-100 rounded-xl">
                                            <p className="text-xs text-slate-400 italic">Personel bulunamadı.</p>
                                        </div>
                                    ) : (
                                        filteredInstructors.map((staff) => (
                                            <div key={staff.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 group">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <Avatar className="h-10 w-10 border border-white shadow-sm">
                                                            <AvatarImage src={staff.avatar} />
                                                            <AvatarFallback className="bg-white text-slate-300 text-xs font-bold">
                                                                {staff.name.substring(0, 2).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: staff.color }} />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-800 leading-none mb-1">{staff.name}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] text-slate-500 font-medium">{staff.branch}</span>
                                                            <span className="text-slate-300 text-[10px]">|</span>
                                                            <span className="text-[10px] text-slate-400 font-bold">{staff.startDate}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-slate-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                                    onClick={() => handleDeleteStaff(staff.id)}
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
