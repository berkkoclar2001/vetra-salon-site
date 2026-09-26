import { Session, Participant, RecurringSession } from "@/types";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { MockStore } from "./mockData";
import { getBusinessHours } from "./managementService";

export const getMonthlySessions = async (currentDate: Date): Promise<Session[]> => {
  await new Promise((resolve) => setTimeout(resolve, 10));

  const cacheKey = format(currentDate, "yyyy-MM");
  if (MockStore.sessionCache[cacheKey]) {
    return MockStore.sessionCache[cacheKey];
  }

  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start, end });

  const sessions: Session[] = [];
  let idCounter = 1;
  const instructors = ["Anıl Hoca", "Yener Hoca", "Merve Hoca", "Burak Hoca", "Selin Hoca"];
  
  const businessHours = await getBusinessHours();

  days.forEach((day) => {
    const dayOfWeek = day.getDay();
    const hours = businessHours[dayOfWeek];

    if (!hours || !hours.isOpen) return;

    const startHour = parseInt(hours.open.split(':')[0]);
    const endHour = parseInt(hours.close.split(':')[0]);

    for (let hour = startHour; hour < endHour; hour++) {
      const isFull = Math.random() > 0.8;
      const participantCount = isFull ? 8 : Math.floor(Math.random() * 5);

      const randomParticipants = [...MockStore.members]
        .sort(() => 0.5 - Math.random())
        .slice(0, participantCount)
        .map(m => ({
          id: m.id,
          name: m.name,
          phone: m.phone,
          status: 'active' as const
        }));

      sessions.push({
        id: idCounter++,
        date: format(day, "yyyy-MM-dd"),
        time: `${hour < 10 ? '0' + hour : hour}:00`,
        activity: ["Pilates Reformer", "Yoga", "Kick Boks", "Zumba", "Crossfit"][Math.floor(Math.random() * 5)],
        instructor: instructors[Math.floor(Math.random() * instructors.length)],
        capacity: 8,
        enrolledCount: randomParticipants.length,
        status: randomParticipants.length >= 8 ? 'full' : 'active',
        participants: randomParticipants
      });
    }
  });

  MockStore.sessionCache[cacheKey] = sessions;
  return sessions;
};

export const getDailySessions = async (date: Date): Promise<Session[]> => {
  return getMonthlySessions(date);
};

export const createSession = async (sessionData: Partial<Session>): Promise<Session> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  const newId = Math.floor(Math.random() * 10000);

  const newSession = {
    id: newId,
    date: sessionData.date || format(new Date(), "yyyy-MM-dd"),
    time: sessionData.time || "09:00",
    activity: sessionData.activity || "Yeni Ders",
    instructor: sessionData.instructor || "Atanmadı",
    capacity: sessionData.capacity || 10,
    enrolledCount: sessionData.participants?.length || 0,
    participants: sessionData.participants || [],
    status: (sessionData.participants?.length || 0) >= (sessionData.capacity || 10) ? 'full' : 'active',
    isRecurring: sessionData.isRecurring
  } as Session;

  const cacheKey = newSession.date.substring(0, 7);
  if (MockStore.sessionCache[cacheKey]) {
    MockStore.sessionCache[cacheKey].push(newSession);
  } else {
    MockStore.sessionCache[cacheKey] = [newSession];
  }

  return newSession;
};

export const deleteSession = async (sessionId: number) => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  Object.keys(MockStore.sessionCache).forEach(key => {
    MockStore.sessionCache[key] = MockStore.sessionCache[key].filter(s => s.id !== sessionId);
  });
  return { success: true };
};

export const cancelAppointment = async (sessionId: number, participantId: number) => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  Object.keys(MockStore.sessionCache).forEach(key => {
    MockStore.sessionCache[key] = MockStore.sessionCache[key].map(s => {
      if (s.id === sessionId) {
        const newParticipants = s.participants.map(p =>
          p.id === participantId ? { ...p, status: 'cancelled' as const } : p
        );
        const count = newParticipants.filter(p => p.status !== 'cancelled').length;
        return {
          ...s,
          participants: newParticipants,
          enrolledCount: count,
          status: count >= s.capacity ? 'full' : 'active'
        };
      }
      return s;
    });
  });
  return { success: true };
};

export const updateSessionCapacity = async (sessionId: number, newCapacity: number) => {
  await new Promise((resolve) => setTimeout(resolve, 10));

  Object.keys(MockStore.sessionCache).forEach(key => {
    MockStore.sessionCache[key] = MockStore.sessionCache[key].map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          capacity: newCapacity,
          status: s.enrolledCount >= newCapacity ? 'full' : 'active'
        };
      }
      return s;
    });
  });

  return { success: true };
};

export const addParticipantToSession = async (sessionId: number, participant: Participant) => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  const newParticipant = { ...participant, status: 'active' as const };

  Object.keys(MockStore.sessionCache).forEach(key => {
    MockStore.sessionCache[key] = MockStore.sessionCache[key].map(s => {
      if (s.id === sessionId) {
        const newParticipants = [...s.participants, newParticipant];
        const count = newParticipants.filter(p => p.status !== 'cancelled').length;
        return {
          ...s,
          participants: newParticipants,
          enrolledCount: count,
          status: count >= s.capacity ? 'full' : 'active'
        };
      }
      return s;
    });
  });

  return { success: true, participant: newParticipant };
};

export const getRecurringSessions = async (): Promise<RecurringSession[]> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return MockStore.recurringSessions;
};

export const addRecurringSession = async (session: Omit<RecurringSession, "id">): Promise<RecurringSession> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  const newSession = { ...session, id: Math.floor(Math.random() * 10000) };
  MockStore.recurringSessions = [...MockStore.recurringSessions, newSession];
  return newSession;
};

export const deleteRecurringSession = async (id: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  MockStore.recurringSessions = MockStore.recurringSessions.filter(s => s.id !== id);
};
