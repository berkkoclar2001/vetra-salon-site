import { StaffMember, Instructor } from "@/types";
import { MockStore } from "./mockData";

export const getStaffList = async (): Promise<StaffMember[]> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return [...MockStore.staff].sort((a, b) => a.id - b.id);
};

export const addStaff = async (staff: Omit<StaffMember, "id">): Promise<StaffMember> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  const newStaff = { ...staff, id: Math.floor(Math.random() * 10000) };
  MockStore.staff = [newStaff, ...MockStore.staff];
  return newStaff;
};

export const updateStaff = async (id: number, updates: Partial<StaffMember>): Promise<StaffMember> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  MockStore.staff = MockStore.staff.map(s => s.id === id ? { ...s, ...updates } : s);
  return MockStore.staff.find(s => s.id === id)!;
};

export const deleteStaff = async (id: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  MockStore.staff = MockStore.staff.filter(s => s.id !== id);
};

export const getInstructors = async (): Promise<StaffMember[]> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return MockStore.staff.filter(s => s.role === 'trainer');
};

export const addInstructor = async (instructorData: Omit<Instructor, "id">) => {
  await new Promise((resolve) => setTimeout(resolve, 10));

  if (MockStore.instructors.some(i => i.color === instructorData.color)) {
    throw new Error("Bu renk zaten başka bir personele atanmış!");
  }

  const newInstructor = { id: Math.floor(Math.random() * 10000), ...instructorData };
  MockStore.instructors = [...MockStore.instructors, newInstructor];
  return newInstructor;
};

export const updateInstructor = async (id: number, updates: Partial<Instructor>) => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  if (updates.color && MockStore.instructors.some(i => i.id !== id && i.color === updates.color)) {
    throw new Error("Bu renk zaten başka bir personele atanmış!");
  }
  MockStore.instructors = MockStore.instructors.map(i => i.id === id ? { ...i, ...updates } : i);
  return MockStore.instructors.find(i => i.id === id)!;
};

export const deleteInstructor = async (id: number) => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  MockStore.instructors = MockStore.instructors.filter(i => i.id !== id);
  return { success: true };
};
