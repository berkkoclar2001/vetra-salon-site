import { Expense } from "@/types";
import { MockStore } from "./mockData";

export const getExpenses = async (): Promise<Expense[]> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return MockStore.expenses;
};

export const addExpense = async (expense: Omit<Expense, "id">): Promise<Expense> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  const newExpense = { ...expense, id: Math.floor(Math.random() * 10000) };
  MockStore.expenses = [newExpense, ...MockStore.expenses];
  return newExpense;
};

export const deleteExpense = async (id: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  MockStore.expenses = MockStore.expenses.filter(e => e.id !== id);
};
