"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
    ClipboardList, 
    Info, 
    Plus, 
    Trash2, 
    Settings2, 
    Hash, 
    Ruler, 
    Type,
    Dumbbell,
    Activity,
    Flame,
    FileText,
    FileSignature,
    Printer,
    Save,
    Eye,
    Accessibility,
    Wallet,
    Pencil,
    Snowflake,
    Repeat,
    Timer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
    getMeasurements, 
    addMeasurement, 
    deleteMeasurement,
    getEquipment,
    addEquipment,
    deleteEquipment,
    getMuscleGroups,
    addMuscleGroup,
    deleteMuscleGroup,
    getExercises,
    addExercise,
    deleteExercise,
    getTrainingPrograms,
    addTrainingProgram,
    deleteTrainingProgram,
} from "@/lib/services/definitionService";
import { getContract, saveContract } from "@/lib/services/contractService";
import {
    getPackages,
    addPackage,
    updatePackage,
    deletePackage,
    describePackage,
} from "@/lib/services/packageService";
import { 
    MeasurementDefinition, 
    EquipmentDefinition, 
    MuscleGroup, 
    ExerciseDefinition, 
    TrainingProgramDefinition,
    ContractDefinition,
    MembershipPackage,
    PackageBillingType
} from "@/types";

export default function DefinitionsPage() {
    const [activeTab, setActiveTab] = useState<"packages" | "measurements" | "equipment" | "muscles" | "exercises" | "programs" | "contracts">("measurements");
    
    // Measurements State
    const [measurements, setMeasurements] = useState<MeasurementDefinition[]>([]);
    const [loadingMeasurements, setLoadingMeasurements] = useState(true);
    const [isAddMeasurementDialogOpen, setIsAddMeasurementDialogOpen] = useState(false);
    const [newMeasurement, setNewMeasurement] = useState<Omit<MeasurementDefinition, 'id'>>({
        name: "",
        orderNo: 0,
        unit: ""
    });

    // Equipment State
    const [equipment, setEquipment] = useState<EquipmentDefinition[]>([]);
    const [loadingEquipment, setLoadingEquipment] = useState(true);
    const [isAddEquipmentDialogOpen, setIsAddEquipmentDialogOpen] = useState(false);
    const [newEquipment, setNewEquipment] = useState<Omit<EquipmentDefinition, 'id'>>({
        name: "",
        category: "",
        brand: ""
    });

    // Muscle Group State
    const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
    const [loadingMuscles, setLoadingMuscles] = useState(true);
    const [isAddMuscleDialogOpen, setIsAddMuscleDialogOpen] = useState(false);
    const [newMuscleGroup, setNewMuscleGroup] = useState<Omit<MuscleGroup, 'id'>>({
        name: ""
    });

    // Exercise State
    const [exercises, setExercises] = useState<ExerciseDefinition[]>([]);
    const [loadingExercises, setLoadingExercises] = useState(true);
    const [isAddExerciseDialogOpen, setIsAddExerciseDialogOpen] = useState(false);
    const [newExercise, setNewExercise] = useState<Omit<ExerciseDefinition, 'id'>>({
        name: "",
        muscleGroupId: undefined,
        equipmentId: undefined,
        description: ""
    });

    // Training Program State
    const [programs, setPrograms] = useState<TrainingProgramDefinition[]>([]);
    const [loadingPrograms, setLoadingPrograms] = useState(true);
    const [isAddProgramDialogOpen, setIsAddProgramDialogOpen] = useState(false);
    const [newProgram, setNewProgram] = useState<Omit<TrainingProgramDefinition, 'id'>>({
        name: "",
        description: "",
        type: "Full Body",
        visibility: "instructors_only"
    });

    // Üyelik Paketleri State
    const [packages, setPackages] = useState<MembershipPackage[]>([]);
    const [loadingPackages, setLoadingPackages] = useState(true);
    const [isPackageDialogOpen, setIsPackageDialogOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<MembershipPackage | null>(null);
    const [newPackage, setNewPackage] = useState<Omit<MembershipPackage, "id">>({
        name: "",
        billingType: "session",
        sessionCount: 8,
        durationDays: 30,
        price: 0,
        branch: "",
        freezeRightDays: 15,
        carryOverSessions: 0,
        cancellationHours: 12,
        description: "",
        isActive: true,
    });

    // Contract Template State
    const [contract, setContract] = useState<ContractDefinition | null>(null);
    const [loadingContract, setLoadingContract] = useState(true);
    const [isSavingContract, setIsSavingContract] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoadingMeasurements(true);
        setLoadingEquipment(true);
        setLoadingMuscles(true);
        setLoadingExercises(true);
        setLoadingPrograms(true);
        setLoadingContract(true);
        setLoadingPackages(true);
        try {
            const [mList, eList, mgList, exList, pList, cDoc, pkgList] = await Promise.all([
                getMeasurements(),
                getEquipment(),
                getMuscleGroups(),
                getExercises(),
                getTrainingPrograms(),
                getContract(),
                getPackages()
            ]);
            setMeasurements(mList);
            setEquipment(eList);
            setMuscleGroups(mgList);
            setExercises(exList);
            setPrograms(pList);
            setContract(cDoc);
            setPackages(pkgList);
        } catch (error) {
            console.error("Veriler yüklenemedi:", error);
        } finally {
            setLoadingMeasurements(false);
            setLoadingEquipment(false);
            setLoadingMuscles(false);
            setLoadingExercises(false);
            setLoadingPrograms(false);
            setLoadingContract(false);
            setLoadingPackages(false);
        }
    };

    // ── Üyelik paketi işlemleri ────────────────────────────────

    const openNewPackage = () => {
        setEditingPackage(null);
        setNewPackage({
            name: "", billingType: "session", sessionCount: 8, durationDays: 30,
            price: 0, branch: "", freezeRightDays: 15, carryOverSessions: 0,
            cancellationHours: 12, description: "", isActive: true,
        });
        setIsPackageDialogOpen(true);
    };

    const openEditPackage = (pkg: MembershipPackage) => {
        setEditingPackage(pkg);
        setNewPackage({
            name: pkg.name,
            billingType: pkg.billingType,
            sessionCount: pkg.sessionCount,
            durationDays: pkg.durationDays,
            price: pkg.price,
            branch: pkg.branch,
            freezeRightDays: pkg.freezeRightDays,
            carryOverSessions: pkg.carryOverSessions,
            cancellationHours: pkg.cancellationHours,
            description: pkg.description,
            isActive: pkg.isActive,
        });
        setIsPackageDialogOpen(true);
    };

    const handleSavePackage = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Tipe göre alakasız alanı temizle ki rapor tarafında kirlilik olmasın
            const payload: Omit<MembershipPackage, "id"> = {
                ...newPackage,
                sessionCount: newPackage.billingType === "duration" ? undefined : newPackage.sessionCount,
                durationDays: newPackage.billingType === "session" ? undefined : newPackage.durationDays,
            };
            if (editingPackage) {
                const updated = await updatePackage(editingPackage.id, payload);
                setPackages(packages.map(p => p.id === updated.id ? updated : p));
            } else {
                const added = await addPackage(payload);
                setPackages([...packages, added]);
            }
            setIsPackageDialogOpen(false);
        } catch (error) {
            console.error("Paket kaydedilemedi:", error);
        }
    };

    const handleDeletePackage = async (id: number) => {
        if (!confirm("Bu paket silinsin mi? Paketi kullanan mevcut üyelikler etkilenmez.")) return;
        try {
            await deletePackage(id);
            setPackages(packages.filter(p => p.id !== id));
        } catch (error) {
            console.error("Paket silinemedi:", error);
        }
    };

    const handleAddMeasurement = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const added = await addMeasurement(newMeasurement);
            setMeasurements([...measurements, added].sort((a, b) => a.orderNo - b.orderNo));
            setIsAddMeasurementDialogOpen(false);
            setNewMeasurement({ name: "", orderNo: measurements.length + 1, unit: "" });
        } catch (error) {
            console.error("Ölçüm eklenemedi:", error);
        }
    };

    const handleDeleteMeasurement = async (id: number) => {
        if (confirm("Bu ölçüm tanımını silmek istediğinize emin misiniz?")) {
            try {
                await deleteMeasurement(id);
                setMeasurements(measurements.filter(m => m.id !== id));
            } catch (error) {
                console.error("Ölçüm silinemedi:", error);
            }
        }
    };

    const handleAddEquipment = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const added = await addEquipment(newEquipment);
            setEquipment([...equipment, added]);
            setIsAddEquipmentDialogOpen(false);
            setNewEquipment({ name: "", category: "", brand: "" });
        } catch (error) {
            console.error("Alet eklenemedi:", error);
        }
    };

    const handleDeleteEquipment = async (id: number) => {
        if (confirm("Bu alet tanımını silmek istediğinize emin misiniz?")) {
            try {
                await deleteEquipment(id);
                setEquipment(equipment.filter(e => e.id !== id));
            } catch (error) {
                console.error("Alet silinemedi:", error);
            }
        }
    };

    const handleAddMuscleGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const added = await addMuscleGroup(newMuscleGroup);
            setMuscleGroups([...muscleGroups, added]);
            setIsAddMuscleDialogOpen(false);
            setNewMuscleGroup({ name: "" });
        } catch (error) {
            console.error("Kas grubu eklenemedi:", error);
        }
    };

    const handleDeleteMuscleGroup = async (id: number) => {
        if (confirm("Bu kas grubunu silmek istediğinize emin misiniz?")) {
            try {
                await deleteMuscleGroup(id);
                setMuscleGroups(muscleGroups.filter(m => m.id !== id));
            } catch (error) {
                console.error("Kas grubu silinemedi:", error);
            }
        }
    };

    const handleAddExercise = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const added = await addExercise(newExercise);
            setExercises([...exercises, added]);
            setIsAddExerciseDialogOpen(false);
            setNewExercise({ name: "", muscleGroupId: undefined, equipmentId: undefined, description: "" });
        } catch (error) {
            console.error("Egzersiz eklenemedi:", error);
        }
    };

    const handleDeleteExercise = async (id: number) => {
        if (confirm("Bu egzersiz tanımını silmek istediğinize emin misiniz?")) {
            try {
                await deleteExercise(id);
                setExercises(exercises.filter(e => e.id !== id));
            } catch (error) {
                console.error("Egzersiz silinemedi:", error);
            }
        }
    };

    const handleAddProgram = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const added = await addTrainingProgram(newProgram);
            setPrograms([...programs, added]);
            setIsAddProgramDialogOpen(false);
            setNewProgram({ name: "", description: "", type: "Full Body", visibility: "instructors_only" });
        } catch (error) {
            console.error("Program eklenemedi:", error);
        }
    };

    const handleDeleteProgram = async (id: number) => {
        if (confirm("Bu program tanımını silmek istediğinize emin misiniz?")) {
            try {
                await deleteTrainingProgram(id);
                setPrograms(programs.filter(p => p.id !== id));
            } catch (error) {
                console.error("Program silinemedi:", error);
            }
        }
    };

    const handleSaveContract = async () => {
        if (!contract) return;
        setIsSavingContract(true);
        try {
            const saved = await saveContract(contract);
            setContract(saved);
        } catch (error) {
            console.error("Sözleşme kaydedilemedi:", error);
        } finally {
            setIsSavingContract(false);
        }
    };

    // Placeholder replacement logic
    const sampleMember = {
        isim: "Ahmet Yılmaz",
        tckimlik: "12345678901",
        kartno: "998877",
        mail: "ahmet@example.com",
        telefon: "0555 444 33 22",
        adres: "Atatürk Mah. 123. Sk. No:5 D:2 Çankaya/Ankara",
        firma: "Vetra Fitness Club",
        logo: "VETRA_LOGOREF",
        bugun: new Date().toLocaleDateString('tr-TR'),
        dogum: "01.01.1990",
        meslek: "Mühendis"
    };

    const renderContract = (content: string) => {
        let rendered = content;
        Object.entries(sampleMember).forEach(([key, value]) => {
            // Support spaces like {{ isim }} and case-insensitivity
            const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'gi');
            rendered = rendered.replace(regex, value?.toString() || "");
        });
        // Remove any remaining unmatched double curly brace patterns to avoid showing raw tags to users
        rendered = rendered.replace(/\{\{.*?\}\}/g, "");
        return rendered;
    };

    const handlePrintContract = () => {
        if (!contract) return;
        const renderedContent = renderContract(contract.content);
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>${contract.title}</title>
                        <style>
                            body { font-family: 'Times New Roman', serif; padding: 50px; line-height: 1.6; color: #333; }
                            h1 { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
                            .content { white-space: pre-wrap; margin-bottom: 50px; }
                            .footer { border-top: 1px solid #ccc; padding-top: 20px; font-size: 12px; display: flex; justify-content: space-between; }
                            @media print {
                                body { padding: 0; }
                                .no-print { display: none; }
                            }
                        </style>
                    </head>
                    <body>
                        <h1>${contract.title}</h1>
                        <div class="content">${renderedContent}</div>
                        <div class="footer">
                            <div>Sözleşme Tarihi: ${sampleMember.bugun}</div>
                            <div>İmza: ____________________</div>
                        </div>
                        <script>
                            window.onload = () => {
                                window.print();
                                // window.close(); // Optional: close window after print
                            };
                        </script>
                    </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    const tabs = [
        { id: "packages", title: "Üyelik Paketleri", icon: Wallet },
        { id: "measurements", title: "Ölçüm Tanımları", icon: Ruler },
        { id: "equipment", title: "Alet Tanımları", icon: Dumbbell },
        { id: "muscles", title: "Kas Grupları", icon: Accessibility },
        { id: "exercises", title: "Egzersiz Tanımları", icon: Flame },
        { id: "programs", title: "Eğitim / Çalışma Programları", icon: FileText },
        { id: "contracts", title: "Üye Sözleşmesi", icon: FileSignature }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Tanımlamalar</h1>
                <p className="text-slate-500 text-sm">
                    Sistem genelindeki temel tanımlamaları ve kategorileri buradan yönetebilirsiniz.
                </p>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-slate-100">
                {tabs.map((tab) => (
                    <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? "default" : "outline"}
                        className={cn(
                            "flex items-center gap-2 whitespace-nowrap transition-all duration-200",
                            activeTab === tab.id 
                                ? "bg-slate-900 text-white shadow-md scale-105" 
                                : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        )}
                        onClick={() => setActiveTab(tab.id as any)}
                    >
                        <tab.icon size={16} className={activeTab === tab.id ? "text-blue-400" : "text-slate-400"} />
                        {tab.title}
                    </Button>
                ))}
            </div>

            <div className="grid gap-6">
                {activeTab === "packages" && (
                    <Card className="border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between space-y-0 py-4">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
                                    <Wallet size={18} className="text-blue-500" />
                                    Üyelik Paketleri
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    Paket ders adedine, süreye ya da ikisine birden bağlanabilir. Karma pakette hangisi önce biterse üyelik kapanır.
                                </CardDescription>
                            </div>
                            <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800" onClick={openNewPackage}>
                                <Plus size={16} className="mr-2" />
                                Yeni Paket
                            </Button>
                        </CardHeader>
                        <CardContent className="p-6">
                            {loadingPackages ? (
                                <div className="text-center py-10 text-sm text-slate-400">Paketler yükleniyor...</div>
                            ) : packages.length === 0 ? (
                                <div className="text-center py-10 text-sm text-slate-400">Henüz paket tanımlanmamış.</div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                    {packages.map(pkg => (
                                        <div
                                            key={pkg.id}
                                            className={cn(
                                                "rounded-xl border p-5 transition-all",
                                                pkg.isActive
                                                    ? "border-slate-200 bg-white hover:shadow-md"
                                                    : "border-slate-100 bg-slate-50/70 opacity-70"
                                            )}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <h3 className="text-base font-bold text-slate-900 leading-snug">{pkg.name}</h3>
                                                    {pkg.branch && (
                                                        <p className="text-xs text-slate-500 mt-0.5">{pkg.branch}</p>
                                                    )}
                                                </div>
                                                <span className={cn(
                                                    "shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded",
                                                    pkg.billingType === "session" ? "bg-blue-50 text-blue-700" :
                                                    pkg.billingType === "duration" ? "bg-purple-50 text-purple-700" :
                                                    "bg-amber-50 text-amber-700"
                                                )}>
                                                    {pkg.billingType === "session" ? "Ders" :
                                                     pkg.billingType === "duration" ? "Süre" : "Karma"}
                                                </span>
                                            </div>

                                            <div className="mt-4 flex items-baseline gap-2">
                                                <span className="text-2xl font-bold text-slate-900 tabular-nums">
                                                    ₺{pkg.price.toLocaleString("tr-TR")}
                                                </span>
                                                <span className="text-xs text-slate-500">/ {describePackage(pkg)}</span>
                                            </div>

                                            {pkg.description && (
                                                <p className="mt-3 text-xs text-slate-500 leading-relaxed line-clamp-2">
                                                    {pkg.description}
                                                </p>
                                            )}

                                            <div className="mt-4 flex flex-wrap gap-1.5">
                                                {pkg.freezeRightDays > 0 && (
                                                    <span className="inline-flex items-center gap-1 rounded bg-slate-50 border border-slate-100 px-2 py-1 text-[11px] text-slate-600">
                                                        <Snowflake size={11} className="text-blue-400" />
                                                        {pkg.freezeRightDays} gün dondurma
                                                    </span>
                                                )}
                                                {pkg.carryOverSessions > 0 && (
                                                    <span className="inline-flex items-center gap-1 rounded bg-slate-50 border border-slate-100 px-2 py-1 text-[11px] text-slate-600">
                                                        <Repeat size={11} className="text-emerald-500" />
                                                        {pkg.carryOverSessions} ders devir
                                                    </span>
                                                )}
                                                {pkg.cancellationHours > 0 && (
                                                    <span className="inline-flex items-center gap-1 rounded bg-slate-50 border border-slate-100 px-2 py-1 text-[11px] text-slate-600">
                                                        <Timer size={11} className="text-amber-500" />
                                                        {pkg.cancellationHours} sa iptal
                                                    </span>
                                                )}
                                            </div>

                                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                                                <span className={cn(
                                                    "text-[11px] font-semibold",
                                                    pkg.isActive ? "text-emerald-600" : "text-slate-400"
                                                )}>
                                                    {pkg.isActive ? "Satışa açık" : "Satışa kapalı"}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEditPackage(pkg)}>
                                                        <Pencil size={14} className="text-slate-400" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-50"
                                                        onClick={() => handleDeletePackage(pkg.id)}>
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>

                        <Dialog open={isPackageDialogOpen} onOpenChange={setIsPackageDialogOpen}>
                            <DialogContent className="sm:max-w-[560px]">
                                <DialogHeader>
                                    <DialogTitle>{editingPackage ? "Paketi Düzenle" : "Yeni Üyelik Paketi"}</DialogTitle>
                                    <DialogDescription>
                                        Devir hakkı, dönem sonunda kullanılmayan derslerden kaçının bir sonraki pakete taşınacağını belirler.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSavePackage} className="grid gap-4 py-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="pkg-name">Paket Adı</Label>
                                        <Input id="pkg-name" required value={newPackage.name}
                                            onChange={e => setNewPackage({ ...newPackage, name: e.target.value })}
                                            placeholder="Örn: Reformer 8 Ders" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label>Ücretlendirme</Label>
                                            <Select value={newPackage.billingType}
                                                onValueChange={v => setNewPackage({ ...newPackage, billingType: v as PackageBillingType })}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="session">Ders adedi bazlı</SelectItem>
                                                    <SelectItem value="duration">Süre bazlı</SelectItem>
                                                    <SelectItem value="hybrid">Karma (ders + süre)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="pkg-branch">Branş</Label>
                                            <Input id="pkg-branch" value={newPackage.branch ?? ""}
                                                onChange={e => setNewPackage({ ...newPackage, branch: e.target.value })}
                                                placeholder="Opsiyonel" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        {newPackage.billingType !== "duration" && (
                                            <div className="grid gap-2">
                                                <Label htmlFor="pkg-sessions">Ders Adedi</Label>
                                                <Input id="pkg-sessions" type="number" min="1" value={newPackage.sessionCount ?? ""}
                                                    onChange={e => setNewPackage({ ...newPackage, sessionCount: Number(e.target.value) })} />
                                            </div>
                                        )}
                                        {newPackage.billingType !== "session" && (
                                            <div className="grid gap-2">
                                                <Label htmlFor="pkg-days">Süre (gün)</Label>
                                                <Input id="pkg-days" type="number" min="1" value={newPackage.durationDays ?? ""}
                                                    onChange={e => setNewPackage({ ...newPackage, durationDays: Number(e.target.value) })} />
                                            </div>
                                        )}
                                        <div className="grid gap-2">
                                            <Label htmlFor="pkg-price">Fiyat (₺)</Label>
                                            <Input id="pkg-price" type="number" required min="0" value={newPackage.price}
                                                onChange={e => setNewPackage({ ...newPackage, price: Number(e.target.value) })} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="pkg-freeze">Dondurma (gün)</Label>
                                            <Input id="pkg-freeze" type="number" min="0" value={newPackage.freezeRightDays}
                                                onChange={e => setNewPackage({ ...newPackage, freezeRightDays: Number(e.target.value) })} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="pkg-carry">Devir (ders)</Label>
                                            <Input id="pkg-carry" type="number" min="0" value={newPackage.carryOverSessions}
                                                onChange={e => setNewPackage({ ...newPackage, carryOverSessions: Number(e.target.value) })} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="pkg-cancel">İptal (saat)</Label>
                                            <Input id="pkg-cancel" type="number" min="0" value={newPackage.cancellationHours}
                                                onChange={e => setNewPackage({ ...newPackage, cancellationHours: Number(e.target.value) })} />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="pkg-desc">Açıklama</Label>
                                        <Textarea id="pkg-desc" rows={2} value={newPackage.description ?? ""}
                                            onChange={e => setNewPackage({ ...newPackage, description: e.target.value })}
                                            placeholder="Üyeye ve personele görünen kısa açıklama." />
                                    </div>

                                    <label className="flex items-center gap-2 text-sm text-slate-600">
                                        <input type="checkbox" checked={newPackage.isActive}
                                            onChange={e => setNewPackage({ ...newPackage, isActive: e.target.checked })}
                                            className="h-4 w-4 rounded border-slate-300" />
                                        Satışa açık
                                    </label>

                                    <DialogFooter className="mt-2">
                                        <Button type="button" variant="outline" onClick={() => setIsPackageDialogOpen(false)}>İptal</Button>
                                        <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800">Kaydet</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </Card>
                )}

                {activeTab === "measurements" && (
                    <Card className="border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between space-y-0 py-4">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
                                    <Settings2 className="h-5 w-5 text-blue-600" />
                                    Ölçüm Tanımlamaları
                                </CardTitle>
                                <CardDescription>
                                    Üye gelişim takiplerinde kullanılacak parametreler.
                                </CardDescription>
                            </div>
                            
                            <Dialog open={isAddMeasurementDialogOpen} onOpenChange={setIsAddMeasurementDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-2">
                                        <Plus size={16} />
                                        Yeni Ölçüm Ekle
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Yeni Ölçüm Tanımla</DialogTitle>
                                        <DialogDescription>
                                            Üye takiplerinde kullanılacak yeni bir ölçüm birimi ekleyin.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleAddMeasurement} className="space-y-4 py-4">
                                        <div className="grid gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="text-xs font-bold text-slate-500 uppercase">Ölçüm Adı</Label>
                                                <div className="relative">
                                                    <Type className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                    <Input
                                                        id="name"
                                                        placeholder="Örn: Bel Çevresi"
                                                        className="pl-9"
                                                        value={newMeasurement.name}
                                                        onChange={e => setNewMeasurement({ ...newMeasurement, name: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="unit" className="text-xs font-bold text-slate-500 uppercase">Birim</Label>
                                                    <div className="relative">
                                                        <Ruler className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                        <Input
                                                            id="unit"
                                                            placeholder="cm, kg, %"
                                                            className="pl-9"
                                                            value={newMeasurement.unit}
                                                            onChange={e => setNewMeasurement({ ...newMeasurement, unit: e.target.value })}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="orderNo" className="text-xs font-bold text-slate-500 uppercase">Sıra No</Label>
                                                    <div className="relative">
                                                        <Hash className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                        <Input
                                                            id="orderNo"
                                                            type="number"
                                                            placeholder="1"
                                                            className="pl-9"
                                                            value={newMeasurement.orderNo}
                                                            onChange={e => setNewMeasurement({ ...newMeasurement, orderNo: Number(e.target.value) })}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                                Kaydet
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50/30">
                                        <TableHead className="w-[100px] font-bold text-slate-600">Sıra No</TableHead>
                                        <TableHead className="font-bold text-slate-600">Ölçüm Adı</TableHead>
                                        <TableHead className="font-bold text-slate-600">Birim</TableHead>
                                        <TableHead className="text-right font-bold text-slate-600">İşlemler</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loadingMeasurements ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-10 text-slate-400">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
                                                    <span>Yükleniyor...</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : measurements.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-10">
                                                <div className="flex flex-col items-center gap-2 text-slate-400">
                                                    <Info size={24} />
                                                    <p className="text-sm font-medium">Henüz bir ölçüm tanımlanmamış.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        measurements.map((m) => (
                                            <TableRow key={m.id} className="hover:bg-slate-50/50 transition-colors">
                                                <TableCell className="font-medium text-slate-600">{m.orderNo}</TableCell>
                                                <TableCell className="font-bold text-slate-900">{m.name}</TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                                        {m.unit}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => handleDeleteMeasurement(m.id)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {activeTab === "equipment" && (
                    <Card className="border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between space-y-0 py-4">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
                                    <Dumbbell className="h-5 w-5 text-blue-600" />
                                    Alet Tanımlamaları
                                </CardTitle>
                                <CardDescription>
                                    Spor salonunda bulunan ekipman ve aksesuar listesi.
                                </CardDescription>
                            </div>
                            
                            <Dialog open={isAddEquipmentDialogOpen} onOpenChange={setIsAddEquipmentDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-2">
                                        <Plus size={16} />
                                        Yeni Alet Ekle
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Yeni Alet Tanımla</DialogTitle>
                                        <DialogDescription>
                                            Envanterinize yeni bir spor aleti veya ekipman ekleyin.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleAddEquipment} className="space-y-4 py-4">
                                        <div className="grid gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="eqName" className="text-xs font-bold text-slate-500 uppercase">Alet Adı</Label>
                                                <div className="relative">
                                                    <Type className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                    <Input
                                                        id="eqName"
                                                        placeholder="Örn: Bench Press"
                                                        className="pl-9"
                                                        value={newEquipment.name}
                                                        onChange={e => setNewEquipment({ ...newEquipment, name: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="category" className="text-xs font-bold text-slate-500 uppercase">Kategori / Tip</Label>
                                                <div className="relative">
                                                    <Settings2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                    <Input
                                                        id="category"
                                                        placeholder="Örn: Göğüs - Serbest Ağırlık"
                                                        className="pl-9"
                                                        value={newEquipment.category}
                                                        onChange={e => setNewEquipment({ ...newEquipment, category: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="brand" className="text-xs font-bold text-slate-500 uppercase">Marka</Label>
                                                <div className="relative">
                                                    <Info className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                    <Input
                                                        id="brand"
                                                        placeholder="Örn: Technogym"
                                                        className="pl-9"
                                                        value={newEquipment.brand}
                                                        onChange={e => setNewEquipment({ ...newEquipment, brand: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                                Kaydet
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50/30">
                                        <TableHead className="font-bold text-slate-600">Alet Adı</TableHead>
                                        <TableHead className="font-bold text-slate-600">Kategori</TableHead>
                                        <TableHead className="font-bold text-slate-600">Marka</TableHead>
                                        <TableHead className="text-right font-bold text-slate-600">İşlemler</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loadingEquipment ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-10 text-slate-400">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
                                                    <span>Yükleniyor...</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : equipment.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-10">
                                                <div className="flex flex-col items-center gap-2 text-slate-400">
                                                    <Dumbbell size={24} />
                                                    <p className="text-sm font-medium">Henüz bir alet tanımlanmamış.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        equipment.map((e) => (
                                            <TableRow key={e.id} className="hover:bg-slate-50/50 transition-colors">
                                                <TableCell className="font-bold text-slate-900">{e.name}</TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                        {e.category || "-"}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-slate-600">{e.brand || "-"}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => handleDeleteEquipment(e.id)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {activeTab === "muscles" && (
                    <Card className="border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between space-y-0 py-4">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
                                    <Activity className="h-5 w-5 text-blue-600" />
                                    Kas Grubu Tanımlamaları
                                </CardTitle>
                                <CardDescription>
                                    Egzersiz programlarında kullanılacak çalıştırılan bölge tanımları.
                                </CardDescription>
                            </div>
                            
                            <Dialog open={isAddMuscleDialogOpen} onOpenChange={setIsAddMuscleDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-2">
                                        <Plus size={16} />
                                        Yeni Kas Grubu Ekle
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Yeni Kas Grubu Tanımla</DialogTitle>
                                        <DialogDescription>
                                            Sisteme yeni bir çalıştırılabilir kas bölgesi ekleyin.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleAddMuscleGroup} className="space-y-4 py-4">
                                        <div className="grid gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="mgName" className="text-xs font-bold text-slate-500 uppercase">Kas Grubu Adı</Label>
                                                <div className="relative">
                                                    <Type className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                    <Input
                                                        id="mgName"
                                                        placeholder="Örn: Karın, Kol, Bacak"
                                                        className="pl-9"
                                                        value={newMuscleGroup.name}
                                                        onChange={e => setNewMuscleGroup({ ...newMuscleGroup, name: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                                Kaydet
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50/30">
                                        <TableHead className="font-bold text-slate-600">ID</TableHead>
                                        <TableHead className="font-bold text-slate-600">Kas Grubu Adı</TableHead>
                                        <TableHead className="text-right font-bold text-slate-600">İşlemler</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loadingMuscles ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center py-10 text-slate-400">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
                                                    <span>Yükleniyor...</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : muscleGroups.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center py-10">
                                                <div className="flex flex-col items-center gap-2 text-slate-400">
                                                    <Activity size={24} />
                                                    <p className="text-sm font-medium">Henüz bir kas grubu tanımlanmamış.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        muscleGroups.map((mg) => (
                                            <TableRow key={mg.id} className="hover:bg-slate-50/50 transition-colors">
                                                <TableCell className="text-slate-500 text-xs">#{mg.id}</TableCell>
                                                <TableCell className="font-bold text-slate-900">{mg.name}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => handleDeleteMuscleGroup(mg.id)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {activeTab === "exercises" && (
                    <Card className="border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between space-y-0 py-4">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
                                    <Flame className="h-5 w-5 text-blue-600" />
                                    Egzersiz Tanımlamaları
                                </CardTitle>
                                <CardDescription>
                                    Antrenman programlarında kullanılacak egzersiz kütüphanesi.
                                </CardDescription>
                            </div>
                            
                            <Dialog open={isAddExerciseDialogOpen} onOpenChange={setIsAddExerciseDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-2">
                                        <Plus size={16} />
                                        Yeni Egzersiz Ekle
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Yeni Egzersiz Tanımla</DialogTitle>
                                        <DialogDescription>
                                            Kütüphanenize yeni bir antrenman egzersizi ekleyin.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleAddExercise} className="space-y-4 py-4">
                                        <div className="grid gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="exName" className="text-xs font-bold text-slate-500 uppercase">Egzersiz Adı</Label>
                                                <div className="relative">
                                                    <Type className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                    <Input
                                                        id="exName"
                                                        placeholder="Örn: Incline Bench Press"
                                                        className="pl-9"
                                                        value={newExercise.name}
                                                        onChange={e => setNewExercise({ ...newExercise, name: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold text-slate-500 uppercase">Kas Grubu</Label>
                                                    <Select 
                                                        value={newExercise.muscleGroupId?.toString()} 
                                                        onValueChange={val => setNewExercise({ ...newExercise, muscleGroupId: Number(val) })}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Seçiniz" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {muscleGroups.map(mg => (
                                                                <SelectItem key={mg.id} value={mg.id.toString()}>{mg.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold text-slate-500 uppercase">Alet / Ekipman</Label>
                                                    <Select 
                                                        value={newExercise.equipmentId?.toString()} 
                                                        onValueChange={val => setNewExercise({ ...newExercise, equipmentId: Number(val) })}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Seçiniz" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="0">Yok / Serbest</SelectItem>
                                                            {equipment.map(e => (
                                                                <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="exDesc" className="text-xs font-bold text-slate-500 uppercase">Açıklama / Tanımlama</Label>
                                                <Textarea
                                                    id="exDesc"
                                                    placeholder="Egzersiz hakkında kısa bilgi..."
                                                    className="resize-none"
                                                    value={newExercise.description}
                                                    onChange={e => setNewExercise({ ...newExercise, description: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                                Kaydet
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50/30">
                                        <TableHead className="font-bold text-slate-600">Egzersiz Adı</TableHead>
                                        <TableHead className="font-bold text-slate-600">Kas Grubu</TableHead>
                                        <TableHead className="font-bold text-slate-600">Ekipman</TableHead>
                                        <TableHead className="text-right font-bold text-slate-600">İşlemler</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loadingExercises ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-10 text-slate-400">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
                                                    <span>Yükleniyor...</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : exercises.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-10">
                                                <div className="flex flex-col items-center gap-2 text-slate-400">
                                                    <Flame size={24} />
                                                    <p className="text-sm font-medium">Henüz bir egzersiz tanımlanmamış.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        exercises.map((ex) => (
                                            <TableRow key={ex.id} className="hover:bg-slate-50/50 transition-colors">
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-900">{ex.name}</span>
                                                        {ex.description && <span className="text-xs text-slate-500 line-clamp-1">{ex.description}</span>}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                                                        {muscleGroups.find(mg => mg.id === ex.muscleGroupId)?.name || "-"}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                                                        {equipment.find(e => e.id === ex.equipmentId)?.name || "Yok / Serbest"}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => handleDeleteExercise(ex.id)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {activeTab === "programs" && (
                    <Card className="border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between space-y-0 py-4">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                    Eğitim / Çalışma Programları
                                </CardTitle>
                                <CardDescription>
                                    Üyelere atanacak hazır antrenman şablonları.
                                </CardDescription>
                            </div>
                            
                            <Dialog open={isAddProgramDialogOpen} onOpenChange={setIsAddProgramDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-2">
                                        <Plus size={16} />
                                        Yeni Program Ekle
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Yeni Program Tanımla</DialogTitle>
                                        <DialogDescription>
                                            Yeni bir antrenman programı şablonu oluşturun.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleAddProgram} className="space-y-4 py-4">
                                        <div className="grid gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="progName" className="text-xs font-bold text-slate-500 uppercase">Program Adı</Label>
                                                <div className="relative">
                                                    <Type className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                    <Input
                                                        id="progName"
                                                        placeholder="Örn: 3 Günlük Başlangıç"
                                                        className="pl-9"
                                                        value={newProgram.name}
                                                        onChange={e => setNewProgram({ ...newProgram, name: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold text-slate-500 uppercase">Program Çeşidi</Label>
                                                    <Select 
                                                        value={newProgram.type} 
                                                        onValueChange={val => setNewProgram({ ...newProgram, type: val })}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Seçiniz" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Full Body">Full Body</SelectItem>
                                                            <SelectItem value="Split">Split</SelectItem>
                                                            <SelectItem value="Cardio">Kardiyo</SelectItem>
                                                            <SelectItem value="Rehabilitasyon">Rehabilitasyon</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold text-slate-500 uppercase">Görünürlük</Label>
                                                    <Select 
                                                        value={newProgram.visibility} 
                                                        onValueChange={(val: "all" | "instructors_only") => setNewProgram({ ...newProgram, visibility: val })}
                                                    >
                                                        <SelectTrigger className="w-full border-blue-100 bg-blue-50/50">
                                                            <SelectValue placeholder="Seçiniz" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="instructors_only">Sadece Eğitmen</SelectItem>
                                                            <SelectItem value="all">Herkes</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="progDesc" className="text-xs font-bold text-slate-500 uppercase">Program Açıklaması</Label>
                                                <Textarea
                                                    id="progDesc"
                                                    placeholder="Program hedefleri ve detayları..."
                                                    className="resize-none"
                                                    value={newProgram.description}
                                                    onChange={e => setNewProgram({ ...newProgram, description: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 p-2 rounded bg-amber-50 border border-amber-100 mb-2">
                                                <Info size={14} className="text-amber-600 shrink-0" />
                                                <span className="text-[10px] text-amber-700 font-medium">Bu program sadece eğitmenler tarafından atanabilecektir.</span>
                                            </div>
                                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                                Kaydet
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50/30">
                                        <TableHead className="font-bold text-slate-600">Program Adı</TableHead>
                                        <TableHead className="font-bold text-slate-600">Program Çeşidi</TableHead>
                                        <TableHead className="font-bold text-slate-600">Erişim</TableHead>
                                        <TableHead className="text-right font-bold text-slate-600">İşlemler</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loadingPrograms ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-10 text-slate-400">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
                                                    <span>Yükleniyor...</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : programs.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-10">
                                                <div className="flex flex-col items-center gap-2 text-slate-400">
                                                    <FileText size={24} />
                                                    <p className="text-sm font-medium">Henüz bir program tanımlanmamış.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        programs.map((p) => (
                                            <TableRow key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-900">{p.name}</span>
                                                        {p.description && <span className="text-xs text-slate-500 line-clamp-1">{p.description}</span>}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                        {p.type}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {p.visibility === "instructors_only" ? (
                                                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                                                            <Settings2 size={12} />
                                                            Sadece Eğitmen
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                                                            <Activity size={12} />
                                                            Genel
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => handleDeleteProgram(p.id)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {activeTab === "contracts" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-4">
                                <Button 
                                    variant="outline" 
                                    onClick={handlePrintContract}
                                    className="flex items-center gap-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                                >
                                    <Printer size={16} />
                                    Önizlemeyi Yazdır
                                </Button>
                                <div className="h-6 w-[1px] bg-slate-200 mx-2" />
                                <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
                                    <Button size="sm" variant="ghost" className="bg-white text-blue-600 shadow-sm text-xs font-bold px-4">
                                        Düzenleme Modu
                                    </Button>
                                </div>
                            </div>
                            <Button 
                                onClick={handleSaveContract} 
                                disabled={isSavingContract || !contract}
                                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-2"
                            >
                                <Save size={16} />
                                Değişiklikleri Kaydet
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="border-slate-200 shadow-sm overflow-hidden flex flex-col h-[700px]">
                                <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3">
                                    <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                        <FileSignature size={16} className="text-blue-600" />
                                        Taslak Düzenleyici
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 flex-1 overflow-hidden">
                                    {loadingContract ? (
                                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600 mb-4" />
                                            <span>Yükleniyor...</span>
                                        </div>
                                    ) : contract ? (
                                        <div className="flex flex-col h-full">
                                            <div className="p-4 border-b border-slate-100 bg-white">
                                                <Label htmlFor="cTitle" className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Sözleşme Başlığı</Label>
                                                <Input 
                                                    id="cTitle"
                                                    value={contract.title}
                                                    onChange={e => setContract({...contract, title: e.target.value})}
                                                    className="font-bold border-none focus-visible:ring-0 p-0 h-auto text-lg placeholder:text-slate-300"
                                                />
                                            </div>
                                            <div className="flex-1 overflow-hidden relative group">
                                                <Textarea 
                                                    id="cContent"
                                                    value={contract.content}
                                                    onChange={e => setContract({...contract, content: e.target.value})}
                                                    className="w-full h-full border-none focus-visible:ring-0 resize-none p-6 font-serif leading-relaxed text-slate-700 bg-white"
                                                    placeholder="Sözleşme metnini buraya yazmaya başlayın..."
                                                />
                                                <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-lg">
                                                        Kayıt etmeyi unutmayın
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}
                                </CardContent>
                            </Card>

                            <Card className="border-slate-200 shadow-sm overflow-hidden flex flex-col h-[700px] bg-slate-50/30">
                                <CardHeader className="bg-white border-b border-slate-100 py-3 flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                        <Eye size={16} className="text-blue-600" />
                                        Canlı Önizleme
                                    </CardTitle>
                                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                                        TEST ÜYESİ: AHMET YILMAZ
                                    </span>
                                </CardHeader>
                                <CardContent className="p-0 flex-1 overflow-auto">
                                    <div className="p-8 bg-white min-h-full shadow-[0_0_20px_rgba(0,0,0,0.02)] mx-4 my-6 rounded-sm border border-slate-100">
                                        {contract && (
                                            <>
                                                <h2 className="text-xl font-bold text-center mb-8 border-b-2 border-slate-900 pb-4 text-slate-900">
                                                    {contract.title || "BAŞLIKSIZ SÖZLEŞME"}
                                                </h2>
                                                <div className="font-serif leading-loose text-slate-800 whitespace-pre-wrap text-sm">
                                                    {renderContract(contract.content)}
                                                </div>
                                                <div className="mt-12 pt-8 border-t border-slate-200 flex justify-between items-end italic text-xs text-slate-500">
                                                    <div className="space-y-1">
                                                        <p>Sözleşme Tarihi: {sampleMember.bugun}</p>
                                                        <p>Baskı No: {Math.floor(Date.now()/1000000)}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="mb-8">İMZA</p>
                                                        <p className="font-bold text-slate-900">{sampleMember.isim}</p>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="border-blue-100 bg-blue-50/40">
                            <CardHeader className="py-3 px-6 border-b border-blue-100/50">
                                <CardTitle className="text-xs font-bold text-blue-800 flex items-center gap-2 uppercase tracking-wider">
                                    <Info size={14} />
                                    Otomatik Veri Parametreleri (Placeholder)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 px-6">
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        "isim", "tckimlik", "kartno", "mail", "telefon", 
                                        "adres", "firma", "logo", "bugun", "dogum", "meslek"
                                    ].map(param => (
                                        <div 
                                            key={param}
                                            className="group relative cursor-help"
                                        >
                                            <code className="text-[11px] bg-white border border-blue-200 text-blue-600 px-3 py-1.5 rounded-full font-mono font-bold flex items-center gap-2 hover:border-blue-400 transition-colors">
                                                {"{{"}{param}{"}}"}
                                            </code>
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-3 text-[11px] text-blue-700 italic">
                                    * Yukarıdaki kodları metin içerisine yapıştırdığınızda, çıktı sırasında otomatik olarak üye bilgileri ile yer değiştirir.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {(activeTab as string) !== "measurements" && (activeTab as string) !== "equipment" && (activeTab as string) !== "muscles" && (activeTab as string) !== "exercises" && (activeTab as string) !== "programs" && (activeTab as string) !== "contracts" && (
                    <Card className="border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <CardHeader>
                            <CardTitle className="text-slate-800">
                                {tabs.find(t => t.id === activeTab)?.title}
                            </CardTitle>
                            <CardDescription>
                                Bu bölüm yakında aktif edilecek.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-lg text-slate-600">
                                <Info size={18} />
                                <p className="text-sm font-medium">
                                    Burada {tabs.find(t => t.id === activeTab)?.title.toLowerCase()} listesi ve yönetim araçları yer alacak.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
