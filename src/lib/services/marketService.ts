import { Product, ProductSale, SaleLine, StockMovement } from "@/types";
import { MockStore } from "./mockData";

// ── Ürünler ────────────────────────────────────────────────────

export const getProducts = async (): Promise<Product[]> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return [...MockStore.products];
};

export const addProduct = async (product: Omit<Product, "id">): Promise<Product> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  const newProduct = { ...product, id: Math.floor(Math.random() * 10000) };
  MockStore.products = [...MockStore.products, newProduct];
  return newProduct;
};

export const updateProduct = async (id: number, updates: Partial<Product>): Promise<Product> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  MockStore.products = MockStore.products.map(p => p.id === id ? { ...p, ...updates } : p);
  return MockStore.products.find(p => p.id === id)!;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  MockStore.products = MockStore.products.filter(p => p.id !== id);
};

/** Kritik seviyeye inmiş veya tükenmiş ürünler. */
export const getCriticalStock = async (): Promise<Product[]> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return MockStore.products.filter(p => p.isActive && p.stock <= p.criticalStock);
};

// ── Stok hareketleri ───────────────────────────────────────────

export const getStockMovements = async (): Promise<StockMovement[]> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return [...MockStore.stockMovements].sort((a, b) => b.date.localeCompare(a.date));
};

export const addStockMovement = async (movement: Omit<StockMovement, "id">): Promise<StockMovement> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  const newMovement = { ...movement, id: Math.floor(Math.random() * 10000) };
  MockStore.stockMovements = [newMovement, ...MockStore.stockMovements];

  // Hareket stoğu doğrudan etkiler
  MockStore.products = MockStore.products.map(p =>
    p.id === movement.productId ? { ...p, stock: Math.max(p.stock + movement.qty, 0) } : p
  );

  return newMovement;
};

// ── Satış ──────────────────────────────────────────────────────

export const getSales = async (): Promise<ProductSale[]> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return [...MockStore.sales].sort((a, b) => b.date.localeCompare(a.date));
};

export const createSale = async (sale: Omit<ProductSale, "id" | "total">): Promise<ProductSale> => {
  await new Promise((resolve) => setTimeout(resolve, 10));

  const total = sale.lines.reduce((sum, l) => sum + l.qty * l.unitPrice, 0);
  const newSale: ProductSale = { ...sale, total, id: Math.floor(Math.random() * 10000) };

  // Satılan her kalem stoktan düşer
  MockStore.products = MockStore.products.map(p => {
    const line = sale.lines.find(l => l.productId === p.id);
    return line ? { ...p, stock: Math.max(p.stock - line.qty, 0) } : p;
  });

  MockStore.sales = [newSale, ...MockStore.sales];
  return newSale;
};

export const deleteSale = async (id: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  MockStore.sales = MockStore.sales.filter(s => s.id !== id);
};

// ── Özet ───────────────────────────────────────────────────────

export interface MarketSummary {
  todayRevenue: number;
  todayCount: number;
  monthRevenue: number;
  monthProfit: number;
  criticalCount: number;
  stockValue: number;
  topProducts: { name: string; qty: number; revenue: number }[];
}

export const getMarketSummary = async (): Promise<MarketSummary> => {
  await new Promise((resolve) => setTimeout(resolve, 10));

  const today = new Date().toISOString().slice(0, 10);
  const month = new Date().toISOString().slice(0, 7);

  const todaySales = MockStore.sales.filter(s => s.date.startsWith(today));
  const monthSales = MockStore.sales.filter(s => s.date.startsWith(month));

  const costOf = (line: SaleLine) => {
    const p = MockStore.products.find(x => x.id === line.productId);
    return (p?.cost ?? line.unitPrice * 0.6) * line.qty;
  };

  const monthRevenue = monthSales.reduce((sum, s) => sum + s.total, 0);
  const monthCost = monthSales.reduce(
    (sum, s) => sum + s.lines.reduce((ls, l) => ls + costOf(l), 0), 0
  );

  const tally: Record<string, { qty: number; revenue: number }> = {};
  monthSales.forEach(s => s.lines.forEach(l => {
    if (!tally[l.productName]) tally[l.productName] = { qty: 0, revenue: 0 };
    tally[l.productName].qty += l.qty;
    tally[l.productName].revenue += l.qty * l.unitPrice;
  }));

  return {
    todayRevenue: todaySales.reduce((sum, s) => sum + s.total, 0),
    todayCount: todaySales.length,
    monthRevenue,
    monthProfit: Math.round(monthRevenue - monthCost),
    criticalCount: MockStore.products.filter(p => p.isActive && p.stock <= p.criticalStock).length,
    stockValue: MockStore.products.reduce((sum, p) => sum + p.stock * (p.cost ?? 0), 0),
    topProducts: Object.entries(tally)
      .map(([name, d]) => ({ name, qty: d.qty, revenue: d.revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5),
  };
};
