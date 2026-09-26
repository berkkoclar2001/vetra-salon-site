import { MeasurementDefinition, EquipmentDefinition, MuscleGroup, ExerciseDefinition, TrainingProgramDefinition } from "@/types";
import { MockStore } from "./mockData";

export const getMeasurements = async (): Promise<MeasurementDefinition[]> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return [...MockStore.measurements].sort((a, b) => a.orderNo - b.orderNo);
};

export const addMeasurement = async (measurement: Omit<MeasurementDefinition, "id">): Promise<MeasurementDefinition> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  const newMeasurement = { ...measurement, id: Math.floor(Math.random() * 10000) };
  MockStore.measurements = [...MockStore.measurements, newMeasurement];
  return newMeasurement;
};

export const deleteMeasurement = async (id: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  MockStore.measurements = MockStore.measurements.filter(m => m.id !== id);
};

export const getEquipment = async (): Promise<EquipmentDefinition[]> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return [...MockStore.equipment];
};

export const addEquipment = async (equipment: Omit<EquipmentDefinition, "id">): Promise<EquipmentDefinition> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  const newEquipment = { ...equipment, id: Math.floor(Math.random() * 10000) };
  MockStore.equipment = [...MockStore.equipment, newEquipment];
  return newEquipment;
};

export const deleteEquipment = async (id: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  MockStore.equipment = MockStore.equipment.filter(e => e.id !== id);
};

export const getMuscleGroups = async (): Promise<MuscleGroup[]> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return [...MockStore.muscleGroups];
};

export const addMuscleGroup = async (muscleGroup: Omit<MuscleGroup, "id">): Promise<MuscleGroup> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  const newGroup = { ...muscleGroup, id: Math.floor(Math.random() * 10000) };
  MockStore.muscleGroups = [...MockStore.muscleGroups, newGroup];
  return newGroup;
};

export const deleteMuscleGroup = async (id: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  MockStore.muscleGroups = MockStore.muscleGroups.filter(m => m.id !== id);
};

export const getExercises = async (): Promise<ExerciseDefinition[]> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return [...MockStore.exercises];
};

export const addExercise = async (exercise: Omit<ExerciseDefinition, "id">): Promise<ExerciseDefinition> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  const newExercise = { ...exercise, id: Math.floor(Math.random() * 10000) };
  MockStore.exercises = [...MockStore.exercises, newExercise];
  return newExercise;
};

export const deleteExercise = async (id: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  MockStore.exercises = MockStore.exercises.filter(e => e.id !== id);
};

export const getTrainingPrograms = async (): Promise<TrainingProgramDefinition[]> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return [...MockStore.trainingPrograms];
};

export const addTrainingProgram = async (program: Omit<TrainingProgramDefinition, "id">): Promise<TrainingProgramDefinition> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  const newProgram = { ...program, id: Math.floor(Math.random() * 10000) };
  MockStore.trainingPrograms = [...MockStore.trainingPrograms, newProgram];
  return newProgram;
};

export const deleteTrainingProgram = async (id: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  MockStore.trainingPrograms = MockStore.trainingPrograms.filter(p => p.id !== id);
};
