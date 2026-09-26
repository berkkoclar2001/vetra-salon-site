"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getInstructors, addInstructor, deleteInstructor } from "@/lib/services/staffService";

import { Instructor } from "@/types";

export default function SettingsPage() {
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [loading, setLoading] = useState(true);
    const [newInstructorName, setNewInstructorName] = useState("");
    const [adding, setAdding] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        loadInstructors();
    }, []);

    const loadInstructors = async () => {
        setLoading(true);
        try {
            const data = await getInstructors();
            setInstructors(data);
        } catch (error) {
            console.error("Eğitmenler yüklenemedi", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddInstructor = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newInstructorName.trim()) return;

        setAdding(true);
        try {
            const newInstructor = await addInstructor({ 
                name: newInstructorName,
                phone: "",
                email: "",
                branch: "",
                color: "#" + Math.floor(Math.random()*16777215).toString(16),
                startDate: new Date().toISOString().split('T')[0]
            } as any);
            setInstructors([...instructors, newInstructor]);
            setNewInstructorName("");
        } catch (error) {
            console.error(error);
            alert("Eğitmen eklenemedi.");
        } finally {
            setAdding(false);
        }
    };

    const handleDeleteInstructor = async (id: number) => {
        if (!confirm("Bu eğitmeni silmek istediğinize emin misiniz?")) return;

        setDeletingId(id);
        try {
            await deleteInstructor(id);
            setInstructors(instructors.filter(i => i.id !== id));
        } catch (error) {
            console.error(error);
            alert("Silme işlemi başarısız.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-900">Ayarlar</h1>

            <div className="grid gap-6">
                {/* EĞİTMEN YÖNETİMİ KARTI */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-600" />
                            Eğitmen Yönetimi
                        </CardTitle>
                        <CardDescription>
                            Sistemdeki eğitmenleri buradan ekleyip çıkarabilirsiniz. Bu liste Randevu sayfasında güncel olarak görünür.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        {/* EKLEME FORMU */}
                        <form onSubmit={handleAddInstructor} className="flex gap-4 items-end">
                            <div className="flex-1 space-y-2">
                                <label className="text-sm font-medium text-slate-700">Yeni Eğitmen Adı</label>
                                <Input
                                    placeholder="Örn: Ahmet Hoca"
                                    value={newInstructorName}
                                    onChange={(e) => setNewInstructorName(e.target.value)}
                                />
                            </div>
                            <Button type="submit" disabled={adding || !newInstructorName.trim()}>
                                {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                                Ekle
                            </Button>
                        </form>

                        <div className="border-t border-slate-100 my-4" />

                        {/* LİSTE */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-slate-900 mb-3">Mevcut Eğitmenler ({instructors.length})</h3>

                            {loading ? (
                                <div className="flex justify-center py-4">
                                    <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
                                </div>
                            ) : instructors.length === 0 ? (
                                <p className="text-sm text-slate-400 italic">Hiç eğitmen eklenmemiş.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {instructors.map(instr => (
                                        <div key={instr.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg group hover:border-blue-200 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                    {instr.name.charAt(0)}
                                                </div>
                                                <span className="font-medium text-slate-700">{instr.name}</span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => handleDeleteInstructor(instr.id)}
                                                disabled={deletingId === instr.id}
                                            >
                                                {deletingId === instr.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
