import { MembershipPackage, MemberSubscription } from "@/types";
import { MockStore } from "./mockData";
import { differenceInCalendarDays, parseISO } from "date-fns";

export const getPackages = async (): Promise<MembershipPackage[]> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return [...MockStore.packages];
};

export const addPackage = async (pkg: Omit<MembershipPackage, "id">): Promise<MembershipPackage> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  const newPackage = { ...pkg, id: Math.floor(Math.random() * 10000) };
  MockStore.packages = [...MockStore.packages, newPackage];
  return newPackage;
};

export const updatePackage = async (id: number, updates: Partial<MembershipPackage>): Promise<MembershipPackage> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  MockStore.packages = MockStore.packages.map(p => p.id === id ? { ...p, ...updates } : p);
  return MockStore.packages.find(p => p.id === id)!;
};

export const deletePackage = async (id: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  MockStore.packages = MockStore.packages.filter(p => p.id !== id);
};

export const getSubscriptions = async (): Promise<MemberSubscription[]> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return [...MockStore.subscriptions];
};

export const getMemberSubscription = async (memberId: number): Promise<MemberSubscription | null> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  const list = MockStore.subscriptions.filter(s => s.memberId === memberId);
  return list.find(s => s.status === "active") || list[0] || null;
};

export const addSubscription = async (sub: Omit<MemberSubscription, "id">): Promise<MemberSubscription> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  const newSub = { ...sub, id: Math.floor(Math.random() * 10000) };
  MockStore.subscriptions = [newSub, ...MockStore.subscriptions];
  return newSub;
};

export const updateSubscription = async (id: number, updates: Partial<MemberSubscription>): Promise<MemberSubscription> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  MockStore.subscriptions = MockStore.subscriptions.map(s => s.id === id ? { ...s, ...updates } : s);
  return MockStore.subscriptions.find(s => s.id === id)!;
};

export const deleteSubscription = async (id: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  MockStore.subscriptions = MockStore.subscriptions.filter(s => s.id !== id);
};

/**
 * Bir paketin ne kadarının tükendiğini yüzde olarak verir.
 * Karma paketlerde ders ve süre ayrı ayrı hesaplanır; hangisi
 * daha çok tükenmişse paketin gerçek doluluğu odur.
 */
export const getConsumption = (sub: MemberSubscription): {
  percent: number;
  remainingSessions: number | null;
  remainingDays: number | null;
  limiter: "session" | "duration" | null;
} => {
  let sessionPercent: number | null = null;
  let remainingSessions: number | null = null;

  if (sub.totalSessions && sub.totalSessions > 0) {
    remainingSessions = Math.max(sub.totalSessions - sub.usedSessions, 0);
    sessionPercent = Math.min((sub.usedSessions / sub.totalSessions) * 100, 100);
  }

  let durationPercent: number | null = null;
  let remainingDays: number | null = null;

  if (sub.endDate) {
    const total = differenceInCalendarDays(parseISO(sub.endDate), parseISO(sub.startDate));
    const passed = differenceInCalendarDays(new Date(), parseISO(sub.startDate));
    remainingDays = Math.max(differenceInCalendarDays(parseISO(sub.endDate), new Date()), 0);
    if (total > 0) durationPercent = Math.min(Math.max((passed / total) * 100, 0), 100);
  }

  const candidates: { p: number; k: "session" | "duration" }[] = [];
  if (sessionPercent !== null) candidates.push({ p: sessionPercent, k: "session" });
  if (durationPercent !== null) candidates.push({ p: durationPercent, k: "duration" });

  if (candidates.length === 0) {
    return { percent: 0, remainingSessions, remainingDays, limiter: null };
  }

  const worst = candidates.reduce((a, b) => (b.p > a.p ? b : a));
  return { percent: Math.round(worst.p), remainingSessions, remainingDays, limiter: worst.k };
};

export const describePackage = (pkg: MembershipPackage): string => {
  if (pkg.billingType === "session") return `${pkg.sessionCount} ders`;
  if (pkg.billingType === "duration") return `${pkg.durationDays} gün`;
  return `${pkg.durationDays} gün + ${pkg.sessionCount} ders`;
};
