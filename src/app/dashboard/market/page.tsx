"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { Product, ProductSale, SaleLine, StockMovement, Member } from "@/types";
import {
    getProducts, addProduct, updateProduct, deleteProduct,
    getSales, createSale,
    getStockMovements, addStockMovement,
    getMarketSummary, MarketSummary,
} from "@/lib/services/marketService";
import { getMembers } from "@/lib/services/memberService";
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
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import {
    ShoppingBasket, Plus, Minus, Trash2, PackageSearch, Boxes,
    TriangleAlert, Wallet, Receipt, ArrowDownUp, Loader2, Search,
    Banknote, CreditCard, UserRound, ShieldAlert, TrendingUp,
} from "lucide-react";

type Tab = "sale" | "products" | "stock";

const EMPTY_PRODUCT: Omit<Product, "id"> = {
    name: "", category: "Atıştırmalık", price: 0, cost: 0,
    stock: 0, criticalStock: 5, barcode: "", isActive: true,
};

const CATEGORIES = ["Atıştırmalık", "İçecek", "Supplement", "Ekipman", "Diğer"];

export default function MarketPage() {
    const { user, isLoading: authLoading } = useAuth();
    const isAdmin = user?.role === "admin";

    const [tab, setTab] = useState<Tab>("sale");
    const [loading, setLoading] = useState(true);

    const [products, setProducts] = useState<Product[]>([]);
    const [sales, setSales] = useState<ProductSale[]>([]);
    const [movements, setMovements] = useState<StockMovement[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [summary, setSummary] = useState<MarketSummary | null>(null);

    // Satış sepeti
    const [cart, setCart] = useState<SaleLine[]>([]);
    const [search, setSearch] = useState("");
    const [payment, setPayment] = useState<ProductSale["paymentMethod"]>("Nakit");
    const [cartMemberId, setCartMemberId] = useState<string>("");
    const [saving, setSaving] = useState(false);

    // Ürün formu
    const [productOpen, setProductOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [productForm, setProductForm] = useState<Omit<Product, "id">>(EMPTY_PRODUCT);

    // Stok giriş formu
    const [stockOpen, setStockOpen] = useState(false);
    const [stockForm, setStockForm] = useState({ productId: "", qty: "", reason: "", type: "in" as StockMovement["type"] });

    useEffect(() => { loadAll(); }, []);

    const loadAll = async () => {
        setLoading(true);
        try {
            const [p, s, m, mem, sum] = await Promise.all([
                getProducts(), getSales(), getStockMovements(), getMembers(), getMarketSummary(),
            ]);
            setProducts(p); setSales(s); setMovements(m); setMembers(mem); setSummary(sum);
        } catch (e) {
            console.error("Market verisi yüklenemedi", e);
        } finally {
            setLoading(false);
        }
    };

    // ── Sepet işlemleri ────────────────────────────────────────

    const addToCart = (product: Product) => {
        if (product.stock <= 0) return;
        setCart(prev => {
            const found = prev.find(l => l.productId === product.id);
            if (found) {
                if (found.qty >= product.stock) return prev;
                return prev.map(l => l.productId === product.id ? { ...l, qty: l.qty + 1 } : l);
            }
            return [...prev, { productId: product.id, productName: product.name, qty: 1, unitPrice: product.price }];
        });
    };

    const changeQty = (productId: number, delta: number) => {
        setCart(prev => prev.flatMap(l => {
            if (l.productId !== productId) return [l];
            const stock = products.find(p => p.id === productId)?.stock ?? 0;
            const next = Math.min(l.qty + delta, stock);
            return next <= 0 ? [] : [{ ...l, qty: next }];
        }));
    };

    const cartTotal = useMemo(
        () => cart.reduce((sum, l) => sum + l.qty * l.unitPrice, 0),
        [cart]
    );

    const handleCompleteSale = async () => {
        if (cart.length === 0) return;
        if (payment === "Üye Hesabı" && !cartMemberId) {
            alert("Üye hesabına yazmak için üye seçmelisiniz.");
            return;
        }
        setSaving(true);
        try {
            const member = members.find(m => m.id === Number(cartMemberId));
            await createSale({
                date: new Date().toISOString(),
                lines: cart,
                paymentMethod: payment,
                memberId: member?.id,
                memberName: member?.name,
                soldBy: user?.username ?? "Bilinmiyor",
            });
            setCart([]); setCartMemberId(""); setPayment("Nakit");
            await loadAll();
        } catch (e) {
            console.error("Satış tamamlanamadı", e);
        } finally {
            setSaving(false);
        }
    };

    // ── Ürün işlemleri ─────────────────────────────────────────

    const openNewProduct = () => {
        setEditingProduct(null);
        setProductForm(EMPTY_PRODUCT);
        setProductOpen(true);
    };

    const openEditProduct = (p: Product) => {
        setEditingProduct(p);
        setProductForm({
            name: p.name,
            category: p.category,
            price: p.price,
            cost: p.cost,
            stock: p.stock,
            criticalStock: p.criticalStock,
            barcode: p.barcode,
            isActive: p.isActive,
        });
        setProductOpen(true);
    };

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingProduct) await updateProduct(editingProduct.id, productForm);
            else await addProduct(productForm);
            setProductOpen(false);
            await loadAll();
        } catch (err) {
            console.error("Ürün kaydedilemedi", err);
        }
    };

    const handleDeleteProduct = async (id: number) => {
        if (!confirm("Bu ürün silinsin mi? Geçmiş satış kayıtları etkilenmez.")) return;
        await deleteProduct(id);
        await loadAll();
    };

    const handleAddStock = async (e: React.FormEvent) => {
        e.preventDefault();
        const product = products.find(p => p.id === Number(stockForm.productId));
        if (!product) return;
        const raw = Number(stockForm.qty);
        if (!raw) return;
        await addStockMovement({
            productId: product.id,
            productName: product.name,
            type: stockForm.type,
            qty: stockForm.type === "in" ? Math.abs(raw) : -Math.abs(raw),
            date: format(new Date(), "yyyy-MM-dd"),
            reason: stockForm.reason || "Belirtilmedi",
            createdBy: user?.username ?? "Bilinmiyor",
        });
        setStockOpen(false);
        setStockForm({ productId: "", qty: "", reason: "", type: "in" });
        await loadAll();
    };

    // ── Türetilmiş ─────────────────────────────────────────────

    const visibleProducts = useMemo(() => products.filter(p =>
        p.isActive &&
        (p.name.toLowerCase().includes(search.toLowerCase()) || p.barcode?.includes(search))
    ), [products, search]);

    const criticalProducts = useMemo(
        () => products.filter(p => p.isActive && p.stock <= p.criticalStock),
        [products]
    );

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
                <p className="text-sm text-slate-500">Salon marketi yalnızca yöneticiler tarafından görüntülenebilir.</p>
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

    const tabs: { id: Tab; title: string; icon: typeof ShoppingBasket }[] = [
        { id: "sale", title: "Satış Ekranı", icon: ShoppingBasket },
        { id: "products", title: "Ürünler", icon: Boxes },
        { id: "stock", title: "Stok Hareketleri", icon: ArrowDownUp },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Salon Marketi</h1>
                <p className="text-slate-500 text-sm">
                    Büfe ve ürün satışı, stok takibi ve kritik seviye uyarıları tek ekranda.
                </p>
            </div>

            {/* Özet kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-slate-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Bugünkü Satış</CardTitle>
                        <Receipt className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 tabular-nums">
                            ₺{summary?.todayRevenue.toLocaleString("tr-TR")}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{summary?.todayCount} fiş kesildi</p>
                    </CardContent>
                </Card>

                <Card className="border-slate-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Bu Ayki Ciro</CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 tabular-nums">
                            ₺{summary?.monthRevenue.toLocaleString("tr-TR")}
                        </div>
                        <p className="text-xs text-emerald-600 mt-1 font-medium">
                            ₺{summary?.monthProfit.toLocaleString("tr-TR")} brüt kâr
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-slate-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Stok Değeri</CardTitle>
                        <Wallet className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 tabular-nums">
                            ₺{summary?.stockValue.toLocaleString("tr-TR")}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Maliyet üzerinden</p>
                    </CardContent>
                </Card>

                <Card className={cn(
                    "border-slate-100 shadow-sm",
                    (summary?.criticalCount ?? 0) > 0 && "bg-orange-50/60 border-orange-200"
                )}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Kritik Stok</CardTitle>
                        <TriangleAlert className={cn(
                            "h-4 w-4",
                            (summary?.criticalCount ?? 0) > 0 ? "text-orange-500" : "text-slate-300"
                        )} />
                    </CardHeader>
                    <CardContent>
                        <div className={cn(
                            "text-2xl font-bold tabular-nums",
                            (summary?.criticalCount ?? 0) > 0 ? "text-orange-600" : "text-slate-900"
                        )}>
                            {summary?.criticalCount}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">ürün sipariş bekliyor</p>
                    </CardContent>
                </Card>
            </div>

            {/* Kritik stok şeridi */}
            {criticalProducts.length > 0 && (
                <div className="rounded-xl border border-orange-200 bg-orange-50/60 p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <TriangleAlert className="h-4 w-4 text-orange-600" />
                        <h3 className="text-sm font-bold text-orange-900">Sipariş verilmesi gerekenler</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {criticalProducts.map(p => (
                            <span key={p.id} className="inline-flex items-center gap-2 rounded-lg border border-orange-200 bg-white px-3 py-1.5 text-xs">
                                <span className="font-semibold text-slate-800">{p.name}</span>
                                <span className={cn(
                                    "tabular-nums font-bold",
                                    p.stock === 0 ? "text-red-600" : "text-orange-600"
                                )}>
                                    {p.stock === 0 ? "tükendi" : `${p.stock} adet`}
                                </span>
                                <span className="text-slate-400">/ kritik {p.criticalStock}</span>
                            </span>
                        ))}
                    </div>
                </div>
            )}

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
                    </Button>
                ))}
            </div>

            {/* ── SATIŞ EKRANI ── */}
            {tab === "sale" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Ürün adı veya barkod ile ara..."
                                className="pl-9"
                            />
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {visibleProducts.map(p => {
                                const out = p.stock <= 0;
                                const low = p.stock <= p.criticalStock;
                                return (
                                    <button
                                        key={p.id}
                                        type="button"
                                        disabled={out}
                                        onClick={() => addToCart(p)}
                                        className={cn(
                                            "text-left rounded-xl border p-4 transition-all",
                                            out
                                                ? "border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed"
                                                : "border-slate-200 bg-white hover:border-blue-400 hover:shadow-md active:scale-[0.98]"
                                        )}
                                    >
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{p.category}</div>
                                        <div className="mt-1.5 text-sm font-semibold text-slate-900 leading-snug line-clamp-2">{p.name}</div>
                                        <div className="mt-3 flex items-end justify-between">
                                            <span className="text-lg font-bold text-slate-900 tabular-nums">₺{p.price}</span>
                                            <span className={cn(
                                                "text-[11px] font-semibold tabular-nums",
                                                out ? "text-red-600" : low ? "text-orange-600" : "text-slate-400"
                                            )}>
                                                {out ? "Tükendi" : `${p.stock} adet`}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                            {visibleProducts.length === 0 && (
                                <div className="col-span-full text-center py-12 text-sm text-slate-400">
                                    Aramanla eşleşen ürün yok.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sepet */}
                    <Card className="border-slate-200 shadow-sm h-fit lg:sticky lg:top-6">
                        <CardHeader className="border-b border-slate-100 pb-3">
                            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                                <ShoppingBasket className="h-4 w-4 text-slate-400" />
                                Sepet
                                {cart.length > 0 && (
                                    <span className="ml-auto text-xs font-semibold text-slate-500 tabular-nums">
                                        {cart.reduce((s, l) => s + l.qty, 0)} kalem
                                    </span>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            {cart.length === 0 ? (
                                <p className="text-sm text-slate-400 text-center py-8">
                                    Soldaki ürünlere tıklayarak sepete ekleyin.
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {cart.map(line => (
                                        <div key={line.productId} className="flex items-center gap-2 rounded-lg bg-slate-50 p-2">
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-slate-900 truncate">{line.productName}</div>
                                                <div className="text-xs text-slate-500 tabular-nums">₺{line.unitPrice} × {line.qty}</div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => changeQty(line.productId, -1)}>
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="w-6 text-center text-sm font-bold tabular-nums">{line.qty}</span>
                                                <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => changeQty(line.productId, 1)}>
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <span className="w-16 text-right text-sm font-bold text-slate-900 tabular-nums">
                                                ₺{(line.qty * line.unitPrice).toLocaleString("tr-TR")}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="space-y-2 pt-2 border-t border-slate-100">
                                <Label className="text-xs text-slate-500">Ödeme Yöntemi</Label>
                                <div className="grid grid-cols-3 gap-1.5">
                                    {([
                                        { v: "Nakit" as const, icon: Banknote },
                                        { v: "Kredi Kartı" as const, icon: CreditCard },
                                        { v: "Üye Hesabı" as const, icon: UserRound },
                                    ]).map(opt => (
                                        <button
                                            key={opt.v}
                                            type="button"
                                            onClick={() => setPayment(opt.v)}
                                            className={cn(
                                                "flex flex-col items-center gap-1 rounded-lg border px-2 py-2.5 text-[11px] font-medium transition-all",
                                                payment === opt.v
                                                    ? "border-slate-900 bg-slate-900 text-white"
                                                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                            )}
                                        >
                                            <opt.icon className="h-3.5 w-3.5" />
                                            {opt.v}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {payment === "Üye Hesabı" && (
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-slate-500">Üye</Label>
                                    <Select value={cartMemberId} onValueChange={setCartMemberId}>
                                        <SelectTrigger><SelectValue placeholder="Üye seçin" /></SelectTrigger>
                                        <SelectContent>
                                            {members.map(m => (
                                                <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-[11px] text-slate-400">
                                        Tutar üyenin carisine yazılır, tahsilat sonra yapılır.
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                                <span className="text-sm font-medium text-slate-600">Toplam</span>
                                <span className="text-2xl font-bold text-slate-900 tabular-nums">
                                    ₺{cartTotal.toLocaleString("tr-TR")}
                                </span>
                            </div>

                            <Button
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                                disabled={cart.length === 0 || saving}
                                onClick={handleCompleteSale}
                            >
                                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Receipt className="h-4 w-4 mr-2" />}
                                Satışı Tamamla
                            </Button>
                            {cart.length > 0 && (
                                <Button variant="ghost" className="w-full text-xs text-slate-500" onClick={() => setCart([])}>
                                    Sepeti boşalt
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Son satışlar */}
                    <Card className="lg:col-span-3 border-slate-100 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-bold text-slate-800">Son Satışlar</CardTitle>
                        </CardHeader>
                        <CardContent className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tarih</TableHead>
                                        <TableHead>Kalemler</TableHead>
                                        <TableHead>Ödeme</TableHead>
                                        <TableHead>Üye</TableHead>
                                        <TableHead>Satan</TableHead>
                                        <TableHead className="text-right">Tutar</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sales.slice(0, 10).map(s => (
                                        <TableRow key={s.id}>
                                            <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                                                {format(new Date(s.date), "d MMM HH:mm", { locale: tr })}
                                            </TableCell>
                                            <TableCell className="text-sm text-slate-700">
                                                {s.lines.map(l => `${l.productName} ×${l.qty}`).join(", ")}
                                            </TableCell>
                                            <TableCell>
                                                <span className={cn(
                                                    "text-[10px] font-bold uppercase px-2 py-0.5 rounded",
                                                    s.paymentMethod === "Nakit" ? "bg-emerald-50 text-emerald-700" :
                                                    s.paymentMethod === "Kredi Kartı" ? "bg-blue-50 text-blue-700" :
                                                    "bg-amber-50 text-amber-700"
                                                )}>
                                                    {s.paymentMethod}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-sm text-slate-600">{s.memberName ?? "—"}</TableCell>
                                            <TableCell className="text-xs text-slate-500">{s.soldBy}</TableCell>
                                            <TableCell className="text-right font-bold text-slate-900 tabular-nums">
                                                ₺{s.total.toLocaleString("tr-TR")}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ── ÜRÜNLER ── */}
            {tab === "products" && (
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-slate-100 py-4">
                        <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                            <PackageSearch className="h-4 w-4 text-slate-400" />
                            Ürün Kataloğu ({products.length})
                        </CardTitle>
                        <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800" onClick={openNewProduct}>
                            <Plus className="h-4 w-4 mr-2" /> Yeni Ürün
                        </Button>
                    </CardHeader>
                    <CardContent className="pt-4 overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ürün</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead className="text-right">Alış</TableHead>
                                    <TableHead className="text-right">Satış</TableHead>
                                    <TableHead className="text-right">Kâr</TableHead>
                                    <TableHead className="text-right">Stok</TableHead>
                                    <TableHead className="text-right">İşlem</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map(p => {
                                    const margin = p.cost ? Math.round(((p.price - p.cost) / p.price) * 100) : null;
                                    return (
                                        <TableRow key={p.id} className={cn(!p.isActive && "opacity-50")}>
                                            <TableCell>
                                                <div className="font-medium text-slate-900">{p.name}</div>
                                                {p.barcode && <div className="text-[11px] text-slate-400 font-mono">{p.barcode}</div>}
                                            </TableCell>
                                            <TableCell className="text-sm text-slate-600">{p.category}</TableCell>
                                            <TableCell className="text-right text-sm text-slate-500 tabular-nums">
                                                {p.cost ? `₺${p.cost}` : "—"}
                                            </TableCell>
                                            <TableCell className="text-right text-sm font-semibold text-slate-900 tabular-nums">₺{p.price}</TableCell>
                                            <TableCell className="text-right text-sm tabular-nums">
                                                {margin !== null ? (
                                                    <span className={margin >= 40 ? "text-emerald-600 font-semibold" : "text-slate-500"}>%{margin}</span>
                                                ) : "—"}
                                            </TableCell>
                                            <TableCell className="text-right tabular-nums">
                                                <span className={cn(
                                                    "font-bold",
                                                    p.stock === 0 ? "text-red-600" :
                                                    p.stock <= p.criticalStock ? "text-orange-600" : "text-slate-900"
                                                )}>
                                                    {p.stock}
                                                </span>
                                                <span className="text-[11px] text-slate-400 ml-1">/ {p.criticalStock}</span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => openEditProduct(p)}>
                                                        Düzenle
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteProduct(p.id)}>
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {/* ── STOK HAREKETLERİ ── */}
            {tab === "stock" && (
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-slate-100 py-4">
                        <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                            <ArrowDownUp className="h-4 w-4 text-slate-400" />
                            Stok Hareketleri
                        </CardTitle>
                        <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800" onClick={() => setStockOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" /> Stok Girişi
                        </Button>
                    </CardHeader>
                    <CardContent className="pt-4 overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tarih</TableHead>
                                    <TableHead>Ürün</TableHead>
                                    <TableHead>Tip</TableHead>
                                    <TableHead className="text-right">Miktar</TableHead>
                                    <TableHead>Açıklama</TableHead>
                                    <TableHead>Kaydeden</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {movements.map(m => (
                                    <TableRow key={m.id}>
                                        <TableCell className="text-xs text-slate-500 whitespace-nowrap">{m.date}</TableCell>
                                        <TableCell className="font-medium text-slate-900">{m.productName}</TableCell>
                                        <TableCell>
                                            <span className={cn(
                                                "text-[10px] font-bold uppercase px-2 py-0.5 rounded",
                                                m.type === "in" ? "bg-emerald-50 text-emerald-700" :
                                                m.type === "out" ? "bg-red-50 text-red-700" :
                                                "bg-amber-50 text-amber-700"
                                            )}>
                                                {m.type === "in" ? "Giriş" : m.type === "out" ? "Çıkış" : "Düzeltme"}
                                            </span>
                                        </TableCell>
                                        <TableCell className={cn(
                                            "text-right font-bold tabular-nums",
                                            m.qty > 0 ? "text-emerald-600" : "text-red-600"
                                        )}>
                                            {m.qty > 0 ? "+" : ""}{m.qty}
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-600">{m.reason}</TableCell>
                                        <TableCell className="text-xs text-slate-500">{m.createdBy}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {/* Ürün formu */}
            <Dialog open={productOpen} onOpenChange={setProductOpen}>
                <DialogContent className="sm:max-w-[520px]">
                    <DialogHeader>
                        <DialogTitle>{editingProduct ? "Ürünü Düzenle" : "Yeni Ürün"}</DialogTitle>
                        <DialogDescription>
                            Kritik stok seviyesi, ürün bu sayıya indiğinde panelde uyarı çıkmasını sağlar.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveProduct} className="grid gap-4 py-2">
                        <div className="grid gap-2">
                            <Label htmlFor="p-name">Ürün Adı</Label>
                            <Input id="p-name" required value={productForm.name}
                                onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                                placeholder="Örn: Protein Bar — Fındık" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Kategori</Label>
                                <Select value={productForm.category} onValueChange={v => setProductForm({ ...productForm, category: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="p-barcode">Barkod</Label>
                                <Input id="p-barcode" value={productForm.barcode ?? ""}
                                    onChange={e => setProductForm({ ...productForm, barcode: e.target.value })}
                                    placeholder="Opsiyonel" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="p-cost">Alış Fiyatı (₺)</Label>
                                <Input id="p-cost" type="number" value={productForm.cost ?? 0}
                                    onChange={e => setProductForm({ ...productForm, cost: Number(e.target.value) })} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="p-price">Satış Fiyatı (₺)</Label>
                                <Input id="p-price" type="number" required value={productForm.price}
                                    onChange={e => setProductForm({ ...productForm, price: Number(e.target.value) })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="p-stock">Mevcut Stok</Label>
                                <Input id="p-stock" type="number" value={productForm.stock}
                                    onChange={e => setProductForm({ ...productForm, stock: Number(e.target.value) })} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="p-crit">Kritik Seviye</Label>
                                <Input id="p-crit" type="number" value={productForm.criticalStock}
                                    onChange={e => setProductForm({ ...productForm, criticalStock: Number(e.target.value) })} />
                            </div>
                        </div>
                        <label className="flex items-center gap-2 text-sm text-slate-600">
                            <input type="checkbox" checked={productForm.isActive}
                                onChange={e => setProductForm({ ...productForm, isActive: e.target.checked })}
                                className="h-4 w-4 rounded border-slate-300" />
                            Satışa açık
                        </label>
                        <DialogFooter className="mt-2">
                            <Button type="button" variant="outline" onClick={() => setProductOpen(false)}>İptal</Button>
                            <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800">Kaydet</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Stok girişi */}
            <Dialog open={stockOpen} onOpenChange={setStockOpen}>
                <DialogContent className="sm:max-w-[460px]">
                    <DialogHeader>
                        <DialogTitle>Stok Hareketi</DialogTitle>
                        <DialogDescription>
                            Girilen miktar ürünün mevcut stoğuna doğrudan işlenir.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddStock} className="grid gap-4 py-2">
                        <div className="grid gap-2">
                            <Label>Ürün</Label>
                            <Select value={stockForm.productId} onValueChange={v => setStockForm({ ...stockForm, productId: v })}>
                                <SelectTrigger><SelectValue placeholder="Ürün seçin" /></SelectTrigger>
                                <SelectContent>
                                    {products.map(p => (
                                        <SelectItem key={p.id} value={String(p.id)}>{p.name} — {p.stock} adet</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Hareket Tipi</Label>
                                <Select value={stockForm.type} onValueChange={v => setStockForm({ ...stockForm, type: v as StockMovement["type"] })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="in">Giriş</SelectItem>
                                        <SelectItem value="out">Çıkış</SelectItem>
                                        <SelectItem value="correction">Sayım düzeltmesi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="s-qty">Miktar</Label>
                                <Input id="s-qty" type="number" required min="1" value={stockForm.qty}
                                    onChange={e => setStockForm({ ...stockForm, qty: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="s-reason">Açıklama</Label>
                            <Input id="s-reason" value={stockForm.reason}
                                onChange={e => setStockForm({ ...stockForm, reason: e.target.value })}
                                placeholder="Örn: Tedarikçi girişi — Eylül siparişi" />
                        </div>
                        <DialogFooter className="mt-2">
                            <Button type="button" variant="outline" onClick={() => setStockOpen(false)}>İptal</Button>
                            <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800">Kaydet</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
