import {
  BusinessHours, Member, MemberNote, StaffMember, Expense, RecurringSession,
  Instructor, Reminder, MeasurementDefinition, EquipmentDefinition, MuscleGroup,
  ExerciseDefinition, TrainingProgramDefinition, ContractDefinition, Session,
  MembershipPackage, MemberSubscription, MeasurementRecord, MemberWorkoutPlan,
  Product, ProductSale, StockMovement, CommissionRule,
  NotificationTemplate, NotificationLog,
} from "@/types";
import { format, addDays } from "date-fns";

// Demo verisi her zaman "bugüne yakın" görünsün diye tarihler
// sabit yazılmaz, bugünden gün kaydırılarak üretilir.
const fromToday = (offsetDays: number) => format(addDays(new Date(), offsetDays), "yyyy-MM-dd");

// İçinde bulunulan ayda, bugünü geçmeyen bir gün üretir.
// Böylece "Bu Ayki Ciro" ayın kaçı olursa olsun dolu görünür.
const thisMonth = (day: number) => {
  const now = new Date();
  const safeDay = Math.min(day, now.getDate());
  return format(new Date(now.getFullYear(), now.getMonth(), safeDay), "yyyy-MM-dd");
};

export const MockStore = {
  businessHours: {
    1: { open: "08:00", close: "22:00", isOpen: true },
    2: { open: "08:00", close: "22:00", isOpen: true },
    3: { open: "08:00", close: "22:00", isOpen: true },
    4: { open: "08:00", close: "22:00", isOpen: true },
    5: { open: "08:00", close: "22:00", isOpen: true },
    6: { open: "09:00", close: "20:00", isOpen: true },
    0: { open: "10:00", close: "18:00", isOpen: false },
  } as BusinessHours,
  
  sessionDuration: 50,

  members: [
    { id: 1, name: "Ali Yılmaz", email: "ali@example.com", phone: "0555 111 22 33", status: "active", membershipType: "Gold", remainingSessions: 12, joinDate: "2026-01-15", paymentAmount: 5000, paymentMethod: "Kredi Kartı", lastPaymentDate: thisMonth(1), addedBy: "admin", gender: "Erkek", birthDate: "1990-02-06", address: "İstanbul, Kadıköy", emergencyContact: "Veli Yılmaz (0555 999 88 77)", profession: "Mühendis", qrCode: "QR_ALI_123", nfcId: "NFC_ALI_456", branch: "Fitness", level: "intermediate" },
    { id: 2, name: "Ayşe Demir", email: "ayse@example.com", phone: "0532 222 33 44", status: "active", membershipType: "Standart", remainingSessions: 5, joinDate: "2026-02-01", paymentAmount: 3000, paymentMethod: "Nakit", lastPaymentDate: thisMonth(2), addedBy: "personel", gender: "Kadın", birthDate: "1995-08-20", address: "İstanbul, Beşiktaş", emergencyContact: "Fatma Demir (0532 111 22 33)", profession: "Doktor", qrCode: "QR_AYSE_789", branch: "Pilates Reformer", level: "beginner" },
    { id: 3, name: "Mehmet Kaya", email: "mehmet@example.com", phone: "0544 333 44 55", status: "frozen", membershipType: "VIP", remainingSessions: 0, joinDate: "2025-12-10", paymentAmount: 8500, paymentMethod: "Havale/EFT", lastPaymentDate: fromToday(-70), addedBy: "personel", gender: "Erkek", birthDate: "1988-03-15", address: "İstanbul, Üsküdar", emergencyContact: "Zeynep Kaya (0544 111 22 33)", profession: "Avukat", qrCode: "QR_MEHMET_321", nfcId: "NFC_MEHMET_321", branch: "Kick Boks", level: "advanced" },
    { id: 4, name: "Zeynep Çelik", email: "zeynep@example.com", phone: "0505 444 55 66", status: "active", membershipType: "Gold", remainingSessions: 8, joinDate: "2026-01-20", paymentAmount: 5000, paymentMethod: "Kredi Kartı", lastPaymentDate: thisMonth(5), gender: "Kadın", birthDate: "1992-11-12", address: "İstanbul, Maltepe", emergencyContact: "Can Çelik (0505 555 44 33)", profession: "Mimar", qrCode: "QR_ZEYNEP_004", nfcId: "NFC_ZEYNEP_004", branch: "Yoga", level: "intermediate" },
    { id: 5, name: "Canan Şahin", email: "canan@example.com", phone: "0536 555 66 77", status: "passive", membershipType: "Standart", remainingSessions: 2, joinDate: "2026-02-05", paymentAmount: 3000, paymentMethod: "Nakit", lastPaymentDate: fromToday(-40), addedBy: "personel", gender: "Kadın", birthDate: "1990-05-25", address: "İstanbul, Kartal", emergencyContact: "Ahmet Şahin (0536 222 11 00)", profession: "Öğretmen", qrCode: "QR_CANAN_005", nfcId: "NFC_CANAN_005", branch: "Zumba", level: "beginner" },
    { id: 6, name: "Murat Özkan", email: "murat@example.com", phone: "0533 111 22 99", status: "active", membershipType: "VIP", remainingSessions: 20, joinDate: "2026-01-10", paymentAmount: 8500, paymentMethod: "Havale/EFT", lastPaymentDate: thisMonth(8), addedBy: "admin", gender: "Erkek", birthDate: "1985-07-30", address: "İstanbul, Ataşehir", emergencyContact: "Selin Özkan (0533 999 00 11)", profession: "Mimar", qrCode: "QR_MURAT_006", nfcId: "NFC_MURAT_006", branch: "Fitness", level: "advanced" },
    { id: 7, name: "Elif Koç", email: "elif@example.com", phone: "0542 333 44 11", status: "frozen", membershipType: "Standart", remainingSessions: 4, joinDate: "2025-11-15", paymentAmount: 3000, paymentMethod: "Kredi Kartı", lastPaymentDate: fromToday(-95), addedBy: "personel", gender: "Kadın", birthDate: "1998-09-09", address: "İstanbul, Pendik", emergencyContact: "Ozan Koç (0542 888 77 66)", profession: "Hemşire", qrCode: "QR_ELIF_007", nfcId: "NFC_ELIF_007", branch: "Pilates Reformer", level: "intermediate" },
    { id: 8, name: "Burak Yılmaz", email: "burak@example.com", phone: "0535 555 66 22", status: "active", membershipType: "Gold", remainingSessions: 15, joinDate: "2026-02-01", paymentAmount: 5000, paymentMethod: "Nakit", lastPaymentDate: thisMonth(3), addedBy: "admin", gender: "Erkek", birthDate: "1993-02-14", address: "İstanbul, Şişli", emergencyContact: "Cem Yılmaz (0535 777 66 55)", profession: "Yazılımcı", qrCode: "QR_BURAK_008", nfcId: "NFC_BURAK_008", branch: "Kick Boks", level: "beginner" },
    { id: 9, name: "Selin Arslan", email: "selin@example.com", phone: "0530 222 11 88", status: "active", membershipType: "Standart", remainingSessions: 6, joinDate: "2026-01-25", paymentAmount: 3000, paymentMethod: "Kredi Kartı", lastPaymentDate: thisMonth(12), addedBy: "personel", gender: "Kadın", birthDate: "1995-12-05", address: "İstanbul, Beykoz", emergencyContact: "Ali Arslan (0530 333 22 11)", profession: "Grafiker", qrCode: "QR_SELIN_009", nfcId: "NFC_SELIN_009", branch: "Yoga", level: "intermediate" },
    { id: 10, name: "Onur Demir", email: "onur@example.com", phone: "0543 444 99 00", status: "passive", membershipType: "VIP", remainingSessions: 0, joinDate: "2025-10-20", paymentAmount: 8500, paymentMethod: "Havale/EFT", lastPaymentDate: fromToday(-140), addedBy: "admin", gender: "Erkek", birthDate: "1990-04-18", address: "İstanbul, Ümraniye", emergencyContact: "Buse Demir (0543 111 00 99)", profession: "Bankacı", qrCode: "QR_ONUR_010", nfcId: "NFC_ONUR_010", branch: "Fitness", level: "advanced" },
  ] as Member[],

  instructors: [
    { id: 1, name: "Anıl Hoca", tc: "12345678901", phone: "5551112233", email: "anil@vetra.com", branch: "Pilates Reformer", color: "#3B82F6", startDate: "2025-01-01", avatar: "/anil.jpeg" },
    { id: 2, name: "Yener Hoca", tc: "23456789012", phone: "5552223344", email: "yener@vetra.com", branch: "Yoga", color: "#10B981", startDate: "2025-02-15" },
    { id: 3, name: "Merve Hoca", tc: "34567890123", phone: "5553334455", email: "merve@vetra.com", branch: "Pilates Mat", color: "#F59E0B", startDate: "2025-03-01" },
    { id: 4, name: "Burak Hoca", tc: "45678901234", phone: "5554445566", email: "burak@vetra.com", branch: "Fitness", color: "#EF4444", startDate: "2025-01-20" },
    { id: 5, name: "Selin Hoca", tc: "56789012345", phone: "5555556677", email: "selin@vetra.com", branch: "Zumba", color: "#8B5CF6", startDate: "2025-04-10" }
  ] as Instructor[],

  staff: [
    { id: 1, name: "Admin User", email: "admin@vetra.com", phone: "0555 000 00 00", role: "admin", status: "active", joinDate: "2025-01-01", startDate: "2025-01-01", branchLevels: {} },
    { id: 3, name: "Ayşe Personel", email: "ayse@vetra.com", phone: "0555 222 22 22", role: "staff", status: "active", joinDate: "2025-03-01", startDate: "2025-03-01", branchLevels: {} },
    { id: 101, name: "Anıl Hoca", tc: "12345678901", phone: "5551112233", email: "anil@vetra.com", role: 'trainer', status: 'active', joinDate: "2025-01-01", branch: "Pilates Reformer", color: "#3B82F6", startDate: "2025-01-01", avatar: "/anil.jpeg", branchLevels: { "Pilates Reformer": ["beginner", "intermediate"] }, totalMembers: 26, totalRevenue: 53382 },
    { id: 102, name: "Yener Hoca", tc: "23456789012", phone: "5552223344", email: "yener@vetra.com", role: 'trainer', status: 'active', joinDate: "2025-02-15", branch: "Yoga", color: "#10B981", startDate: "2025-02-15", branchLevels: { "Yoga": ["beginner"] }, totalMembers: 30, totalRevenue: 44343 },
    { id: 103, name: "Merve Hoca", tc: "34567890123", phone: "5553334455", email: "merve@vetra.com", role: 'trainer', status: 'active', joinDate: "2025-03-01", branch: "Pilates Mat", color: "#F59E0B", startDate: "2025-03-01", branchLevels: { "Pilates Mat": ["beginner", "intermediate"] }, totalMembers: 20, totalRevenue: 28855 },
    { id: 104, name: "Burak Hoca", tc: "45678901234", phone: "5554445566", email: "burak@vetra.com", role: 'trainer', status: 'active', joinDate: "2025-01-20", branch: "Fitness", color: "#EF4444", startDate: "2025-01-20", branchLevels: { "Fitness": ["beginner", "intermediate", "advanced"] }, totalMembers: 38, totalRevenue: 17191 },
    { id: 105, name: "Selin Hoca", tc: "56789012345", phone: "5555556677", email: "selin@vetra.com", role: 'trainer', status: 'active', joinDate: "2025-04-10", branch: "Zumba", color: "#8B5CF6", startDate: "2025-04-10", branchLevels: { "Zumba": ["beginner"] }, totalMembers: 16, totalRevenue: 59007 }
  ] as StaffMember[],

  expenses: [
    { id: 1, title: "Ocak Kirası", amount: 15000, type: "Kira", date: "2026-01-05", description: "Dükkan kirası" },
    { id: 2, title: "Elektrik Faturası", amount: 3200, type: "Fatura", date: "2026-02-10", description: "Ocak ayı elektrik" },
    { id: 3, title: "Personel Yemek", amount: 4500, type: "Yemek", date: "2026-02-01", description: "Sodexo yüklemesi" },
    { id: 4, title: "Anıl Hoca Maaş", amount: 25000, type: "Maaş", date: "2026-02-01" },
  ] as Expense[],

  memberNotes: [
    { id: 1, memberId: 1, memberName: "Ali Yılmaz", note: "Ödemesini geciktirdi, hatırlatma yapıldı.", date: "2024-02-01T10:00:00", type: "warning", createdBy: "Admin" },
    { id: 2, memberId: 2, memberName: "Ayşe Demir", note: "Bel ağrısı şikayeti var, program güncellendi.", date: "2024-02-03T14:30:00", type: "info", createdBy: "Eğitmen" },
    { id: 3, memberId: 3, memberName: "Mehmet Kaya", note: "Gold üyeliğe geçiş yaptı, tebrik edildi.", date: "2024-02-04T09:15:00", type: "success", createdBy: "Admin" },
  ] as MemberNote[],

  recurringSessions: [
    { id: 1, dayOfWeek: 1, time: "09:00", activity: "Pilates Reformer", instructor: "Anıl Hoca", capacity: 8 },
    { id: 2, dayOfWeek: 1, time: "10:00", activity: "Yoga", instructor: "Merve Hoca", capacity: 10 },
    { id: 3, dayOfWeek: 2, time: "11:00", activity: "Kick Boks", instructor: "Burak Hoca", capacity: 12 },
    { id: 4, dayOfWeek: 3, time: "09:00", activity: "Pilates Reformer", instructor: "Anıl Hoca", capacity: 8 },
  ] as RecurringSession[],

  reminders: [
    { id: 1, date: format(new Date(), "yyyy-MM-dd"), text: "Salon temizliği kontrol edilecek", type: "info", createdBy: "Ege", color: "#3B82F6" },
    { id: 2, date: format(addDays(new Date(), 2), "yyyy-MM-dd"), text: "Yeni ekipmanlar gelecek", type: "important", createdBy: "Ceren", color: "#EF4444" },
  ] as Reminder[],

  measurements: [
    { id: 1, name: "Kilo", orderNo: 1, unit: "kg" },
    { id: 2, name: "Boy", orderNo: 2, unit: "cm" },
    { id: 3, name: "Yağ Oranı", orderNo: 3, unit: "%" },
    { id: 4, name: "Bel Çevresi", orderNo: 4, unit: "cm" },
    { id: 5, name: "Kas Oranı", orderNo: 5, unit: "%" },
  ] as MeasurementDefinition[],

  equipment: [
    { id: 1, name: "Bench Press", category: "Göğüs - Serbest Ağırlık", brand: "Technogym" },
    { id: 2, name: "Leg Press", category: "Bacak - Makine", brand: "Matrix" },
    { id: 3, name: "Cable Crossover", category: "Çok Fonksiyonlu", brand: "Lifefitness" },
    { id: 4, name: "Dumbbell Set", category: "Serbest Ağırlık", brand: "-" },
  ] as EquipmentDefinition[],

  muscleGroups: [
    { id: 1, name: "Göğüs" },
    { id: 2, name: "Sırt" },
    { id: 3, name: "Omuz" },
    { id: 4, name: "Bacak" },
    { id: 5, name: "Kol" },
  ] as MuscleGroup[],

  exercises: [
    { id: 1, name: "Bench Press", muscleGroupId: 1, equipmentId: 1, description: "Temel göğüs egzersizi" },
    { id: 2, name: "Squat", muscleGroupId: 4, equipmentId: 2, description: "Temel bacak egzersizi" },
  ] as ExerciseDefinition[],

  trainingPrograms: [
    { id: 1, name: "Başlangıç Programı", description: "Spora yeni başlayanlar için temel program.", type: "Full Body", visibility: "instructors_only" },
    { id: 2, name: "İleri Seviye Split", description: "Bölgesel çalışma programı.", type: "Split", visibility: "instructors_only" },
  ] as TrainingProgramDefinition[],

  contract: {
    id: 1,
    title: "Üyelik Sözleşmesi",
    content: `MADDE 1 -TARAFLAR: ...`,
    lastUpdated: new Date().toISOString()
  } as ContractDefinition,

  // ── Üyelik paketleri ──────────────────────────────────────────
  packages: [
    { id: 1, name: "Reformer 8 Ders", billingType: "session", sessionCount: 8, price: 4800, branch: "Pilates Reformer", freezeRightDays: 15, carryOverSessions: 2, cancellationHours: 12, description: "Ayda 8 ders hakkı, 2 ders devir hakkıyla.", isActive: true },
    { id: 2, name: "Reformer 12 Ders", billingType: "session", sessionCount: 12, price: 6600, branch: "Pilates Reformer", freezeRightDays: 15, carryOverSessions: 3, cancellationHours: 12, description: "Yoğun çalışanlar için 12 derslik paket.", isActive: true },
    { id: 3, name: "Fitness Aylık Sınırsız", billingType: "duration", durationDays: 30, price: 2200, branch: "Fitness", freezeRightDays: 7, carryOverSessions: 0, cancellationHours: 0, description: "Salon kullanımı sınırsız, grup dersleri hariç.", isActive: true },
    { id: 4, name: "Fitness 3 Aylık", billingType: "duration", durationDays: 90, price: 5700, branch: "Fitness", freezeRightDays: 21, carryOverSessions: 0, cancellationHours: 0, description: "Üç aylık peşin ödemeli salon üyeliği.", isActive: true },
    { id: 5, name: "Karma Yoga 3 Ay + 24 Ders", billingType: "hybrid", sessionCount: 24, durationDays: 90, price: 8400, branch: "Yoga", freezeRightDays: 21, carryOverSessions: 4, cancellationHours: 24, description: "Hem süre hem ders hakkı; hangisi önce biterse paket kapanır.", isActive: true },
    { id: 6, name: "Deneme Dersi", billingType: "session", sessionCount: 1, price: 450, freezeRightDays: 0, carryOverSessions: 0, cancellationHours: 6, description: "Tek seferlik tanışma dersi.", isActive: true },
    { id: 7, name: "Kick Boks 16 Ders", billingType: "session", sessionCount: 16, price: 7200, branch: "Kick Boks", freezeRightDays: 15, carryOverSessions: 3, cancellationHours: 12, description: "İki aylık kullanım öngörülür.", isActive: false },
  ] as MembershipPackage[],

  subscriptions: [
    { id: 1, memberId: 1, memberName: "Ali Yılmaz", packageId: 3, packageName: "Fitness Aylık Sınırsız", billingType: "duration", startDate: fromToday(-18), endDate: fromToday(12), usedSessions: 14, price: 2200, status: "active", frozenDaysUsed: 0 },
    { id: 2, memberId: 2, memberName: "Ayşe Demir", packageId: 1, packageName: "Reformer 8 Ders", billingType: "session", startDate: fromToday(-24), totalSessions: 8, usedSessions: 3, price: 4800, status: "active", frozenDaysUsed: 0 },
    { id: 3, memberId: 3, memberName: "Mehmet Kaya", packageId: 7, packageName: "Kick Boks 16 Ders", billingType: "session", startDate: fromToday(-70), totalSessions: 16, usedSessions: 16, price: 7200, status: "frozen", frozenDaysUsed: 9 },
    { id: 4, memberId: 4, memberName: "Zeynep Çelik", packageId: 5, packageName: "Karma Yoga 3 Ay + 24 Ders", billingType: "hybrid", startDate: fromToday(-40), endDate: fromToday(50), totalSessions: 24, usedSessions: 16, price: 8400, status: "active", frozenDaysUsed: 0 },
    { id: 5, memberId: 5, memberName: "Canan Şahin", packageId: 6, packageName: "Deneme Dersi", billingType: "session", startDate: fromToday(-55), totalSessions: 1, usedSessions: 1, price: 450, status: "expired", frozenDaysUsed: 0 },
    { id: 6, memberId: 6, memberName: "Murat Özkan", packageId: 4, packageName: "Fitness 3 Aylık", billingType: "duration", startDate: fromToday(-34), endDate: fromToday(56), usedSessions: 22, price: 5700, status: "active", frozenDaysUsed: 0 },
    { id: 7, memberId: 7, memberName: "Elif Koç", packageId: 2, packageName: "Reformer 12 Ders", billingType: "session", startDate: fromToday(-62), totalSessions: 12, usedSessions: 8, price: 6600, status: "frozen", frozenDaysUsed: 12 },
    { id: 8, memberId: 8, memberName: "Burak Yılmaz", packageId: 7, packageName: "Kick Boks 16 Ders", billingType: "session", startDate: fromToday(-12), totalSessions: 16, usedSessions: 1, price: 7200, status: "active", frozenDaysUsed: 0 },
    { id: 9, memberId: 9, memberName: "Selin Arslan", packageId: 5, packageName: "Karma Yoga 3 Ay + 24 Ders", billingType: "hybrid", startDate: fromToday(-28), endDate: fromToday(62), totalSessions: 24, usedSessions: 18, price: 8400, status: "active", frozenDaysUsed: 0 },
  ] as MemberSubscription[],

  // ── Gelişim takibi (ölçüm kayıtları) ──────────────────────────
  measurementRecords: [
    { id: 1, memberId: 1, date: fromToday(-120), values: [{ definitionId: 1, value: 92.4 }, { definitionId: 2, value: 181 }, { definitionId: 3, value: 27.5 }, { definitionId: 4, value: 98 }, { definitionId: 5, value: 34.1 }], recordedBy: "Burak Hoca", note: "Başlangıç ölçümü." },
    { id: 2, memberId: 1, date: fromToday(-88), values: [{ definitionId: 1, value: 89.8 }, { definitionId: 2, value: 181 }, { definitionId: 3, value: 25.9 }, { definitionId: 4, value: 95 }, { definitionId: 5, value: 35.0 }], recordedBy: "Burak Hoca" },
    { id: 3, memberId: 1, date: fromToday(-56), values: [{ definitionId: 1, value: 87.1 }, { definitionId: 2, value: 181 }, { definitionId: 3, value: 24.2 }, { definitionId: 4, value: 92 }, { definitionId: 5, value: 36.2 }], recordedBy: "Burak Hoca", note: "Kardiyo yükü artırıldı." },
    { id: 4, memberId: 1, date: fromToday(-24), values: [{ definitionId: 1, value: 85.3 }, { definitionId: 2, value: 181 }, { definitionId: 3, value: 22.8 }, { definitionId: 4, value: 89 }, { definitionId: 5, value: 37.4 }], recordedBy: "Burak Hoca" },
    { id: 5, memberId: 2, date: fromToday(-95), values: [{ definitionId: 1, value: 61.2 }, { definitionId: 2, value: 166 }, { definitionId: 3, value: 29.4 }, { definitionId: 4, value: 74 }, { definitionId: 5, value: 27.8 }], recordedBy: "Anıl Hoca", note: "Bel ağrısı şikayeti mevcut." },
    { id: 6, memberId: 2, date: fromToday(-52), values: [{ definitionId: 1, value: 59.8 }, { definitionId: 2, value: 166 }, { definitionId: 3, value: 27.9 }, { definitionId: 4, value: 71 }, { definitionId: 5, value: 28.6 }], recordedBy: "Anıl Hoca" },
    { id: 7, memberId: 2, date: fromToday(-15), values: [{ definitionId: 1, value: 58.9 }, { definitionId: 2, value: 166 }, { definitionId: 3, value: 26.4 }, { definitionId: 4, value: 69 }, { definitionId: 5, value: 29.5 }], recordedBy: "Anıl Hoca", note: "Şikayet geçti, yük artırılabilir." },
    { id: 8, memberId: 4, date: fromToday(-70), values: [{ definitionId: 1, value: 64.0 }, { definitionId: 2, value: 170 }, { definitionId: 3, value: 26.1 }, { definitionId: 4, value: 76 }, { definitionId: 5, value: 28.9 }], recordedBy: "Merve Hoca" },
    { id: 9, memberId: 4, date: fromToday(-20), values: [{ definitionId: 1, value: 62.4 }, { definitionId: 2, value: 170 }, { definitionId: 3, value: 24.7 }, { definitionId: 4, value: 73 }, { definitionId: 5, value: 30.1 }], recordedBy: "Merve Hoca" },
    { id: 10, memberId: 6, date: fromToday(-45), values: [{ definitionId: 1, value: 78.5 }, { definitionId: 2, value: 176 }, { definitionId: 3, value: 19.8 }, { definitionId: 4, value: 84 }, { definitionId: 5, value: 40.2 }], recordedBy: "Burak Hoca" },
    { id: 11, memberId: 6, date: fromToday(-10), values: [{ definitionId: 1, value: 79.8 }, { definitionId: 2, value: 176 }, { definitionId: 3, value: 18.6 }, { definitionId: 4, value: 83 }, { definitionId: 5, value: 42.0 }], recordedBy: "Burak Hoca", note: "Kas kütlesi hedefine göre iyi gidiyor." },
  ] as MeasurementRecord[],

  // ── Antrenman planları ────────────────────────────────────────
  workoutPlans: [
    {
      id: 1, memberId: 1, title: "Yağ Yakım — 3 Gün Bölünmüş", assignedBy: "Burak Hoca",
      startDate: fromToday(-30), endDate: fromToday(30), status: "active",
      note: "Her set arası nabız 130'un altına inmeden devam edilmeyecek.",
      days: [
        { dayOfWeek: 1, title: "İtiş — Göğüs & Omuz", items: [
          { exerciseId: 1, exerciseName: "Bench Press", sets: 4, reps: "10-12", weight: "45 kg", restSeconds: 90 },
          { exerciseId: 1, exerciseName: "Dumbbell Press", sets: 3, reps: "12", weight: "16 kg", restSeconds: 60 },
          { exerciseId: 1, exerciseName: "Cable Fly", sets: 3, reps: "15", weight: "20 kg", restSeconds: 45, note: "Sıkıştırmada 1 sn bekle." },
        ]},
        { dayOfWeek: 3, title: "Çekiş — Sırt & Kol", items: [
          { exerciseId: 2, exerciseName: "Lat Pulldown", sets: 4, reps: "12", weight: "50 kg", restSeconds: 75 },
          { exerciseId: 2, exerciseName: "Barbell Row", sets: 3, reps: "10", weight: "40 kg", restSeconds: 90 },
          { exerciseId: 2, exerciseName: "Biceps Curl", sets: 3, reps: "12-15", weight: "12 kg", restSeconds: 45 },
        ]},
        { dayOfWeek: 5, title: "Bacak & Karın", items: [
          { exerciseId: 2, exerciseName: "Squat", sets: 4, reps: "10", weight: "60 kg", restSeconds: 120 },
          { exerciseId: 2, exerciseName: "Leg Press", sets: 3, reps: "12", weight: "120 kg", restSeconds: 90 },
          { exerciseId: 2, exerciseName: "Plank", sets: 3, reps: "45 sn", weight: "vücut ağırlığı", restSeconds: 30 },
        ]},
      ],
    },
    {
      id: 2, memberId: 2, title: "Reformer Bel Koruyucu Program", assignedBy: "Anıl Hoca",
      startDate: fromToday(-18), status: "active",
      note: "Fleksiyon hareketlerinden kaçınılacak, nötr omurga korunacak.",
      days: [
        { dayOfWeek: 2, title: "Core Stabilizasyon", items: [
          { exerciseId: 1, exerciseName: "Footwork Serisi", sets: 3, reps: "10", restSeconds: 30 },
          { exerciseId: 1, exerciseName: "Bridging", sets: 3, reps: "12", restSeconds: 30, note: "Kalça yükseklikte 2 sn tut." },
          { exerciseId: 1, exerciseName: "Short Box — Round Back", sets: 2, reps: "8", restSeconds: 45 },
        ]},
        { dayOfWeek: 4, title: "Uzama & Denge", items: [
          { exerciseId: 1, exerciseName: "Long Stretch", sets: 3, reps: "8", restSeconds: 45 },
          { exerciseId: 1, exerciseName: "Side Split", sets: 3, reps: "10", restSeconds: 40 },
        ]},
      ],
    },
    {
      id: 3, memberId: 6, title: "Kas Kütlesi — Üst/Alt", assignedBy: "Burak Hoca",
      startDate: fromToday(-60), endDate: fromToday(-5), status: "completed",
      days: [
        { dayOfWeek: 1, title: "Üst Vücut", items: [
          { exerciseId: 1, exerciseName: "Bench Press", sets: 5, reps: "5", weight: "80 kg", restSeconds: 150 },
          { exerciseId: 2, exerciseName: "Pull Up", sets: 4, reps: "8", weight: "vücut ağırlığı", restSeconds: 120 },
        ]},
        { dayOfWeek: 4, title: "Alt Vücut", items: [
          { exerciseId: 2, exerciseName: "Squat", sets: 5, reps: "5", weight: "100 kg", restSeconds: 180 },
          { exerciseId: 2, exerciseName: "Romanian Deadlift", sets: 4, reps: "8", weight: "70 kg", restSeconds: 120 },
        ]},
      ],
    },
  ] as MemberWorkoutPlan[],

  // ── Salon marketi ─────────────────────────────────────────────
  products: [
    { id: 1, name: "Protein Bar — Fındık", category: "Atıştırmalık", price: 85, cost: 52, stock: 42, criticalStock: 15, barcode: "8690001000011", isActive: true },
    { id: 2, name: "İzotonik İçecek 500ml", category: "İçecek", price: 60, cost: 34, stock: 11, criticalStock: 20, barcode: "8690001000028", isActive: true },
    { id: 3, name: "Su 500ml", category: "İçecek", price: 20, cost: 8, stock: 128, criticalStock: 40, barcode: "8690001000035", isActive: true },
    { id: 4, name: "Whey Protein 1kg", category: "Supplement", price: 1450, cost: 980, stock: 6, criticalStock: 4, barcode: "8690001000042", isActive: true },
    { id: 5, name: "Shaker 600ml", category: "Ekipman", price: 180, cost: 95, stock: 3, criticalStock: 5, barcode: "8690001000059", isActive: true },
    { id: 6, name: "Pilates Çorabı", category: "Ekipman", price: 220, cost: 120, stock: 27, criticalStock: 10, barcode: "8690001000066", isActive: true },
    { id: 7, name: "Spor Havlusu", category: "Ekipman", price: 260, cost: 140, stock: 18, criticalStock: 8, barcode: "8690001000073", isActive: true },
    { id: 8, name: "Magnezyum Tablet", category: "Supplement", price: 340, cost: 210, stock: 9, criticalStock: 6, barcode: "8690001000080", isActive: true },
    { id: 9, name: "Yoga Matı", category: "Ekipman", price: 890, cost: 520, stock: 0, criticalStock: 3, barcode: "8690001000097", isActive: false },
  ] as Product[],

  sales: [
    { id: 1, date: fromToday(0) + "T09:42:00", lines: [{ productId: 3, productName: "Su 500ml", qty: 2, unitPrice: 20 }, { productId: 1, productName: "Protein Bar — Fındık", qty: 1, unitPrice: 85 }], total: 125, paymentMethod: "Nakit", soldBy: "Ayşe Personel" },
    { id: 2, date: fromToday(0) + "T11:15:00", lines: [{ productId: 4, productName: "Whey Protein 1kg", qty: 1, unitPrice: 1450 }], total: 1450, paymentMethod: "Kredi Kartı", soldBy: "Ayşe Personel" },
    { id: 3, date: fromToday(0) + "T13:05:00", lines: [{ productId: 2, productName: "İzotonik İçecek 500ml", qty: 1, unitPrice: 60 }], total: 60, paymentMethod: "Üye Hesabı", memberId: 1, memberName: "Ali Yılmaz", soldBy: "Admin User" },
    { id: 4, date: fromToday(-1) + "T18:30:00", lines: [{ productId: 6, productName: "Pilates Çorabı", qty: 1, unitPrice: 220 }, { productId: 7, productName: "Spor Havlusu", qty: 1, unitPrice: 260 }], total: 480, paymentMethod: "Kredi Kartı", memberId: 2, memberName: "Ayşe Demir", soldBy: "Ayşe Personel" },
    { id: 5, date: fromToday(-1) + "T20:10:00", lines: [{ productId: 3, productName: "Su 500ml", qty: 4, unitPrice: 20 }], total: 80, paymentMethod: "Nakit", soldBy: "Admin User" },
    { id: 6, date: fromToday(-2) + "T10:00:00", lines: [{ productId: 8, productName: "Magnezyum Tablet", qty: 1, unitPrice: 340 }, { productId: 1, productName: "Protein Bar — Fındık", qty: 2, unitPrice: 85 }], total: 510, paymentMethod: "Üye Hesabı", memberId: 6, memberName: "Murat Özkan", soldBy: "Ayşe Personel" },
    { id: 7, date: fromToday(-3) + "T16:45:00", lines: [{ productId: 5, productName: "Shaker 600ml", qty: 2, unitPrice: 180 }], total: 360, paymentMethod: "Nakit", soldBy: "Admin User" },
  ] as ProductSale[],

  stockMovements: [
    { id: 1, productId: 4, productName: "Whey Protein 1kg", type: "in", qty: 12, date: fromToday(-14), reason: "Tedarikçi girişi — Eylül siparişi", createdBy: "Admin User" },
    { id: 2, productId: 3, productName: "Su 500ml", type: "in", qty: 144, date: fromToday(-9), reason: "Koli girişi", createdBy: "Admin User" },
    { id: 3, productId: 2, productName: "İzotonik İçecek 500ml", type: "correction", qty: -3, date: fromToday(-6), reason: "Sayım farkı", createdBy: "Ayşe Personel" },
    { id: 4, productId: 9, productName: "Yoga Matı", type: "out", qty: -4, date: fromToday(-4), reason: "Stüdyo içi kullanıma alındı", createdBy: "Admin User" },
  ] as StockMovement[],

  // ── Hakediş kuralları ─────────────────────────────────────────
  commissionRules: [
    { id: 1, staffId: 101, staffName: "Anıl Hoca", type: "per_session", rate: 350, baseSalary: 18000, minSessions: 20, isActive: true },
    { id: 2, staffId: 102, staffName: "Yener Hoca", type: "revenue_share", rate: 22, baseSalary: 12000, isActive: true },
    { id: 3, staffId: 103, staffName: "Merve Hoca", type: "per_session", rate: 300, baseSalary: 15000, minSessions: 15, isActive: true },
    { id: 4, staffId: 104, staffName: "Burak Hoca", type: "revenue_share", rate: 28, baseSalary: 10000, isActive: true },
    { id: 5, staffId: 105, staffName: "Selin Hoca", type: "fixed", rate: 0, baseSalary: 26000, isActive: true },
  ] as CommissionRule[],

  // ── Bildirim merkezi ──────────────────────────────────────────
  notificationTemplates: [
    { id: 1, name: "Paket Bitiyor Uyarısı", trigger: "package_ending", channel: "sms", offsetDays: 0, isActive: true, body: "Merhaba {{ad}}, {{paket}} paketinizde {{kalanDers}} ders hakkınız kaldı. Yenilemek için bize ulaşabilirsiniz. {{salon}}" },
    { id: 2, name: "Üyelik Süresi Doluyor", trigger: "membership_expiring", channel: "sms", offsetDays: 7, isActive: true, body: "Merhaba {{ad}}, üyeliğinizin bitmesine {{kalanGun}} gün kaldı. Kesintisiz devam etmek için resepsiyona uğrayabilirsiniz. {{salon}}" },
    { id: 3, name: "Doğum Günü Kutlaması", trigger: "birthday", channel: "sms", offsetDays: 0, isActive: true, body: "Doğum günün kutlu olsun {{ad}}! Bu ay sana özel bir dersimiz hediye. {{salon}}" },
    { id: 4, name: "Ders Hatırlatması", trigger: "session_reminder", channel: "sms", offsetDays: 1, isActive: true, body: "{{ad}}, yarın {{saat}} saatindeki {{ders}} dersiniz için yerinizi ayırdık. İptal için son saat: {{iptalSaati}}." },
    { id: 5, name: "Uzun Süredir Gelmeyen Üye", trigger: "inactive_member", channel: "sms", offsetDays: 21, isActive: false, body: "Merhaba {{ad}}, seni {{gecenGun}} gündür göremedik. Programını birlikte gözden geçirelim mi? {{salon}}" },
    { id: 6, name: "Yeni Dönem Duyurusu", trigger: "manual", channel: "email", offsetDays: 0, isActive: true, body: "Sayın {{ad}}, yeni dönem ders programımız yayında. Detaylar ve rezervasyon için panelinizi ziyaret edebilirsiniz." },
  ] as NotificationTemplate[],

  notificationLogs: [
    { id: 1, templateName: "Paket Bitiyor Uyarısı", memberName: "Ayşe Demir", memberPhone: "0532 222 33 44", channel: "sms", sentAt: fromToday(0) + "T08:30:00", status: "sent", preview: "Merhaba Ayşe Demir, Reformer 8 Ders paketinizde 5 ders hakkınız kaldı..." },
    { id: 2, templateName: "Ders Hatırlatması", memberName: "Zeynep Çelik", memberPhone: "0505 444 55 66", channel: "sms", sentAt: fromToday(0) + "T08:30:00", status: "sent", preview: "Zeynep Çelik, yarın 10:00 saatindeki Yoga dersiniz için yerinizi ayırdık..." },
    { id: 3, templateName: "Ders Hatırlatması", memberName: "Selin Arslan", memberPhone: "0530 222 11 88", channel: "sms", sentAt: fromToday(0) + "T08:30:00", status: "sent", preview: "Selin Arslan, yarın 18:00 saatindeki Yoga dersiniz için yerinizi ayırdık..." },
    { id: 4, templateName: "Üyelik Süresi Doluyor", memberName: "Ali Yılmaz", memberPhone: "0555 111 22 33", channel: "sms", sentAt: fromToday(-1) + "T09:00:00", status: "sent", preview: "Merhaba Ali Yılmaz, üyeliğinizin bitmesine 12 gün kaldı..." },
    { id: 5, templateName: "Doğum Günü Kutlaması", memberName: "Murat Özkan", memberPhone: "0533 111 22 99", channel: "sms", sentAt: fromToday(-2) + "T09:15:00", status: "sent", preview: "Doğum günün kutlu olsun Murat Özkan! Bu ay sana özel bir dersimiz hediye." },
    { id: 6, templateName: "Paket Bitiyor Uyarısı", memberName: "Canan Şahin", memberPhone: "0536 555 66 77", channel: "sms", sentAt: fromToday(-2) + "T08:30:00", status: "failed", preview: "Numaraya ulaşılamadı — operatör reddi." },
    { id: 7, templateName: "Yeni Dönem Duyurusu", memberName: "Burak Yılmaz", memberPhone: "0535 555 66 22", channel: "email", sentAt: fromToday(-4) + "T14:00:00", status: "sent", preview: "Sayın Burak Yılmaz, yeni dönem ders programımız yayında..." },
    { id: 8, templateName: "Ders Hatırlatması", memberName: "Elif Koç", memberPhone: "0542 333 44 11", channel: "sms", sentAt: fromToday(-5) + "T08:30:00", status: "queued", preview: "Elif Koç, yarın 09:00 saatindeki Pilates Reformer dersiniz..." },
  ] as NotificationLog[],

  sessionCache: {} as { [key: string]: Session[] }
};

