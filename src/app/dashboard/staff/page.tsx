"use client";

import { useEffect, useState } from "react";
import { StaffMember } from "@/types";
import { getStaffList, addStaff, updateStaff, deleteStaff } from "@/lib/services/staffService";
import { useAuth } from "@/context/AuthContext";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
    Search, Plus, MoreHorizontal, Pencil, Trash2, Loader2, Shield,
    User,
    Dumbbell,
    Check,
    Palette
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeCheck, GraduationCap } from "lucide-react";

const BRANCH_OPTIONS = ["Pilates Reformer", "Yoga", "Kick Boks", "Zumba", "Crossfit", "Fitness"];
const LEVEL_OPTIONS = [
    { id: 'beginner', label: 'Başlangıç', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    { id: 'intermediate', label: 'Orta', color: 'bg-sky-50 text-sky-700 border-sky-100' },
    { id: 'advanced', label: 'İleri', color: 'bg-purple-50 text-purple-700 border-purple-100' }
] as const;

const PERSONNEL_COLORS = [
    "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
    "#EC4899", "#06B6D4", "#F97316", "#64748B", "#14B8A6",
    "#84cc16", "#a855f7", "#6366f1", "#f43f5e", "#d946ef"
];

export default function StaffPage() {
    const { user } = useAuth();
    const [staffList, setStaffList] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Dialog States
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
    const [formData, setFormData] = useState<Partial<StaffMember>>({
        name: "",
        email: "",
        phone: "",
        role: "staff",
        status: "active",
        tc: "",
        branch: "",
        startDate: new Date().toISOString().split('T')[0],
        endDate: "",
        color: PERSONNEL_COLORS[0],
        branchLevels: {}
    });

    useEffect(() => {
        loadStaff();
    }, []);

    const loadStaff = async () => {
        setLoading(true);
        try {
            const data = await getStaffList();
            setStaffList(data);
        } catch (error) {
            console.error("Personel yüklenirken hata:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredStaff = staffList.filter(staff =>
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.phone.includes(searchTerm)
    );

    const handleOpenAdd = () => {
        setEditingStaff(null);
        setFormData({
            name: "",
            email: "",
            phone: "",
            role: "staff",
            status: "active",
            tc: "",
            branch: "",
            startDate: new Date().toISOString().split('T')[0],
            endDate: "",
            color: PERSONNEL_COLORS[0],
            branchLevels: {}
        });
        setIsDialogOpen(true);
    };

    const toggleBranchLevel = (branch: string, level: 'beginner' | 'intermediate' | 'advanced') => {
        const currentLevels = (formData.branchLevels || {})[branch] || [];
        const updatedLevels = currentLevels.includes(level)
            ? currentLevels.filter(l => l !== level)
            : [...currentLevels, level];

        setFormData({
            ...formData,
            branchLevels: {
                ...(formData.branchLevels || {}),
                [branch]: updatedLevels
            }
        });
    };

    const handleOpenEdit = (staff: StaffMember) => {
        setEditingStaff(staff);
        setFormData(staff);
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingStaff) {
                // Update
                const updated = await updateStaff(editingStaff.id, formData);
                if (updated) {
                    setStaffList(staffList.map(s => s.id === updated.id ? updated : s));
                }
            } else {
                // Add
                const newStaff = await addStaff({
                    ...formData as StaffMember,
                    joinDate: new Date().toISOString().split('T')[0],
                    avatar: formData.avatar || "/staff-avatar.png"
                });
                if (newStaff) {
                    setStaffList([newStaff, ...staffList]);
                }
            }
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Kaydetme hatası:", error);
            alert("Bir hata oluştu.");
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Bu personeli silmek istediğinize emin misiniz?")) {
            try {
                await deleteStaff(id);
                setStaffList(staffList.filter(s => s.id !== id));
            } catch (error) {
                console.error("Silme hatası:", error);
            }
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700"><Shield className="w-3 h-3 mr-1" /> Yönetici</span>;
            case 'trainer':
                return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700"><Dumbbell className="w-3 h-3 mr-1" /> Eğitmen</span>;
            default:
                return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"><User className="w-3 h-3 mr-1" /> Personel</span>;
        }
    };

    if (user?.role !== 'admin') {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500">
                <Shield className="w-12 h-12 mb-4 text-slate-300" />
                <h2 className="text-xl font-semibold text-slate-900">Yetkisiz Erişim</h2>
                <p>Bu sayfayı görüntüleme yetkiniz yok.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Personel Yönetimi</h1>
                    <p className="text-slate-500 mt-1">
                        Toplam <span className="font-semibold text-slate-800">{staffList.length}</span> personel bulunuyor.
                    </p>
                </div>
                <Button onClick={handleOpenAdd} className="bg-slate-900 text-white hover:bg-slate-800">
                    <Plus className="mr-2 h-4 w-4" />
                    Yeni Personel Ekle
                </Button>
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="İsim veya telefon ile ara..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="pl-9"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border border-slate-200 bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Personel Bilgisi</TableHead>
                            <TableHead>İletişim</TableHead>
                            <TableHead>Rol / Yetki</TableHead>
                            <TableHead>Durum</TableHead>
                            <TableHead>Performans</TableHead>
                            <TableHead>Katılım Tarihi</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    <div className="flex justify-center items-center gap-2 text-slate-500">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Yükleniyor...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredStaff.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                                    Kayıt bulunamadı.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredStaff.map((staff) => (
                                <TableRow key={staff.id} className="hover:bg-slate-50">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <Avatar className="h-9 w-9 border border-slate-100 shadow-sm">
                                                    <AvatarImage src={staff.avatar} />
                                                    <AvatarFallback className={`${staff.role === 'trainer' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                                        {staff.name.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                {staff.color && (
                                                    <div
                                                        className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white shadow-sm"
                                                        style={{ backgroundColor: staff.color }}
                                                        title="Personel Rengi"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 leading-none mb-1">{staff.name}</span>
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">ID: #{staff.id}</span>
                                                        {staff.branch && (
                                                            <>
                                                                <span className="text-slate-300">|</span>
                                                                <span className="text-[10px] px-1.5 py-0.5 bg-slate-900/5 text-slate-600 rounded font-bold uppercase tracking-tight">{staff.branch}</span>
                                                            </>
                                                        )}
                                                    </div>

                                                    {/* Authorizations Bar (Granular) */}
                                                    {staff.branchLevels && Object.entries(staff.branchLevels).some(([_, levels]) => levels.length > 0) && (
                                                        <div className="flex flex-wrap gap-2 mt-1.5 max-w-[300px]">
                                                            {Object.entries(staff.branchLevels).map(([branch, levels]) => (
                                                                levels.length > 0 && (
                                                                    <div key={branch} className="flex items-center bg-white border border-slate-200 rounded overflow-hidden shadow-sm">
                                                                        <span className="px-1.5 py-0.5 bg-slate-900/5 text-slate-600 text-[8px] font-bold uppercase border-r border-slate-100">
                                                                            {branch}
                                                                        </span>
                                                                        <div className="flex px-1 gap-0.5">
                                                                            {levels.map(l => (
                                                                                <span key={l} className={`text-[7px] font-bold uppercase ${LEVEL_OPTIONS.find(opt => opt.id === l)?.color?.split(' ')[1] || 'text-slate-400'
                                                                                    }`}>
                                                                                    {l.substring(0, 3)}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-sm text-slate-600">
                                            <div className="flex items-center gap-1.5 font-medium">
                                                <span>{staff.phone}</span>
                                            </div>
                                            <span className="text-xs text-slate-400">{staff.email}</span>
                                            {staff.tc && (
                                                <span className="text-[10px] text-slate-400 mt-0.5">TC: {staff.tc}</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getRoleBadge(staff.role)}
                                    </TableCell>
                                    <TableCell>
                                        {staff.status === 'active' ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                Aktif
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                Pasif
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Kayıt:</span>
                                                    <span className="text-xs font-bold text-slate-700">{staff.totalMembers || 0} Üye</span>
                                                </div>
                                                {staff.lastRegistrationPeriod && (
                                                    <span className="text-[9px] text-slate-400 font-medium ml-8 leading-none">({staff.lastRegistrationPeriod} Paket)</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Kazanç:</span>
                                                <span className="text-xs font-bold text-emerald-600">₺{(staff.totalRevenue || 0).toLocaleString('tr-TR')}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-sm">
                                            <div className="flex items-center gap-1.5 font-bold text-slate-700">
                                                <span>{staff.joinDate}</span>
                                            </div>
                                            {staff.endDate && (
                                                <span className="text-[10px] text-red-500 font-medium">Bitiş: {staff.endDate}</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Menü aç</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleOpenEdit(staff)}>
                                                    <Pencil className="mr-2 h-4 w-4" /> Düzenle
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleDelete(staff.id)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Sil
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Add/Edit Modal */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px] max-h-[95vh] overflow-y-auto">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-xl font-bold text-slate-900 leading-none">
                            {editingStaff ? "Personel Düzenle" : "Yeni Personel Ekle"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            {/* Avatar Section */}
                            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 gap-3">
                                <Label htmlFor="staff-avatar-upload" className="cursor-pointer group relative">
                                    <Avatar className="h-20 w-20 border-2 border-white shadow-md group-hover:border-slate-300 transition-all">
                                        <AvatarImage src={formData.avatar} />
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
                                                setFormData({ ...formData, avatar: reader.result as string });
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                                <div className="text-center">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Profil Fotoğrafı</p>
                                    <p className="text-[9px] text-slate-400">Yüklemek için tıklayın</p>
                                </div>
                            </div>

                            {/* Name & TC */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ad Soyad</Label>
                                    <Input
                                        placeholder="Örn: Ahmet Hoca"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="h-10 bg-white"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">T.C. Kimlik No</Label>
                                    <Input
                                        placeholder="11 Haneli"
                                        maxLength={11}
                                        value={formData.tc}
                                        onChange={(e) => setFormData({ ...formData, tc: e.target.value.replace(/\D/g, "") })}
                                        className="h-10 bg-white"
                                    />
                                </div>
                            </div>

                            {/* Phone & Email */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Telefon</Label>
                                    <Input
                                        placeholder="05..."
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="h-10 bg-white"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">E-posta</Label>
                                    <Input
                                        placeholder="hoca@salon.com"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="h-10 bg-white"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Branch & Role/Status */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Branş</Label>
                                    <Input
                                        placeholder="Örn: Reformer Pilates"
                                        value={formData.branch}
                                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                                        className="h-10 bg-white"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rol</Label>
                                        <Select
                                            value={formData.role}
                                            onValueChange={(val: 'admin' | 'staff' | 'trainer') => setFormData({ ...formData, role: val })}
                                        >
                                            <SelectTrigger className="h-10 bg-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="staff">Personel</SelectItem>
                                                <SelectItem value="trainer">Eğitmen</SelectItem>
                                                <SelectItem value="admin">Yönetici</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Durum</Label>
                                        <Select
                                            value={formData.status}
                                            onValueChange={(val: 'active' | 'passive') => setFormData({ ...formData, status: val })}
                                        >
                                            <SelectTrigger className="h-10 bg-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">Aktif</SelectItem>
                                                <SelectItem value="passive">Pasif</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Katılım Tarihi</Label>
                                    <Input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="h-10 bg-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sözleşme Bitiş</Label>
                                    <Input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="h-10 bg-white"
                                    />
                                </div>
                            </div>

                            {/* Granular Session Authorizations SECTION */}
                            <div className="space-y-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-200/60">
                                <div className="flex items-center gap-2 pb-1 border-b border-slate-200/40">
                                    <div className="p-1.5 bg-blue-500 rounded-lg shadow-sm">
                                        <BadgeCheck className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                        <Label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Branş Bazlı Seviye Yetkileri</Label>
                                        <p className="text-[9px] text-slate-400 tracking-tight">Her ders için personelin hangi seviyeleri verebileceğini seçin</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {BRANCH_OPTIONS.map(branch => (
                                        <div key={branch} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                            <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Dumbbell className="w-3.5 h-3.5 text-slate-400" />
                                                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{branch}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-[8px] font-bold text-slate-400 uppercase">Seviyeler:</span>
                                                    <span className="text-[9px] font-bold text-blue-600">{(formData.branchLevels?.[branch]?.length || 0)}</span>
                                                </div>
                                            </div>
                                            <div className="p-2 flex flex-wrap gap-2">
                                                {LEVEL_OPTIONS.map(level => (
                                                    <button
                                                        key={level.id}
                                                        type="button"
                                                        onClick={() => toggleBranchLevel(branch, level.id)}
                                                        className={`flex-1 min-w-[30%] flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${formData.branchLevels?.[branch]?.includes(level.id)
                                                            ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                                                            : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-600'
                                                            }`}
                                                    >
                                                        {level.label}
                                                        {formData.branchLevels?.[branch]?.includes(level.id) && <Check size={10} />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Color Selection for All Staff */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Takvim Rengi</Label>
                                    <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-md border border-slate-200">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: formData.color || PERSONNEL_COLORS[0] }} />
                                        <span className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-wider">{formData.color || PERSONNEL_COLORS[0]}</span>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                                    <div className="p-3 border-b border-slate-50 bg-slate-50/30">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-center">Önerilen Renkler</p>
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            {PERSONNEL_COLORS.map((color) => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, color })}
                                                    className={`h-7 w-7 rounded-full border-2 transition-all relative flex items-center justify-center ${formData.color === color ? 'border-slate-900 scale-110 shadow-md ring-2 ring-slate-100' : 'border-transparent hover:scale-110'
                                                        }`}
                                                    style={{ backgroundColor: color }}
                                                >
                                                    {formData.color === color && <Check size={12} className="text-white drop-shadow-sm" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-3 flex items-center justify-between gap-4 bg-slate-50/50">
                                        <div className="flex flex-col gap-0.5">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Özel Renk Belirle</p>
                                            <p className="text-[9px] text-slate-400">Benzersiz bir ton seçin</p>
                                        </div>
                                        <div className="relative">
                                            <Label
                                                htmlFor="staff-custom-color"
                                                className="flex items-center gap-2.5 px-3 py-2 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 hover:shadow-md hover:bg-slate-50 transition-all cursor-pointer group"
                                            >
                                                <div
                                                    className="w-5 h-5 rounded-full border border-black/5 shadow-inner"
                                                    style={{ backgroundColor: formData.color || PERSONNEL_COLORS[0] }}
                                                />
                                                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Renk Paleti</span>
                                                <Palette size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                                            </Label>
                                            <input
                                                id="staff-custom-color"
                                                type="color"
                                                value={formData.color || PERSONNEL_COLORS[0]}
                                                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                                className="sr-only"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="h-11">İptal</Button>
                            <Button type="submit" className="h-11 bg-slate-900 hover:bg-slate-800 text-white min-w-[140px]">
                                {editingStaff ? "Değişiklikleri Kaydet" : "Personel Kaydı Oluştur"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
