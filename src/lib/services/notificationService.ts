import { NotificationTemplate, NotificationLog, NotificationTrigger, Member } from "@/types";
import { MockStore } from "./mockData";
import { differenceInCalendarDays, parseISO, format } from "date-fns";

export const TRIGGER_LABELS: Record<NotificationTrigger, string> = {
  package_ending: "Paket hakkı azaldı",
  membership_expiring: "Üyelik süresi doluyor",
  birthday: "Doğum günü",
  session_reminder: "Ders hatırlatması",
  inactive_member: "Uzun süredir gelmeyen üye",
  manual: "Elle gönderim",
};

export const TRIGGER_HINTS: Record<NotificationTrigger, string> = {
  package_ending: "Kalan ders hakkı 3'ün altına indiğinde tetiklenir.",
  membership_expiring: "Üyelik bitişine belirtilen gün kaldığında tetiklenir.",
  birthday: "Üyenin doğum gününde sabah 09:00'da gönderilir.",
  session_reminder: "Rezervasyonlu dersten belirtilen gün önce gönderilir.",
  inactive_member: "Üye belirtilen gün boyunca derse gelmediğinde tetiklenir.",
  manual: "Otomatik çalışmaz; panelden seçilen üyelere elle gönderilir.",
};

/** Şablon metninde kullanılabilecek değişkenler. */
export const TEMPLATE_VARIABLES = [
  { key: "{{ad}}", desc: "Üyenin adı soyadı" },
  { key: "{{salon}}", desc: "Salon adı" },
  { key: "{{paket}}", desc: "Aktif paket adı" },
  { key: "{{kalanDers}}", desc: "Kalan ders hakkı" },
  { key: "{{kalanGun}}", desc: "Üyelik bitişine kalan gün" },
  { key: "{{ders}}", desc: "Ders adı" },
  { key: "{{saat}}", desc: "Ders saati" },
  { key: "{{iptalSaati}}", desc: "Son iptal saati" },
  { key: "{{gecenGun}}", desc: "Son gelişinden bu yana geçen gün" },
];

// ── Şablonlar ──────────────────────────────────────────────────

export const getTemplates = async (): Promise<NotificationTemplate[]> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return [...MockStore.notificationTemplates];
};

export const addTemplate = async (template: Omit<NotificationTemplate, "id">): Promise<NotificationTemplate> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  const newTemplate = { ...template, id: Math.floor(Math.random() * 10000) };
  MockStore.notificationTemplates = [...MockStore.notificationTemplates, newTemplate];
  return newTemplate;
};

export const updateTemplate = async (id: number, updates: Partial<NotificationTemplate>): Promise<NotificationTemplate> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  MockStore.notificationTemplates = MockStore.notificationTemplates.map(t => t.id === id ? { ...t, ...updates } : t);
  return MockStore.notificationTemplates.find(t => t.id === id)!;
};

export const deleteTemplate = async (id: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  MockStore.notificationTemplates = MockStore.notificationTemplates.filter(t => t.id !== id);
};

// ── Gönderim geçmişi ───────────────────────────────────────────

export const getLogs = async (): Promise<NotificationLog[]> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return [...MockStore.notificationLogs].sort((a, b) => b.sentAt.localeCompare(a.sentAt));
};

export const sendToMembers = async (
  template: NotificationTemplate,
  members: Member[]
): Promise<NotificationLog[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const created = members.map((m, i) => ({
    id: Math.floor(Math.random() * 100000) + i,
    templateName: template.name,
    memberName: m.name,
    memberPhone: m.phone,
    channel: template.channel,
    sentAt: new Date().toISOString(),
    status: "sent" as const,
    preview: renderTemplate(template.body, m).slice(0, 120),
  }));

  MockStore.notificationLogs = [...created, ...MockStore.notificationLogs];
  return created;
};

/** Şablondaki {{degisken}} yerlerini üyenin gerçek verisiyle doldurur. */
export const renderTemplate = (body: string, member: Member): string => {
  const sub = MockStore.subscriptions.find(s => s.memberId === member.id && s.status === "active");
  const remainingDays = sub?.endDate
    ? Math.max(differenceInCalendarDays(parseISO(sub.endDate), new Date()), 0)
    : 0;

  const map: Record<string, string> = {
    "{{ad}}": member.name,
    "{{salon}}": "Vetra Stüdyo",
    "{{paket}}": sub?.packageName ?? member.membershipType,
    "{{kalanDers}}": String(member.remainingSessions),
    "{{kalanGun}}": String(remainingDays),
    "{{ders}}": member.branch ?? "dersiniz",
    "{{saat}}": "18:00",
    "{{iptalSaati}}": "12:00",
    "{{gecenGun}}": "21",
  };

  return Object.entries(map).reduce(
    (text, [k, v]) => text.split(k).join(v),
    body
  );
};

/**
 * Tetikleyici kurallarını bugünün verisine uygulayıp
 * "şu an gönderilecek olanlar" listesini çıkarır.
 */
export interface PendingNotification {
  template: NotificationTemplate;
  member: Member;
  reason: string;
}

export const getPendingNotifications = async (): Promise<PendingNotification[]> => {
  await new Promise((resolve) => setTimeout(resolve, 10));

  const active = MockStore.notificationTemplates.filter(t => t.isActive && t.trigger !== "manual");
  const pending: PendingNotification[] = [];
  const today = new Date();

  active.forEach(template => {
    MockStore.members.forEach(member => {
      if (member.status === "passive") return;

      if (template.trigger === "package_ending" && member.remainingSessions <= 3) {
        pending.push({ template, member, reason: `${member.remainingSessions} ders kaldı` });
      }

      if (template.trigger === "membership_expiring") {
        const sub = MockStore.subscriptions.find(s => s.memberId === member.id && s.status === "active");
        if (sub?.endDate) {
          const left = differenceInCalendarDays(parseISO(sub.endDate), today);
          if (left >= 0 && left <= template.offsetDays) {
            pending.push({ template, member, reason: `${left} gün kaldı` });
          }
        }
      }

      if (template.trigger === "birthday" && member.birthDate) {
        if (member.birthDate.slice(5) === format(today, "MM-dd")) {
          pending.push({ template, member, reason: "Bugün doğum günü" });
        }
      }
    });
  });

  return pending;
};
