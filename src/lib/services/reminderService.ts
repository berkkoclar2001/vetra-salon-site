import { Reminder } from "@/types";
import { MockStore } from "./mockData";

export const getReminders = async (): Promise<Reminder[]> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return MockStore.reminders;
};

export const addReminder = async (reminder: Omit<Reminder, "id">): Promise<Reminder> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  const newReminder = { ...reminder, id: Math.floor(Math.random() * 10000) };
  MockStore.reminders = [...MockStore.reminders, newReminder];
  return newReminder;
};

export const deleteReminder = async (id: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  MockStore.reminders = MockStore.reminders.filter(r => r.id !== id);
};
