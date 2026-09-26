import { ContractDefinition } from "@/types";
import { MockStore } from "./mockData";

export const getContract = async (): Promise<ContractDefinition> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return { ...MockStore.contract };
};

export const saveContract = async (contract: ContractDefinition): Promise<ContractDefinition> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  MockStore.contract = { ...contract, lastUpdated: new Date().toISOString() };
  return { ...MockStore.contract };
};
