"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Member, MemberNote, StaffMember } from "@/types";
import { getMembers, addMember, updateMember, deleteMember, sendSmsNotification, sendBirthdaySms, getMemberNotes, addMemberNote, updateMemberNote, deleteMemberNote } from "@/lib/services/memberService";
import { getStaffList } from "@/lib/services/staffService";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
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
import { Textarea } from "@/components/ui/textarea";
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
import { Search, Plus, MoreHorizontal, Pencil, Trash2, Loader2, User as UserIcon, Lock, RefreshCw, Mail, QrCode, Scan, Cake, Send, MessageSquare } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function MembersPage() {
    const { user } = useAuth();
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Dialog States
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<Member | null>(null);
    const [notes, setNotes] = useState<MemberNote[]>([]); // Üye Notları State

    // Note Dialog State
    const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
    const [searchTermMember, setSearchTermMember] = useState("");
    const [showMemberResults, setShowMemberResults] = useState(false);
    const [staffList, setStaffList] = useState<StaffMember[]>([]); // Personel Listesi
    const [editingNoteId, setEditingNoteId] = useState<number | null>(null); // Düzenlenen not ID'si
    const [noteFormData, setNoteFormData] = useState({
        memberId: "",
        note: "",
        type: "info" as 'info' | 'warning' | 'success' | 'danger',
        createdBy: ""
    });

    const [formData, setFormData] = useState<Partial<Member>>({
        name: "",
        email: "",
        phone: "",
        membershipType: "Standart",
        remainingSessions: 0,
        status: "active",
        paymentAmount: 0,
        paymentMethod: "Nakit",
        gender: "Erkek",
        birthDate: "",
        profession: "",
        address: "",
        emergencyContact: "",
        qrCode: "",
        nfcId: "",
        password: "",
        branch: "",
        level: "beginner"
    });

    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'passive' | 'frozen' | 'pre-registration'>('all');
    const [branchFilter, setBranchFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // Constant options
    const BRANCH_OPTIONS = ["Pilates Reformer", "Yoga", "Kick Boks", "Zumba", "Crossfit", "Fitness"];
    const [birthdayMessage, setBirthdayMessage] = useState("Doğum gününüz kutlu olsun! Nice mutlu yaşlara. - Vetra Spor");

    useEffect(() => {
        loadMembers();
    }, []);

    const loadMembers = async () => {
        setLoading(true);
        try {
            const [data, notesData, staffData] = await Promise.all([
                getMembers(),
                getMemberNotes(),
                getStaffList()
            ]);
            setMembers(data);
            setNotes(notesData);
            setStaffList(staffData);
        } catch (error) {
            console.error("Üyeler yüklenirken hata:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredMembers = members.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.phone.includes(searchTerm);

        const matchesStatus = statusFilter === 'all' ? true : member.status === statusFilter;
        const matchesBranch = branchFilter === 'all' ? true : member.branch === branchFilter;

        return matchesSearch && matchesStatus && matchesBranch;
    }).sort((a, b) => b.id - a.id); // Sort by ID descending (Newest first)

    const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);
    const paginatedMembers = filteredMembers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, branchFilter]);

    const getUpcomingBirthdays = () => {
        const today = new Date();
        const currentYear = today.getFullYear();

        return members.filter(m => {
            if (!m.birthDate) return false;

            const birthDate = new Date(m.birthDate);
            // Bu yılki doğum günü
            const nextBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());

            // Eğer bu yılki geçtiyse, sonraki yıla bak (Opsiyonel, ama "yaklaşan" dediği için kalanlara bakalım)
            if (nextBirthday < new Date(today.setHours(0, 0, 0, 0))) {
                nextBirthday.setFullYear(currentYear + 1);
            }

            const diffTime = nextBirthday.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            return diffDays >= 0 && diffDays <= 7;
        });
    };

    const handleSendBirthdaySms = async (member: Member) => {
        if (!birthdayMessage) {
            alert("Lütfen bir mesaj metni giriniz.");
            return;
        }

        if (confirm(`${member.name} isimli üyeye doğum günü mesajı gönderilsin mi?`)) {
            await sendBirthdaySms(member, birthdayMessage);
            alert("Mesaj gönderildi!");
        }
    };

    const handleOpenAdd = () => {
        setEditingMember(null);
        setFormData({
            name: "",
            email: "",
            phone: "",
            membershipType: "Standart",
            remainingSessions: 0,
            status: "active",
            paymentAmount: 0,
            paymentMethod: "Nakit",
            addedBy: user?.username || 'Bilinmiyor',
            gender: "Erkek",
            birthDate: "",
            profession: "",
            address: "",
            emergencyContact: "",
            qrCode: "",
            nfcId: "",
            branch: "",
            level: "beginner",
            password: ""
        });
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (member: Member) => {
        setEditingMember(member);
        setFormData({ ...member, password: "" }); // Şifre düzenlemede boş gelir
        setIsDialogOpen(true);
    };

    const generatePassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let pass = "";
        for (let i = 0; i < 8; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setFormData({ ...formData, password: pass });
    };

    const generateQrCode = () => {
        // Benzersiz bir QR data oluştur (Örn: M_ + Timestamp + Random)
        const qr = `M_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        setFormData({ ...formData, qrCode: qr });
    };

    const simulateNfcRead = () => {
        // NFC okuma simülasyonu
        const nfc = `NFC_${Math.floor(Math.random() * 100000000)}`;
        alert("Kart okutuldu! Taranan ID: " + nfc);
        setFormData({ ...formData, nfcId: nfc });
    };

    const handleSendSms = async () => {
        if (!formData.phone || !formData.name) {
            alert("Lütfen en az İsim ve Telefon bilgilerini doldurun.");
            return;
        }

        const targetNumber = formData.phone;
        const confirmMsg = `${formData.name} isimli üyeye, ${targetNumber} numarasına SMS gönderilsin mi?\n\n(Bu numara ${editingMember ? 'mevcut kayıttan' : 'yeni girişten'} alınmıştır)`;

        if (confirm(confirmMsg)) {
            await sendSmsNotification(formData as Member, formData.password);
            alert(`SMS başarıyla simüle edildi.\nAlıcı: ${targetNumber}\n(Detaylar için tarayıcı konsoluna bakınız)`);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingMember) {
                // Update
                const updated = await updateMember(editingMember.id, formData);
                setMembers(members.map(m => m.id === updated.id ? updated : m));
            } else {
                // Add
                const newMember = await addMember({
                    ...formData as Member,
                    joinDate: new Date().toISOString().split('T')[0],
                    lastPaymentDate: new Date().toISOString().split('T')[0],
                    addedBy: formData.addedBy || user?.username || 'Bilinmiyor'
                });
                setMembers([newMember, ...members]);

                // SMS Gönder
                await sendSmsNotification(newMember, formData.password);
            }
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Kaydetme hatası:", error);
            alert("Bir hata oluştu.");
        }
    };

    const handleSaveNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!noteFormData.memberId || !noteFormData.note) {
            alert("Lütfen üye ve not alanlarını doldurunuz.");
            return;
        }

        const selectedMember = members.find(m => m.id === Number(noteFormData.memberId));
        if (!selectedMember) return;

        try {
            if (editingNoteId) {
                // UPDATE MODE
                const updatedNote = await updateMemberNote(editingNoteId, {
                    memberId: selectedMember.id,
                    memberName: selectedMember.name,
                    note: noteFormData.note,
                    type: noteFormData.type,
                    createdBy: noteFormData.createdBy || user?.username || "Admin"
                });
                setNotes(notes.map(n => n.id === editingNoteId ? updatedNote : n));
                alert("Not başarıyla güncellendi.");
            } else {
                // CREATE MODE
                const newNote = await addMemberNote({
                    memberId: selectedMember.id,
                    memberName: selectedMember.name,
                    note: noteFormData.note,
                    type: noteFormData.type,
                    createdBy: noteFormData.createdBy || user?.username || "Admin"
                });
                setNotes([newNote, ...notes]);
                alert("Not başarıyla eklendi.");
            }

            setIsNoteDialogOpen(false);
            setNoteFormData({ memberId: "", note: "", type: "info", createdBy: "" });
            setSearchTermMember("");
            setEditingNoteId(null);

        } catch (error) {
            console.error("Not işlem hatası:", error);
            alert("Bir hata oluştu.");
        }
    };

    const handleEditNote = (note: MemberNote) => {
        setEditingNoteId(note.id);
        setNoteFormData({
            memberId: note.memberId.toString(),
            note: note.note,
            type: note.type,
            createdBy: note.createdBy
        });
        setSearchTermMember(note.memberName);
        setIsNoteDialogOpen(true);
    };

    const handleDeleteNote = async (id: number) => {
        if (confirm("Bu notu silmek istediğinize emin misiniz?")) {
            try {
                await deleteMemberNote(id);
                setNotes(notes.filter(n => n.id !== id));
            } catch (error) {
                console.error("Silme hatası:", error);
                alert("Silinirken hata oluştu.");
            }
        }
    };

    const handleSendNoteSms = (note: MemberNote) => {
        const member = members.find(m => m.id === note.memberId);
        if (member) {
            const message = `Sayın ${member.name}, notunuz: ${note.note}`;
            // Normalde SMS servisine gider, şimdilik notify/konsol
            if (confirm(`Şu mesaj üyeye gönderilecek:\n\n"${message}"\n\nOnaylıyor musunuz?`)) {
                alert("SMS gönderildi (Simülasyon)");
                console.log("SMS SENT:", message);
            }
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Bu üyeyi silmek istediğinize emin misiniz?")) {
            try {
                await deleteMember(id);
                setMembers(members.filter(m => m.id !== id));
            } catch (error) {
                console.error("Silme hatası:", error);
            }
        }
    };

    return (
        <div className="space-y-8 w-full max-w-full overflow-x-hidden">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Üyeler</h1>
                    <p className="text-slate-500 mt-1">
                        Toplam <span className="font-semibold text-slate-800">{members.length}</span> kayıtlı üye bulunuyor.
                    </p>
                </div>
                <Button onClick={handleOpenAdd} className="bg-slate-900 text-white hover:bg-slate-800">
                    <Plus className="mr-2 h-4 w-4" />
                    Yeni Üye Ekle
                </Button>
            </div>

            {/* UPCOMING BIRTHDAYS SECTION */}
            {getUpcomingBirthdays().length > 0 && (
                <div className="rounded-xl border border-orange-200 bg-orange-50/50 p-6 space-y-4">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-bold text-orange-900 flex items-center gap-2">
                            <Cake className="w-5 h-5" />
                            Yaklaşan Doğum Günleri (7 Gün)
                        </h2>
                        <p className="text-orange-700/80 text-sm">
                            Aşağıdaki üyelerin doğum günü yaklaşıyor. Mesajınızı düzenleyip anında gönderebilirsiniz.
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="bday-msg" className="text-orange-900">SMS Mesajı</Label>
                        <Input
                            id="bday-msg"
                            value={birthdayMessage}
                            onChange={(e) => setBirthdayMessage(e.target.value)}
                            className="bg-white border-orange-200 focus-visible:ring-orange-500"
                        />
                    </div>

                    <div className="rounded-lg border border-orange-200 bg-white overflow-hidden overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-orange-100/50">
                                <TableRow>
                                    <TableHead className="text-orange-900 font-semibold">Üye</TableHead>
                                    <TableHead className="text-orange-900 font-semibold">Doğum Tarihi</TableHead>
                                    <TableHead className="text-orange-900 font-semibold">Telefon</TableHead>
                                    <TableHead className="text-right text-orange-900 font-semibold">İşlem</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {getUpcomingBirthdays().map(m => (
                                    <TableRow key={m.id}>
                                        <TableCell className="font-medium">{m.name}</TableCell>
                                        <TableCell>
                                            {new Date(m.birthDate!).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                                        </TableCell>
                                        <TableCell>{m.phone}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                size="sm"
                                                className="bg-orange-600 hover:bg-orange-700 text-white"
                                                onClick={() => handleSendBirthdaySms(m)}
                                            >
                                                <Send className="w-3 h-3 mr-2" />
                                                Gönder
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}



            {/* Member Notes Section */}
            <div className="mb-6">
                <Card className="border-slate-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="space-y-1">
                            <CardTitle className="text-lg font-bold text-slate-800">Üye Notları</CardTitle>
                            <CardDescription>Son eklenen üye notları ve uyarılar</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setIsNoteDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Yeni Not Ekle
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
                            </div>
                        ) : notes.length === 0 ? (
                            <div className="text-center py-8 text-slate-500 text-sm">
                                Henüz not eklenmemiş.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {notes.map((note) => (
                                    <div key={note.id} className={`p-4 rounded-lg border flex flex-col h-full gap-2 ${note.type === 'danger' ? 'bg-red-50 border-red-100' :
                                        note.type === 'warning' ? 'bg-orange-50 border-orange-100' :
                                            note.type === 'success' ? 'bg-green-50 border-green-100' :
                                                'bg-blue-50 border-blue-100'
                                        }`}>
                                        <div className="flex items-start justify-between">
                                            <div className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                                                {note.memberName}
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold ${note.type === 'danger' ? 'bg-red-200 text-red-700' :
                                                    note.type === 'warning' ? 'bg-orange-200 text-orange-700' :
                                                        note.type === 'success' ? 'bg-green-200 text-green-700' :
                                                            'bg-blue-200 text-blue-700'
                                                    }`}>
                                                    {note.type === 'danger' ? 'Kritik' :
                                                        note.type === 'warning' ? 'Uyarı' :
                                                            note.type === 'success' ? 'Bilgi' : 'Not'}
                                                </span>
                                            </div>
                                            <span className="text-xs text-slate-400">
                                                {format(new Date(note.date), "d MMM, HH:mm", { locale: tr })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            {note.note}
                                        </p>
                                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-200/50">
                                            <div className="text-xs text-slate-400 flex items-center gap-1">
                                                <UserIcon className="h-3 w-3" />
                                                {note.createdBy}
                                            </div>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-blue-600" onClick={() => handleEditNote(note)} title="Düzenle">
                                                    <Pencil className="w-3 h-3" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-green-600" onClick={() => handleSendNoteSms(note)} title="SMS Gönder">
                                                    <MessageSquare className="w-3 h-3" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-red-600" onClick={() => handleDeleteNote(note.id)} title="Sil">
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Filter */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                {/* Status Filter Buttons */}
                <div className="flex items-center p-1 bg-slate-100 rounded-lg flex-wrap gap-1">
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${statusFilter === 'all'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-500 hover:text-slate-900'
                            }`}
                    >
                        Tümü
                    </button>
                    <button
                        onClick={() => setStatusFilter('active')}
                        className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${statusFilter === 'active'
                            ? 'bg-white text-green-700 shadow-sm'
                            : 'text-slate-500 hover:text-green-700'
                            }`}
                    >
                        Aktif
                    </button>
                    <button
                        onClick={() => setStatusFilter('frozen')}
                        className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${statusFilter === 'frozen'
                            ? 'bg-white text-blue-700 shadow-sm'
                            : 'text-slate-500 hover:text-blue-700'
                            }`}
                    >
                        Dondurulmuş
                    </button>
                    <button
                        onClick={() => setStatusFilter('passive')}
                        className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${statusFilter === 'passive'
                            ? 'bg-white text-red-700 shadow-sm'
                            : 'text-slate-500 hover:text-red-700'
                            }`}
                    >
                        Pasif
                    </button>
                    <button
                        onClick={() => setStatusFilter('pre-registration')}
                        className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${statusFilter === 'pre-registration'
                            ? 'bg-white text-orange-700 shadow-sm'
                            : 'text-slate-500 hover:text-orange-700'
                            }`}
                    >
                        Ön Kayıt
                    </button>
                </div>

                {/* Branch Filter Buttons */}
                <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
                    <button
                        onClick={() => setBranchFilter('all')}
                        className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${branchFilter === 'all'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-500 hover:text-slate-900'
                            }`}
                    >
                        Tüm Branşlar
                    </button>
                    {BRANCH_OPTIONS.map(branch => (
                        <button
                            key={branch}
                            onClick={() => setBranchFilter(branch)}
                            className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${branchFilter === branch
                                ? 'bg-white text-indigo-700 shadow-sm'
                                : 'text-slate-500 hover:text-indigo-700'
                                }`}
                        >
                            {branch}
                        </button>
                    ))}
                </div>

                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
                    <Input
                        placeholder="İsim veya telefon ile ara..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="pl-9 h-8 text-xs"
                    />
                </div>
            </div>



            {/* Table */}
            <div className="rounded-md border border-slate-200 bg-white overflow-hidden overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Üye Bilgisi</TableHead>
                            <TableHead>Branş</TableHead>
                            <TableHead>Meslek</TableHead>
                            <TableHead>İletişim</TableHead>
                            <TableHead>Acil Durum</TableHead>
                            <TableHead>Üyelik Tipi</TableHead>
                            <TableHead>Kalan Hak</TableHead>
                            <TableHead>Ödeme</TableHead>
                            <TableHead>Durum</TableHead>
                            {user?.role === 'admin' && <TableHead>Kaydeden</TableHead>}
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={10} className="h-24 text-center">
                                    <div className="flex justify-center items-center gap-2 text-slate-500">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Yükleniyor...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredMembers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={10} className="h-24 text-center text-slate-500">
                                    Kayıt bulunamadı.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedMembers.map((member) => (
                                <TableRow key={member.id} className="hover:bg-slate-50">
                                    <TableCell className="py-2">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={member.avatar} />
                                                <AvatarFallback className="bg-slate-100 text-slate-600">
                                                    {member.name.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <Link href={`/dashboard/members/${member.id}`} className="font-medium text-slate-900 text-xs hover:text-indigo-600 transition-colors">
                                                    {member.name}
                                                </Link>
                                                <span className="text-[10px] text-slate-500">Katılım: {member.joinDate}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-2">
                                        {member.branch ? (
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                {member.branch}
                                            </span>
                                        ) : (
                                            <span className="text-slate-300 text-[10px]">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="py-2">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs font-medium text-slate-700">{member.profession || '-'}</span>
                                            {member.level && (
                                                <span className={`text-[10px] px-1 py-0 rounded-sm w-fit ${member.level === 'beginner' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                    member.level === 'intermediate' ? 'bg-sky-50 text-sky-600 border border-sky-100' :
                                                        'bg-purple-50 text-purple-600 border border-purple-100'
                                                    }`}>
                                                    {member.level === 'beginner' ? 'Başlangıç' : member.level === 'intermediate' ? 'Orta' : 'İleri'}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-2">
                                        <div className="flex flex-col text-xs text-slate-600">
                                            <span>{member.phone}</span>
                                            <span className="text-[10px] text-slate-400">{member.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-2">
                                        <div className="flex flex-col text-xs text-slate-600">
                                            {member.emergencyContact ? (
                                                <>
                                                    <span className="font-medium text-red-600">{member.emergencyContact.split('-')[0]}</span>
                                                    <span className="text-[10px] text-slate-400">{member.emergencyContact.split('-')[1] || ''}</span>
                                                </>
                                            ) : (
                                                <span className="text-slate-300 italic">-</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-2">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-800">
                                            {member.membershipType}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-2">
                                        <div className="font-bold text-slate-700 text-xs text-center">
                                            {member.remainingSessions}
                                        </div>
                                    </TableCell>
                                    {/* ÖDEME SÜTUNU */}
                                    <TableCell className="py-2">
                                        <div className="flex flex-col text-xs">
                                            {member.paymentMethod === 'Ödeme Alınmadı' ? (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-800 w-fit">
                                                    Ödenmedi
                                                </span>
                                            ) : member.paymentAmount ? (
                                                <>
                                                    <span className="font-semibold text-slate-900">₺{member.paymentAmount.toLocaleString()}</span>
                                                    <span className="text-[10px] text-slate-500">{member.paymentMethod || '-'}</span>
                                                </>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-2">
                                        {member.status === 'active' ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700">
                                                Aktif
                                            </span>
                                        ) : member.status === 'frozen' ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700">
                                                Dondurulmuş
                                            </span>
                                        ) : member.status === 'pre-registration' ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-orange-100 text-orange-700">
                                                Ön Kayıt
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-700">
                                                Pasif
                                            </span>
                                        )}
                                    </TableCell>
                                    {user?.role === 'admin' && (
                                        <TableCell className="py-2">
                                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                                <UserIcon className="h-3 w-3 text-slate-400" />
                                                {member.addedBy || '-'}
                                            </div>
                                        </TableCell>
                                    )}
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
                                                <DropdownMenuItem onClick={() => handleOpenEdit(member)}>
                                                    <Pencil className="mr-2 h-4 w-4" /> Düzenle
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleDelete(member.id)}>
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

            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-slate-500">
                    Toplam {filteredMembers.length} üyeden {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredMembers.length)} arası gösteriliyor
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        Önceki
                    </Button>
                    <span className="text-sm font-medium text-slate-600">
                        Sayfa {currentPage} / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Sonraki
                    </Button>
                </div>
            </div>





            {/* Add/Edit Modal */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>{editingMember ? "Üyeyi Düzenle" : "Yeni Üye Ekle"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Ad Soyad</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Telefon</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="gender">Cinsiyet</Label>
                                <Select
                                    value={formData.gender || "Erkek"}
                                    onValueChange={(val: "Erkek" | "Kadın" | "Diğer") => setFormData({ ...formData, gender: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seçiniz" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Erkek">Erkek</SelectItem>
                                        <SelectItem value="Kadın">Kadın</SelectItem>
                                        <SelectItem value="Diğer">Diğer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="branch">Branş</Label>
                                <Select
                                    value={formData.branch || ""}
                                    onValueChange={(val: string) => setFormData({ ...formData, branch: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Branş Seçiniz" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {BRANCH_OPTIONS.map(opt => (
                                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="profession">Meslek</Label>
                                <Input
                                    id="profession"
                                    value={formData.profession || ''}
                                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                                    placeholder="Örn: Mühendis"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="level">Seviye</Label>
                                <Select
                                    value={formData.level || "beginner"}
                                    onValueChange={(val: "beginner" | "intermediate" | "advanced") => setFormData({ ...formData, level: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seviye Seçiniz" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="beginner">Başlangıç</SelectItem>
                                        <SelectItem value="intermediate">Orta</SelectItem>
                                        <SelectItem value="advanced">İleri</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="birthDate">Doğum Tarihi</Label>
                                <Input
                                    id="birthDate"
                                    type="date"
                                    value={formData.birthDate || ''}
                                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">E-posta</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="address">Adres</Label>
                            <Textarea
                                id="address"
                                value={formData.address || ''}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Adres giriniz..."
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="emergency">Acil Durum Kişisi (Ad Soyad - Tel)</Label>
                            <Input
                                id="emergency"
                                value={formData.emergencyContact || ''}
                                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                                placeholder="Örn: Ali Veli - 0555 123 45 67"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="grid gap-2">
                                <Label className="flex items-center gap-2 mb-1">
                                    <QrCode className="w-4 h-4 text-slate-500" />
                                    QR Kod
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={formData.qrCode || ''}
                                        readOnly
                                        placeholder="Oluşturulmadı"
                                        className="bg-white text-xs"
                                    />
                                    <Button type="button" variant="outline" size="icon" onClick={generateQrCode} title="QR Oluştur">
                                        <RefreshCw className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label className="flex items-center gap-2 mb-1">
                                    <Scan className="w-4 h-4 text-slate-500" />
                                    NFC Kart
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={formData.nfcId || ''}
                                        readOnly
                                        placeholder="Okutulmadı"
                                        className="bg-white text-xs"
                                    />
                                    <Button type="button" variant="outline" size="icon" onClick={simulateNfcRead} title="Kart Tara (Simüle)">
                                        <Scan className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <Label className="flex items-center gap-2 mb-1">
                                <Lock className="w-4 h-4 text-slate-500" />
                                Giriş Şifresi
                            </Label>
                            <div className="flex gap-2">
                                <Input
                                    value={formData.password || ''}
                                    readOnly
                                    placeholder="Oluşturulan şifre buraya gelir"
                                    className="bg-white"
                                />
                                <Button type="button" variant="outline" onClick={generatePassword} title="Rastgele Şifre">
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Üret
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="type">Üyelik Tipi</Label>
                                <Select
                                    value={formData.membershipType}
                                    onValueChange={(val) => setFormData({ ...formData, membershipType: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seçiniz" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Standart">Standart</SelectItem>
                                        <SelectItem value="Gold">Gold</SelectItem>
                                        <SelectItem value="VIP">VIP</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="sessions">Tanımlanacak Hak</Label>
                                <Input
                                    id="sessions"
                                    type="number"
                                    value={formData.remainingSessions}
                                    onChange={(e) => setFormData({ ...formData, remainingSessions: Number(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="border-t border-slate-100 my-2 pt-2">
                            <Label className="text-xs font-bold text-slate-400">ÖDEME BİLGİLERİ (Opsiyonel)</Label>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="payment">Tutar (TL)</Label>
                                <Input
                                    id="payment"
                                    type="number"
                                    value={formData.paymentAmount || ''}
                                    onChange={(e) => setFormData({ ...formData, paymentAmount: Number(e.target.value) })}
                                    placeholder="0"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="method">Yöntem</Label>
                                <Select
                                    value={formData.paymentMethod || "Nakit"}
                                    onValueChange={(val: 'Nakit' | 'Kredi Kartı' | 'Havale/EFT' | 'Ödeme Alınmadı') => setFormData({ ...formData, paymentMethod: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seçiniz" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Nakit">Nakit</SelectItem>
                                        <SelectItem value="Kredi Kartı">Kredi Kartı</SelectItem>
                                        <SelectItem value="Havale/EFT">Havale/EFT</SelectItem>
                                        <SelectItem value="Ödeme Alınmadı">Ödeme Alınmadı</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="status">Durum</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(val: 'active' | 'passive' | 'frozen' | 'pre-registration') => setFormData({ ...formData, status: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seçiniz" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Aktif</SelectItem>
                                    <SelectItem value="frozen">Dondurulmuş</SelectItem>
                                    <SelectItem value="passive">Pasif</SelectItem>
                                    <SelectItem value="pre-registration">Ön Kayıt</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Kaydeden Bilgisi (Herkes görebilir, sadece Admin değiştirebilir) */}
                        <div className="grid gap-2">
                            <Label htmlFor="addedBy">Kaydeden Personel</Label>
                            <Select
                                value={formData.addedBy || ""}
                                onValueChange={(val) => setFormData({ ...formData, addedBy: val })}
                                disabled={user?.role !== 'admin'}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Personel Seçiniz" />
                                </SelectTrigger>
                                <SelectContent>
                                    {staffList.map(staff => (
                                        <SelectItem key={staff.id} value={staff.name}>
                                            {staff.name} ({staff.role === 'admin' ? 'Yönetici' : staff.role === 'trainer' ? 'Eğitmen' : 'Personel'})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button type="button" variant="secondary" onClick={handleSendSms} className="gap-2">
                                <Mail className="w-4 h-4" />
                                SMS Gönder
                            </Button>
                            <Button type="submit">Kaydet</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Add Note Modal */}
            <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingNoteId ? "Notu Düzenle" : "Yeni Not Ekle"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSaveNote} className="grid gap-4 py-4">
                        <div className="grid gap-2 relative">
                            <Label htmlFor="noteMember">Üye (İsim Yazınız)</Label>
                            <Input
                                id="noteMember"
                                placeholder="Üye adı yazın..."
                                value={searchTermMember}
                                onChange={(e) => {
                                    setSearchTermMember(e.target.value);
                                    setShowMemberResults(true);
                                    setNoteFormData({ ...noteFormData, memberId: "" }); // Reset ID on change to ensure valid selection
                                }}
                                autoComplete="off"
                            />
                            {showMemberResults && searchTermMember && (
                                <div className="absolute top-[70px] z-10 w-full bg-white border border-slate-200 rounded-md shadow-lg max-h-[200px] overflow-auto">
                                    {members
                                        .filter(m => m.name.toLowerCase().includes(searchTermMember.toLowerCase()))
                                        .map(m => (
                                            <div
                                                key={m.id}
                                                className="px-4 py-2 hover:bg-slate-100 cursor-pointer text-sm"
                                                onClick={() => {
                                                    setNoteFormData({ ...noteFormData, memberId: m.id.toString() });
                                                    setSearchTermMember(m.name);
                                                    setShowMemberResults(false);
                                                }}
                                            >
                                                {m.name}
                                            </div>
                                        ))
                                    }
                                    {members.filter(m => m.name.toLowerCase().includes(searchTermMember.toLowerCase())).length === 0 && (
                                        <div className="px-4 py-2 text-sm text-slate-500">Sonuç bulunamadı</div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="noteCreator">Notu Yazan (Hoca/Personel)</Label>
                            <Select
                                value={noteFormData.createdBy}
                                onValueChange={(val) => setNoteFormData({ ...noteFormData, createdBy: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Personel Seçiniz" />
                                </SelectTrigger>
                                <SelectContent>
                                    {staffList.map(staff => (
                                        <SelectItem key={staff.id} value={staff.name}>
                                            {staff.name} ({staff.role === 'admin' ? 'Yönetici' : staff.role === 'trainer' ? 'Eğitmen' : 'Personel'})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="noteType">Not Tipi</Label>
                            <Select
                                value={noteFormData.type}
                                onValueChange={(val: 'info' | 'warning' | 'success' | 'danger') => setNoteFormData({ ...noteFormData, type: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Tip Seçiniz" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="info">Bilgi (Mavi)</SelectItem>
                                    <SelectItem value="warning">Uyarı (Turuncu)</SelectItem>
                                    <SelectItem value="danger">Kritik (Kırmızı)</SelectItem>
                                    <SelectItem value="success">Başarılı (Yeşil)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="noteContent">Not İçeriği</Label>
                            <Textarea
                                id="noteContent"
                                value={noteFormData.note}
                                onChange={(e) => setNoteFormData({ ...noteFormData, note: e.target.value })}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSaveNote(e as unknown as React.FormEvent);
                                    }
                                }}
                                placeholder="Notunuzu buraya yazınız... (Satır atlamak için Shift+Enter)"
                                required
                            />
                        </div>

                        <DialogFooter>
                            <Button type="submit">Kaydet</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div >
    );
}

