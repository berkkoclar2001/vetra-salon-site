// src/types/index.ts

// Backend'den gelecek verinin genel şablonu
export interface ApiResponse<T> {
  data: T;      // Asıl veri listesi (Randevular vs.)
  meta: {       // Sayfalama bilgileri
    total: number;       // Toplam kayıt sayısı
    page: number;        // Şu anki sayfa
    limit: number;       // Sayfada kaç veri var
    totalPages: number;  // Toplam sayfa sayısı
  };
}

// Randevu verisinin tipi (Şimdilik örnek alanlar)
export interface Randevu {
  id: number;
  musteriAdi: string;
  tarih: string; // "2024-02-01" gibi
  saat: string;  // "14:30" gibi
  durum: 'bekliyor' | 'onaylandi' | 'iptal';
}

// --- GİRİŞ (LOGIN) İÇİN GEREKLİ TİPLER ---

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  role: 'admin' | 'staff';
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}

// --- RANDEVU / DERS TİPLERİ ---

export interface Participant {
  id: number;
  name: string;
  phone?: string;
  status: 'active' | 'cancelled';
}

export interface Session {
  id: number;
  date: string;       // "2024-02-05"
  time: string;       // "09:00"
  activity: string;   // "Pilates Reformer"
  instructor?: string; // "Anıl Hoca" (Opsiyonel olabilir başta ama genelde olur)
  capacity: number;   // 6
  enrolledCount: number; // 4
  participants: Participant[];
  status: 'active' | 'full' | 'cancelled';
  isRecurring?: boolean;
  level?: 'beginner' | 'intermediate' | 'advanced';
}

export interface RecurringSession {
  id: number;
  dayOfWeek: number; // 0-6 (0: Pazar, 1: Pazartesi...)
  time: string;     // "09:00"
  activity: string; // "Pilates"
  instructor: string;
  capacity: number;
  level?: 'beginner' | 'intermediate' | 'advanced';
}

// --- ÜYE (MEMBER) TİPLERİ ---

export interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'passive' | 'frozen' | 'pre-registration';
  membershipType: string; // 'Standart', 'Gold' vb.
  remainingSessions: number;
  joinDate: string;
  avatar?: string;
  paymentAmount?: number;
  paymentMethod?: 'Nakit' | 'Kredi Kartı' | 'Havale/EFT' | 'Ödeme Alınmadı';
  lastPaymentDate?: string;
  addedBy?: string; // Hangi personel ekledi
  gender?: 'Erkek' | 'Kadın' | 'Diğer';
  birthDate?: string;
  address?: string;
  emergencyContact?: string;
  profession?: string;
  qrCode?: string;
  nfcId?: string;
  branch?: string; // pilates, yoga, fitness vb.
  level?: 'beginner' | 'intermediate' | 'advanced'; // Başlangıç, Orta, İleri
  password?: string; // Sadece oluşturma anında tutulacak
}

// --- PERSONEL (STAFF) TİPLERİ ---

export interface StaffMember {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'staff' | 'trainer';
  status: 'active' | 'passive';
  joinDate: string;
  avatar?: string;
  tc?: string;
  branch?: string;
  color?: string;
  startDate?: string;
  endDate?: string;
  totalMembers?: number;
  totalRevenue?: number;
  lastRegistrationPeriod?: string;
  branchLevels?: Record<string, ('beginner' | 'intermediate' | 'advanced')[]>;
}

// --- FİNANS (EXPENSE) TİPLERİ ---

export interface Expense {
  id: number;
  title: string;
  amount: number;
  type: 'Kira' | 'Fatura' | 'Maaş' | 'Yemek' | 'Diğer';
  date: string;
  description?: string;
}

// --- ÜYE NOTLARI TİPLERİ ---

export interface MemberNote {
  id: number;
  memberId: number;
  memberName: string;
  note: string;
  date: string; // ISO string
  type: 'info' | 'warning' | 'success' | 'danger';
  createdBy: string;
}

// --- SALON AYARLARI ---

export interface DayBusinessHours {
  open: string;  // "08:00"
  close: string; // "22:00"
  isOpen: boolean;
}

export interface BusinessHours {
  [key: number]: DayBusinessHours; // 0: Pazar, 1: Pazartesi...
}

export interface Instructor {
  id: number;
  name: string;
  tc?: string;
  phone: string;
  email: string;
  branch?: string;
  color?: string;
  startDate?: string;
  endDate?: string;
  avatar?: string;
}

export interface Reminder {
  id: number;
  date: string; // ISO date string "YYYY-MM-DD"
  text: string;
  type: 'info' | 'important';
  createdBy?: string;
  color?: string;
}

export interface MeasurementDefinition {
  id: number;
  name: string;
  orderNo: number;
  unit: string;
}

export interface EquipmentDefinition {
  id: number;
  name: string;
  category?: string;
  brand?: string;
}

export interface MuscleGroup {
  id: number;
  name: string;
}

export interface ExerciseDefinition {
  id: number;
  name: string;
  muscleGroupId?: number;
  equipmentId?: number;
  description?: string;
}

export interface TrainingProgramDefinition {
  id: number;
  name: string;
  description?: string;
  type: string; // e.g., "Full Body", "Split", "Cardio"
  visibility: "all" | "instructors_only";
}

export interface ContractDefinition {
  id: number;
  title: string;
  content: string;
  lastUpdated: string;
}
// ═══════════════════════════════════════════════════════════════
//  ÜYELİK PAKETLERİ
//  Seans adedi, süre veya ikisinin birlikte çalıştığı karma paket.
//  Devir hakkı ve iptal penceresi paket seviyesinde tanımlanır.
// ═══════════════════════════════════════════════════════════════

export type PackageBillingType = 'session' | 'duration' | 'hybrid';

export interface MembershipPackage {
  id: number;
  name: string;
  billingType: PackageBillingType;
  sessionCount?: number;   // 'session' ve 'hybrid' için
  durationDays?: number;   // 'duration' ve 'hybrid' için
  price: number;
  branch?: string;
  freezeRightDays: number;    // üyenin dondurabileceği toplam gün
  carryOverSessions: number;  // dönem sonunda devredebileceği seans
  cancellationHours: number;  // seanstan kaç saat önce iptal edilebilir
  description?: string;
  isActive: boolean;
}

export interface MemberSubscription {
  id: number;
  memberId: number;
  memberName: string;
  packageId: number;
  packageName: string;
  billingType: PackageBillingType;
  startDate: string;
  endDate?: string;
  totalSessions?: number;
  usedSessions: number;
  price: number;
  status: 'active' | 'expired' | 'frozen';
  frozenDaysUsed: number;
}

// ═══════════════════════════════════════════════════════════════
//  GELİŞİM TAKİBİ
//  Ölçülen alanlar sabit değil; Tanımlamalar > Ölçüm Tanımları
//  ekranından gelen listeye göre dinamik oluşur.
// ═══════════════════════════════════════════════════════════════

export interface MeasurementValue {
  definitionId: number;
  value: number;
}

export interface MeasurementRecord {
  id: number;
  memberId: number;
  date: string;
  values: MeasurementValue[];
  recordedBy: string;
  note?: string;
}

// ═══════════════════════════════════════════════════════════════
//  ANTRENMAN PLANI
//  Programlar üyeye haftanın günlerine bölünmüş olarak atanır;
//  her satırda set / tekrar / ağırlık / dinlenme tutulur.
// ═══════════════════════════════════════════════════════════════

export interface WorkoutItem {
  exerciseId: number;
  exerciseName: string;
  sets: number;
  reps: string;        // "12" ya da "10-12"
  weight?: string;     // "40 kg" ya da "vücut ağırlığı"
  restSeconds?: number;
  note?: string;
}

export interface WorkoutDay {
  dayOfWeek: number;   // 1: Pazartesi ... 0: Pazar
  title: string;       // "Üst Vücut", "Bacak & Karın"
  items: WorkoutItem[];
}

export interface MemberWorkoutPlan {
  id: number;
  memberId: number;
  title: string;
  assignedBy: string;
  startDate: string;
  endDate?: string;
  days: WorkoutDay[];
  status: 'active' | 'completed';
  note?: string;
}

// ═══════════════════════════════════════════════════════════════
//  SALON MARKETİ
//  Ürün satışı stok üzerinden çalışır; kritik seviyeye düşen
//  ürünler panelde uyarı verir.
// ═══════════════════════════════════════════════════════════════

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  cost?: number;
  stock: number;
  criticalStock: number;
  barcode?: string;
  isActive: boolean;
}

export interface SaleLine {
  productId: number;
  productName: string;
  qty: number;
  unitPrice: number;
}

export interface ProductSale {
  id: number;
  date: string;        // ISO
  lines: SaleLine[];
  total: number;
  paymentMethod: 'Nakit' | 'Kredi Kartı' | 'Üye Hesabı';
  memberId?: number;
  memberName?: string;
  soldBy: string;
}

export interface StockMovement {
  id: number;
  productId: number;
  productName: string;
  type: 'in' | 'out' | 'correction';
  qty: number;
  date: string;
  reason: string;
  createdBy: string;
}

// ═══════════════════════════════════════════════════════════════
//  HAKEDİŞ
//  Eğitmen kazancı ders başına, ciro yüzdesi veya sabit ücret
//  olarak tanımlanır; aylık döküm buradan hesaplanır.
// ═══════════════════════════════════════════════════════════════

export type CommissionType = 'per_session' | 'revenue_share' | 'fixed';

export interface CommissionRule {
  id: number;
  staffId: number;
  staffName: string;
  type: CommissionType;
  rate: number;          // TL (per_session/fixed) ya da % (revenue_share)
  baseSalary: number;    // sabit taban ücret
  minSessions?: number;  // prim eşiği
  isActive: boolean;
}

export interface PayoutLine {
  staffId: number;
  staffName: string;
  branch?: string;
  ruleLabel: string;
  sessionCount: number;
  attendedCount: number;
  generatedRevenue: number;
  baseSalary: number;
  commission: number;
  total: number;
}

// ═══════════════════════════════════════════════════════════════
//  BİLDİRİM MERKEZİ
//  Şablon + tetikleyici kuralı + gönderim geçmişi olarak üç
//  parçalı çalışır. Şablon metninde {{degisken}} kullanılır.
// ═══════════════════════════════════════════════════════════════

export type NotificationTrigger =
  | 'package_ending'
  | 'membership_expiring'
  | 'birthday'
  | 'session_reminder'
  | 'inactive_member'
  | 'manual';

export type NotificationChannel = 'sms' | 'email';

export interface NotificationTemplate {
  id: number;
  name: string;
  trigger: NotificationTrigger;
  channel: NotificationChannel;
  body: string;
  offsetDays: number;   // tetikleyiciden kaç gün önce/sonra
  isActive: boolean;
}

export interface NotificationLog {
  id: number;
  templateName: string;
  memberName: string;
  memberPhone: string;
  channel: NotificationChannel;
  sentAt: string;
  status: 'sent' | 'queued' | 'failed';
  preview: string;
}
