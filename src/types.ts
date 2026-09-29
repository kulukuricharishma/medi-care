export type UserRole = 'patient' | 'doctor' | 'store';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
}

export interface PatientProfile {
  patientId: string;
  userId: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  phone: string;
  email: string;
  address: string;
  allergies?: string[];
  chronicConditions?: string[];
  emergencyContact?: string;
}

export interface DoctorProfile {
  doctorId: string;
  userId: string;
  name: string;
  specialization: string;
  qualification: string;
  experience: string;
  hospital: string;
  consultationFee: number;
  rating: number;
  reviewsCount: number;
  avatar: string;
  availability: string; // e.g. 'Mon - Fri, 9:00 AM - 5:00 PM'
  availableSlots: string[];
  about?: string;
}

export type AppointmentStatus = 'Upcoming' | 'Completed' | 'Cancelled' | 'Pending';

export interface Appointment {
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  doctorHospital: string;
  date: string;
  time: string;
  type: 'In-Person' | 'Video Consultation';
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  fee: number;
}

export type ReportType = 'Blood Report' | 'Lab Report' | 'Scan Report' | 'Doctor Report' | 'Biochemistry';

export interface MedicalReport {
  reportId: string;
  patientId: string;
  patientName: string;
  doctorId?: string;
  doctorName?: string;
  reportName: string;
  reportType: ReportType;
  date: string;
  labName: string;
  status: 'Ready' | 'Under Review' | 'Pending';
  summary: string;
  findings?: string[];
  fileUrl?: string;
}

export interface PrescribedMedicineItem {
  medicineName: string;
  dosage: string; // e.g. '500mg'
  frequency: string; // e.g. '1-0-1 (After Food)'
  duration: string; // e.g. '5 days'
  instructions: string; // e.g. 'Take with a full glass of water'
}

export interface Prescription {
  prescriptionId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  date: string;
  medicines: PrescribedMedicineItem[];
  diagnosis: string;
  additionalNotes?: string;
  followUpDate?: string;
}

export interface Medicine {
  medicineId: string;
  storeId: string;
  storeName: string;
  name: string;
  genericName: string;
  brand: string;
  category: 'Pain Relief' | 'Allergy' | 'Antibiotic' | 'Gastrointestinal' | 'Cardiology' | 'Vitamins' | 'General';
  price: number;
  stock: number;
  expiryDate: string;
  availability: boolean;
  dosageForm: string; // 'Tablet', 'Syrup', 'Capsule'
  prescriptionRequired: boolean;
}

export interface MedicalStore {
  storeId: string;
  name: string;
  owner: string;
  address: string;
  phone: string;
  openingHours: string;
  rating: number;
  status: 'Open' | 'Closed';
  availableServices: string[];
}

export type OrderStatus = 'Pending' | 'Accepted' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';

export interface OrderItem {
  medicineId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  orderId: string;
  patientId: string;
  patientName: string;
  storeId: string;
  storeName: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  orderDate: string;
  deliveryAddress?: string;
  paymentMethod: 'Cash on Pickup' | 'Online Paid' | 'Card on Delivery';
}

export interface LabTest {
  testId: string;
  name: string;
  description: string;
  price: number;
  preparationInstructions: string;
  availableDays: string;
  turnaroundTime: string;
  category: string;
}

export interface Bill {
  billId: string;
  patientId: string;
  patientName: string;
  type: 'Consultation' | 'Lab Test' | 'Medicine Order';
  referenceTitle: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Cancelled';
  invoiceNumber: string;
}

export interface FollowUp {
  followUpId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  reason: string;
  status: 'Scheduled' | 'Completed' | 'Overdue';
  notes?: string;
}
