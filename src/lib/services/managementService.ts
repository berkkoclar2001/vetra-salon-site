import { BusinessHours } from "@/types";
import { MockStore } from "./mockData";

export const getBusinessHours = async (): Promise<BusinessHours> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return MockStore.businessHours;
};

export const updateBusinessHours = async (hours: BusinessHours): Promise<BusinessHours> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  MockStore.businessHours = hours;
  return MockStore.businessHours;
};

export const getSessionDuration = async (): Promise<number> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return MockStore.sessionDuration;
};

export const updateSessionDuration = async (duration: number): Promise<number> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  MockStore.sessionDuration = duration;
  return MockStore.sessionDuration;
};
