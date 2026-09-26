import { MeasurementRecord, MemberWorkoutPlan } from "@/types";
import { MockStore } from "./mockData";

// ── Ölçüm kayıtları ────────────────────────────────────────────

export const getMeasurementRecords = async (memberId: number): Promise<MeasurementRecord[]> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return MockStore.measurementRecords
    .filter(r => r.memberId === memberId)
    .sort((a, b) => a.date.localeCompare(b.date));
};

export const addMeasurementRecord = async (record: Omit<MeasurementRecord, "id">): Promise<MeasurementRecord> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  const newRecord = { ...record, id: Math.floor(Math.random() * 10000) };
  MockStore.measurementRecords = [...MockStore.measurementRecords, newRecord];
  return newRecord;
};

export const deleteMeasurementRecord = async (id: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  MockStore.measurementRecords = MockStore.measurementRecords.filter(r => r.id !== id);
};

/**
 * İki ölçüm kaydını karşılaştırıp alan alan değişimi verir.
 * Ölçülen alanlar sabit değildir; Tanımlamalar ekranındaki
 * listeye göre değişir, o yüzden definitionId üzerinden eşleşir.
 */
export const compareRecords = (
  from: MeasurementRecord,
  to: MeasurementRecord
): { definitionId: number; from: number; to: number; delta: number }[] => {
  return to.values.map(tv => {
    const fv = from.values.find(v => v.definitionId === tv.definitionId);
    const start = fv ? fv.value : tv.value;
    return {
      definitionId: tv.definitionId,
      from: start,
      to: tv.value,
      delta: Number((tv.value - start).toFixed(1)),
    };
  });
};

// ── Antrenman planları ─────────────────────────────────────────

export const getWorkoutPlans = async (memberId: number): Promise<MemberWorkoutPlan[]> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return MockStore.workoutPlans
    .filter(p => p.memberId === memberId)
    .sort((a, b) => b.startDate.localeCompare(a.startDate));
};

export const getAllWorkoutPlans = async (): Promise<MemberWorkoutPlan[]> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return [...MockStore.workoutPlans];
};

export const addWorkoutPlan = async (plan: Omit<MemberWorkoutPlan, "id">): Promise<MemberWorkoutPlan> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  const newPlan = { ...plan, id: Math.floor(Math.random() * 10000) };
  MockStore.workoutPlans = [...MockStore.workoutPlans, newPlan];
  return newPlan;
};

export const updateWorkoutPlan = async (id: number, updates: Partial<MemberWorkoutPlan>): Promise<MemberWorkoutPlan> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  MockStore.workoutPlans = MockStore.workoutPlans.map(p => p.id === id ? { ...p, ...updates } : p);
  return MockStore.workoutPlans.find(p => p.id === id)!;
};

export const deleteWorkoutPlan = async (id: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  MockStore.workoutPlans = MockStore.workoutPlans.filter(p => p.id !== id);
};
