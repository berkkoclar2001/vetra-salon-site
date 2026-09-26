import { CommissionRule, PayoutLine, CommissionType } from "@/types";
import { MockStore } from "./mockData";
import { getMonthlySessions } from "./sessionService";

export const COMMISSION_LABELS: Record<CommissionType, string> = {
  per_session: "Ders başı prim",
  revenue_share: "Ciro payı",
  fixed: "Sabit ücret",
};

export const getCommissionRules = async (): Promise<CommissionRule[]> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return [...MockStore.commissionRules];
};

export const addCommissionRule = async (rule: Omit<CommissionRule, "id">): Promise<CommissionRule> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  const newRule = { ...rule, id: Math.floor(Math.random() * 10000) };
  MockStore.commissionRules = [...MockStore.commissionRules, newRule];
  return newRule;
};

export const updateCommissionRule = async (id: number, updates: Partial<CommissionRule>): Promise<CommissionRule> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  MockStore.commissionRules = MockStore.commissionRules.map(r => r.id === id ? { ...r, ...updates } : r);
  return MockStore.commissionRules.find(r => r.id === id)!;
};

export const deleteCommissionRule = async (id: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  MockStore.commissionRules = MockStore.commissionRules.filter(r => r.id !== id);
};

export const describeRule = (rule: CommissionRule): string => {
  if (rule.type === "per_session") {
    const threshold = rule.minSessions ? ` (${rule.minSessions} ders üzeri)` : "";
    return `Ders başı ₺${rule.rate.toLocaleString("tr-TR")}${threshold}`;
  }
  if (rule.type === "revenue_share") return `Ciro payı %${rule.rate}`;
  return "Sabit ücret";
};

/**
 * Seçilen ayın hakediş dökümünü hesaplar.
 *
 * Prim yalnızca eşiği aşan ders sayısı üzerinden verilir — eşiğe kadar
 * olan dersler taban ücretin karşılığı sayılır. Ciro payı ise eğitmenin
 * o ay fiilen katılım alan derslerinden üretilen tutar üzerinden işler.
 */
export const getPayoutForMonth = async (month: Date): Promise<PayoutLine[]> => {
  const sessions = await getMonthlySessions(month);
  const rules = MockStore.commissionRules.filter(r => r.isActive);
  const staff = MockStore.staff;

  // Ortalama ders başı ciro: aktif paketlerin ders başına düşen değeri
  const sessionValues = MockStore.packages
    .filter(p => p.sessionCount && p.sessionCount > 0)
    .map(p => p.price / p.sessionCount!);
  const avgSessionValue = sessionValues.length
    ? sessionValues.reduce((a, b) => a + b, 0) / sessionValues.length
    : 500;

  return rules.map(rule => {
    const own = sessions.filter(s => s.instructor === rule.staffName);
    const sessionCount = own.length;
    const attendedCount = own.reduce(
      (sum, s) => sum + s.participants.filter(p => p.status !== "cancelled").length, 0
    );
    const generatedRevenue = Math.round(attendedCount * avgSessionValue);

    let commission = 0;
    if (rule.type === "per_session") {
      const billable = rule.minSessions ? Math.max(sessionCount - rule.minSessions, 0) : sessionCount;
      commission = billable * rule.rate;
    } else if (rule.type === "revenue_share") {
      commission = Math.round(generatedRevenue * (rule.rate / 100));
    }

    const member = staff.find(s => s.id === rule.staffId);

    return {
      staffId: rule.staffId,
      staffName: rule.staffName,
      branch: member?.branch,
      ruleLabel: describeRule(rule),
      sessionCount,
      attendedCount,
      generatedRevenue,
      baseSalary: rule.baseSalary,
      commission,
      total: rule.baseSalary + commission,
    };
  }).sort((a, b) => b.total - a.total);
};
