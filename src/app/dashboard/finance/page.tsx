"use client";

import { useEffect, useState } from "react";
import { Expense, Member, StaffMember } from "@/types";
import { getExpenses, addExpense, deleteExpense } from "@/lib/services/financeService";
import { getMembers } from "@/lib/services/memberService";
import { getStaffList } from "@/lib/services/staffService";
import { useAuth } from "@/context/AuthContext";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
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
    DialogFooter,
    DialogTrigger
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
    CreditCard,
    TrendingUp,
    TrendingDown,
    Wallet,
    Plus,
    Trash2,
    Shield,
    Users,
    Activity
} from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { 
    PieChart, 
    Pie, 
    Cell, 
    ResponsiveContainer, 
    Tooltip, 
    Legend 
} from "recharts";

export default function FinancePage() {
    const { user } = useAuth();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [staffList, setStaffList] = useState<StaffMember[]>([]);


    // Form States
    const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
    const [newExpense, setNewExpense] = useState<Partial<Expense>>({
        title: "",
        amount: 0,
        type: "Diğer",
        date: new Date().toISOString().split('T')[0],
        description: ""
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [expensesData, membersData, staffData] = await Promise.all([
                getExpenses(),
                getMembers(),
                getStaffList()
            ]);
            setExpenses(expensesData);
            setMembers(membersData);
            setStaffList(staffData);
        } catch (error) {
            console.error("Veri yükleme hatası:", error);
        } finally {
            // Loading false logic removed as state is unused
        }
    };

    // --- CALCULATIONS ---

    // 1. Total Revenue (Gelir) - From Members
    const totalRevenue = members.reduce((sum, member) => {
        // Sadece ödeme alınmışsa dahil et
        if (member.paymentMethod === 'Ödeme Alınmadı') return sum;
        return sum + (member.paymentAmount || 0);
    }, 0);

    // 2. Total Expenses (Gider)
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // 3. Net Profit (Kâr)
    const netProfit = totalRevenue - totalExpenses;

    // 4. Staff Performance Logic

    // First, calculate totals per 'addedBy' key from members
    const salesByAddedBy = members.reduce((acc, member) => {
        const key = member.addedBy || 'unknown';
        if (!acc[key]) {
            acc[key] = { count: 0, revenue: 0 };
        }
        acc[key].count += 1;
        if (member.paymentMethod !== 'Ödeme Alınmadı') {
            acc[key].revenue += (member.paymentAmount || 0);
        }
        return acc;
    }, {} as Record<string, { count: number, revenue: number }>);

    // Helper to map Staff Name -> addedBy key
    // In a real app, we would join on staff.id === member.addedById
    const getStaffKey = (staffName: string) => {
        if (staffName === 'Admin User') return 'admin';
        if (staffName === 'Ayşe Personel') return 'personel';
        // For others, assume lowercased first name or similar if needed, 
        // but for now we only have these explicit connections in mock data.
        return staffName.toLowerCase();
    };

    // Construct the final performance list based on ALL staff
    const performanceData = staffList.map(staff => {
        const key = getStaffKey(staff.name);
        const stats = salesByAddedBy[key] || { count: 0, revenue: 0 };

        return {
            name: staff.name,
            role: staff.role, // useful to show/filter if needed
            count: stats.count,
            revenue: stats.revenue
        };
    }).sort((a, b) => b.revenue - a.revenue);
    
    // 5. Pie Chart Data - Expense Distribution
    const expenseDistribution = expenses.reduce((acc, expense) => {
        const type = expense.type || 'Diğer';
        if (!acc[type]) acc[type] = 0;
        acc[type] += expense.amount;
        return acc;
    }, {} as Record<string, number>);

    const pieData = Object.entries(expenseDistribution).map(([name, value]) => ({
        name,
        value
    }));

    const COLORS: Record<string, string> = {
        'Kira': '#3B82F6',   // Blue
        'Fatura': '#EF4444', // Red
        'Maaş': '#10B981',   // Green
        'Yemek': '#F59E0B',  // Amber
        'Diğer': '#8B5CF6'    // Purple
    };

    const DEFAULT_COLOR = '#94A3B8'; // Slate


    // --- HANDLERS ---

    const handleAddExpense = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const added = await addExpense(newExpense as Expense);
            setExpenses([added, ...expenses]);
            setIsExpenseDialogOpen(false);
            setNewExpense({
                title: "",
                amount: 0,
                type: "Diğer",
                date: new Date().toISOString().split('T')[0],
                description: ""
            });
        } catch (error) {
            console.error("Gider ekleme hatası:", error);
        }
    };

    const handleDeleteExpense = async (id: number) => {
        if (confirm("Bu gideri silmek istediğinize emin misiniz?")) {
            await deleteExpense(id);
            setExpenses(expenses.filter(e => e.id !== id));
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
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Finans Yönetimi</h1>

            {/* 1. ÖZET KARTLARI */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Gelir */}
                <Card className="bg-green-50 border-green-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-green-700">Toplam Gelir</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-900">₺{totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-green-600 mt-1">Üye ödemelerinden</p>
                    </CardContent>
                </Card>

                {/* Gider */}
                <Card className="bg-red-50 border-red-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-red-700">Toplam Gider</CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-900">₺{totalExpenses.toLocaleString()}</div>
                        <p className="text-xs text-red-600 mt-1">Fatura, kira, maaş vb.</p>
                    </CardContent>
                </Card>

                {/* Kâr */}
                <Card className="bg-blue-50 border-blue-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-blue-700">Net Kâr</CardTitle>
                        <Wallet className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-blue-900' : 'text-red-900'}`}>
                            ₺{netProfit.toLocaleString()}
                        </div>
                        <p className="text-xs text-blue-600 mt-1">Gelir - Gider</p>
                    </CardContent>
                </Card>
            </div>

            {/* 2. GİDER DAĞILIMI (PASTA GRAFİK) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1 shadow-sm border-slate-200">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <TrendingDown className="w-5 h-5 text-red-500" />
                            Gider Dağılımı
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            {pieData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            dataKey="value"
                                            label={({ name, percent }: any) => percent ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                                            labelLine={false}
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={COLORS[entry.name] || DEFAULT_COLOR} 
                                                    strokeWidth={0}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            formatter={(value: any) => `₺${Number(value).toLocaleString()}`}
                                            contentStyle={{ 
                                                borderRadius: '8px', 
                                                border: 'none', 
                                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                                            }}
                                        />
                                        <Legend verticalAlign="bottom" height={36}/>
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                                    Veri bulunamadı
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="lg:col-span-2 grid grid-cols-1 gap-8">
                    {/* 2. GİDER YÖNETİMİ */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-slate-500" />
                                Gider Listesi
                            </h2>
                            <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <Plus className="w-4 h-4 mr-2" /> Gider Ekle
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Yeni Gider Ekle</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleAddExpense} className="space-y-4 py-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Başlık</Label>
                                                <Input
                                                    placeholder="Örn: Elektrik Faturası"
                                                    value={newExpense.title}
                                                    onChange={e => setNewExpense({ ...newExpense, title: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Tutar (TL)</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    value={newExpense.amount || ''}
                                                    onChange={e => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Kategori</Label>
                                                <Select
                                                    value={newExpense.type}
                                                    onValueChange={(val: 'Kira' | 'Fatura' | 'Maaş' | 'Yemek' | 'Diğer') => setNewExpense({ ...newExpense, type: val })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Kira">Kira</SelectItem>
                                                        <SelectItem value="Fatura">Fatura</SelectItem>
                                                        <SelectItem value="Maaş">Maaş</SelectItem>
                                                        <SelectItem value="Yemek">Yemek</SelectItem>
                                                        <SelectItem value="Diğer">Diğer</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Tarih</Label>
                                                <Input
                                                    type="date"
                                                    value={newExpense.date}
                                                    onChange={e => setNewExpense({ ...newExpense, date: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Açıklama</Label>
                                            <Input
                                                placeholder="Detaylar..."
                                                value={newExpense.description}
                                                onChange={e => setNewExpense({ ...newExpense, description: e.target.value })}
                                            />
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit">Kaydet</Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Gider</TableHead>
                                        <TableHead>Tarih</TableHead>
                                        <TableHead>Tutar</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {expenses.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-slate-500 py-8">
                                                Henüz gider kaydı yok.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        expenses.map(expense => (
                                            <TableRow key={expense.id}>
                                                <TableCell>
                                                    <div className="font-medium text-slate-900">{expense.title}</div>
                                                    <div className="text-xs text-slate-500">{expense.type}</div>
                                                </TableCell>
                                                <TableCell className="text-sm text-slate-600">
                                                    {format(new Date(expense.date), 'd MMM yyyy', { locale: tr })}
                                                </TableCell>
                                                <TableCell className="font-semibold text-red-600">
                                                    -₺{expense.amount.toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-400 hover:text-red-600"
                                                        onClick={() => handleDeleteExpense(expense.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* 3. PERSONEL PERFORMANS */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-slate-500" />
                            Personel Performansı
                        </h2>

                        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Personel</TableHead>
                                        <TableHead className="text-center">Kazandırdığı Üye</TableHead>
                                        <TableHead className="text-right">Kazandırdığı Ciro</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {performanceData.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center text-slate-500 py-8">
                                                Veri bulunamadı.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        performanceData.map((data, index) => (
                                            <TableRow key={data.name}>
                                                <TableCell className="font-medium flex items-center gap-2">
                                                    {/* Sıra numarası badge */}
                                                    <span className={`
                                                        flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-2
                                                        ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                                            index === 1 ? 'bg-slate-200 text-slate-700' :
                                                                index === 2 ? 'bg-orange-100 text-orange-800' : 'bg-slate-50 text-slate-500'}
                                                    `}>
                                                        {index + 1}
                                                    </span>
                                                    <Users className="w-4 h-4 text-slate-400" />
                                                    {data.name}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                        {data.count} Üye
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right font-bold text-green-600">
                                                    +₺{data.revenue.toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
