import { Member, MemberNote } from "@/types";
import { MockStore } from "./mockData";

export const getMembers = async (): Promise<Member[]> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return MockStore.members;
};

export const addMember = async (member: Omit<Member, "id">): Promise<Member> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  const newMember = { ...member, id: Math.floor(Math.random() * 10000) };
  MockStore.members = [newMember, ...MockStore.members];
  return newMember;
};

export const updateMember = async (id: number, updates: Partial<Member>): Promise<Member> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  MockStore.members = MockStore.members.map(m => m.id === id ? { ...m, ...updates } : m);
  return MockStore.members.find(m => m.id === id)!;
};

export const deleteMember = async (id: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  MockStore.members = MockStore.members.filter(m => m.id !== id);
};

export const getMemberById = async (id: number): Promise<Member | null> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return MockStore.members.find(m => m.id === id) || null;
};

export const sendSmsNotification = async (member: Member, password?: string) => {
  // Mock SMS logic
  console.log("📨 SMS Gönderiliyor...", member.phone);
};

export const sendBirthdaySms = async (member: Member, message: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
};

export const getMemberNotes = async (): Promise<MemberNote[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...MockStore.memberNotes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const addMemberNote = async (note: Omit<MemberNote, "id" | "date">): Promise<MemberNote> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const newNote: MemberNote = {
    ...note,
    id: Math.floor(Math.random() * 10000),
    date: new Date().toISOString()
  };
  MockStore.memberNotes = [newNote, ...MockStore.memberNotes];
  return newNote;
};

export const updateMemberNote = async (id: number, updates: Partial<MemberNote>): Promise<MemberNote> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  MockStore.memberNotes = MockStore.memberNotes.map(n => n.id === id ? { ...n, ...updates } : n);
  return MockStore.memberNotes.find(n => n.id === id)!;
};

export const deleteMemberNote = async (id: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  MockStore.memberNotes = MockStore.memberNotes.filter(n => n.id !== id);
};
