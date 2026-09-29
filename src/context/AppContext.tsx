import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  PatientProfile,
  DoctorProfile,
  MedicalStore,
  Medicine,
  Appointment,
  MedicalReport,
  Prescription,
  Order,
  OrderStatus,
  LabTest,
  Bill,
  FollowUp,
  PrescribedMedicineItem,
  AppointmentStatus,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PATIENTS,
  INITIAL_DOCTORS,
  INITIAL_STORES,
  INITIAL_MEDICINES,
  INITIAL_APPOINTMENTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_REPORTS,
  INITIAL_ORDERS,
  INITIAL_LAB_TESTS,
  INITIAL_BILLS,
  INITIAL_FOLLOWUPS,
} from '../data/initialData';

interface AppContextType {
  // Auth & Role
  currentUser: User;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  loginAsRole: (role: UserRole) => void;
  logout: () => void;
  isLoggedIn: boolean;

  // Profiles
  currentPatientProfile?: PatientProfile;
  currentDoctorProfile?: DoctorProfile;
  currentStoreProfile?: MedicalStore;

  // Collections
  patients: PatientProfile[];
  doctors: DoctorProfile[];
  stores: MedicalStore[];
  medicines: Medicine[];
  appointments: Appointment[];
  prescriptions: Prescription[];
  reports: MedicalReport[];
  orders: Order[];
  labTests: LabTest[];
  bills: Bill[];
  followUps: FollowUp[];

  // Patient Actions
  bookAppointment: (data: {
    doctorId: string;
    date: string;
    time: string;
    type: 'In-Person' | 'Video Consultation';
    reason: string;
  }) => { success: boolean; message: string };
  cancelAppointment: (appointmentId: string) => void;
  rescheduleAppointment: (appointmentId: string, newDate: string, newTime: string) => void;
  bookLabTest: (testId: string, date: string, timeSlot: string) => void;
  placeOrder: (storeId: string, items: { medicineId: string; name: string; price: number; quantity: number }[], paymentMethod: 'Cash on Pickup' | 'Online Paid' | 'Card on Delivery', deliveryAddress?: string) => { success: boolean; orderId: string };
  payBill: (billId: string) => void;

  // Doctor Actions
  updateAppointmentStatus: (appointmentId: string, status: AppointmentStatus, notes?: string) => void;
  createPrescription: (data: {
    patientId: string;
    medicines: PrescribedMedicineItem[];
    diagnosis: string;
    additionalNotes?: string;
    followUpDate?: string;
  }) => { success: boolean; prescriptionId: string };
  scheduleFollowUp: (patientId: string, date: string, reason: string, notes?: string) => void;
  markFollowUpCompleted: (followUpId: string) => void;
  uploadReport: (data: {
    patientId: string;
    reportName: string;
    reportType: MedicalReport['reportType'];
    labName: string;
    summary: string;
    findings?: string[];
  }) => void;

  // Store Actions
  addMedicine: (medicine: Omit<Medicine, 'medicineId' | 'storeId' | 'storeName'>) => void;
  updateMedicine: (medicineId: string, updates: Partial<Medicine>) => void;
  deleteMedicine: (medicineId: string) => void;
  updateStock: (medicineId: string, newStock: number) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  updateStoreDetails: (updates: Partial<MedicalStore>) => void;

  // UI state
  isAIAssistantOpen: boolean;
  setIsAIAssistantOpen: (open: boolean) => void;
  activeToast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'medibridge_ai_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial from localStorage or defaults
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_user`);
      return saved ? JSON.parse(saved) : INITIAL_USERS[0];
    } catch {
      return INITIAL_USERS[0];
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  const [patients, setPatients] = useState<PatientProfile[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_patients`);
      return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
    } catch {
      return INITIAL_PATIENTS;
    }
  });

  const [doctors] = useState<DoctorProfile[]>(INITIAL_DOCTORS);
  const [stores, setStores] = useState<MedicalStore[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_stores`);
      return saved ? JSON.parse(saved) : INITIAL_STORES;
    } catch {
      return INITIAL_STORES;
    }
  });

  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_medicines`);
      return saved ? JSON.parse(saved) : INITIAL_MEDICINES;
    } catch {
      return INITIAL_MEDICINES;
    }
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_appointments`);
      return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_prescriptions`);
      return saved ? JSON.parse(saved) : INITIAL_PRESCRIPTIONS;
    } catch {
      return INITIAL_PRESCRIPTIONS;
    }
  });

  const [reports, setReports] = useState<MedicalReport[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_reports`);
      return saved ? JSON.parse(saved) : INITIAL_REPORTS;
    } catch {
      return INITIAL_REPORTS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_orders`);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [labTests] = useState<LabTest[]>(INITIAL_LAB_TESTS);

  const [bills, setBills] = useState<Bill[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_bills`);
      return saved ? JSON.parse(saved) : INITIAL_BILLS;
    } catch {
      return INITIAL_BILLS;
    }
  });

  const [followUps, setFollowUps] = useState<FollowUp[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_followups`);
      return saved ? JSON.parse(saved) : INITIAL_FOLLOWUPS;
    } catch {
      return INITIAL_FOLLOWUPS;
    }
  });

  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setActiveToast({ message, type });
    setTimeout(() => {
      setActiveToast(null);
    }, 4000);
  };

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(currentUser));
      localStorage.setItem(`${STORAGE_KEY}_patients`, JSON.stringify(patients));
      localStorage.setItem(`${STORAGE_KEY}_stores`, JSON.stringify(stores));
      localStorage.setItem(`${STORAGE_KEY}_medicines`, JSON.stringify(medicines));
      localStorage.setItem(`${STORAGE_KEY}_appointments`, JSON.stringify(appointments));
      localStorage.setItem(`${STORAGE_KEY}_prescriptions`, JSON.stringify(prescriptions));
      localStorage.setItem(`${STORAGE_KEY}_reports`, JSON.stringify(reports));
      localStorage.setItem(`${STORAGE_KEY}_orders`, JSON.stringify(orders));
      localStorage.setItem(`${STORAGE_KEY}_bills`, JSON.stringify(bills));
      localStorage.setItem(`${STORAGE_KEY}_followups`, JSON.stringify(followUps));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [currentUser, patients, stores, medicines, appointments, prescriptions, reports, orders, bills, followUps]);

  // Roles & Profiles
  const currentRole = currentUser.role;

  const currentPatientProfile = patients.find(p => p.userId === currentUser.id) || patients[0];
  const currentDoctorProfile = doctors.find(d => d.userId === currentUser.id) || doctors[0];
  const currentStoreProfile = stores.find(s => s.storeId === 'store_1') || stores[0];

  const setCurrentRole = (role: UserRole) => {
    loginAsRole(role);
  };

  const loginAsRole = (role: UserRole) => {
    setIsLoggedIn(true);
    if (role === 'patient') {
      setCurrentUser(INITIAL_USERS[0]); // Rahul Verma
      showToast('Switched to Patient view (Rahul Verma)', 'info');
    } else if (role === 'doctor') {
      setCurrentUser(INITIAL_USERS[1]); // Dr. Rahul Sharma
      showToast('Switched to Doctor view (Dr. Rahul Sharma)', 'info');
    } else if (role === 'store') {
      setCurrentUser(INITIAL_USERS[2]); // HealthPlus Pharmacy
      showToast('Switched to Medical Store view (HealthPlus Pharmacy)', 'info');
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    showToast('Logged out successfully', 'info');
  };

  const resetDemoData = () => {
    localStorage.clear();
    setCurrentUser(INITIAL_USERS[0]);
    setIsLoggedIn(true);
    setPatients(INITIAL_PATIENTS);
    setStores(INITIAL_STORES);
    setMedicines(INITIAL_MEDICINES);
    setAppointments(INITIAL_APPOINTMENTS);
    setPrescriptions(INITIAL_PRESCRIPTIONS);
    setReports(INITIAL_REPORTS);
    setOrders(INITIAL_ORDERS);
    setBills(INITIAL_BILLS);
    setFollowUps(INITIAL_FOLLOWUPS);
    showToast('Reset all platform demo data to defaults', 'success');
  };

  // Patient Actions
  const bookAppointment = (data: {
    doctorId: string;
    date: string;
    time: string;
    type: 'In-Person' | 'Video Consultation';
    reason: string;
  }) => {
    const doc = doctors.find(d => d.doctorId === data.doctorId);
    if (!doc) return { success: false, message: 'Doctor not found' };

    const newAptId = `apt_${Date.now()}`;
    const newAppointment: Appointment = {
      appointmentId: newAptId,
      patientId: currentPatientProfile.patientId,
      patientName: currentPatientProfile.name,
      doctorId: doc.doctorId,
      doctorName: doc.name,
      doctorSpecialization: doc.specialization,
      doctorHospital: doc.hospital,
      date: data.date,
      time: data.time,
      type: data.type,
      status: 'Upcoming',
      reason: data.reason,
      fee: doc.consultationFee,
    };

    setAppointments(prev => [newAppointment, ...prev]);

    // Create a billing item for this consultation
    const newBill: Bill = {
      billId: `bill_${Date.now()}`,
      patientId: currentPatientProfile.patientId,
      patientName: currentPatientProfile.name,
      type: 'Consultation',
      referenceTitle: `Consultation with ${doc.name}`,
      amount: doc.consultationFee,
      date: data.date,
      status: 'Pending',
      invoiceNumber: `INV-${Date.now().toString().slice(-5)}`,
    };
    setBills(prev => [newBill, ...prev]);

    showToast(`Appointment booked with ${doc.name} for ${data.date} at ${data.time}`, 'success');
    return { success: true, message: 'Appointment confirmed' };
  };

  const cancelAppointment = (appointmentId: string) => {
    setAppointments(prev =>
      prev.map(apt => (apt.appointmentId === appointmentId ? { ...apt, status: 'Cancelled' as AppointmentStatus } : apt))
    );
    showToast('Appointment has been cancelled', 'info');
  };

  const rescheduleAppointment = (appointmentId: string, newDate: string, newTime: string) => {
    setAppointments(prev =>
      prev.map(apt => (apt.appointmentId === appointmentId ? { ...apt, date: newDate, time: newTime, status: 'Upcoming' as AppointmentStatus } : apt))
    );
    showToast(`Appointment rescheduled to ${newDate} at ${newTime}`, 'success');
  };

  const bookLabTest = (testId: string, date: string, timeSlot: string) => {
    const test = labTests.find(t => t.testId === testId);
    if (!test) return;

    const newBill: Bill = {
      billId: `bill_${Date.now()}`,
      patientId: currentPatientProfile.patientId,
      patientName: currentPatientProfile.name,
      type: 'Lab Test',
      referenceTitle: `${test.name} - Slot: ${timeSlot} on ${date}`,
      amount: test.price,
      date,
      status: 'Pending',
      invoiceNumber: `LAB-${Date.now().toString().slice(-5)}`,
    };

    setBills(prev => [newBill, ...prev]);
    showToast(`Lab Test "${test.name}" scheduled for ${date}. Invoice added to Billing.`, 'success');
  };

  const placeOrder = (
    storeId: string,
    items: { medicineId: string; name: string; price: number; quantity: number }[],
    paymentMethod: 'Cash on Pickup' | 'Online Paid' | 'Card on Delivery',
    deliveryAddress?: string
  ) => {
    const store = stores.find(s => s.storeId === storeId);
    const storeName = store ? store.name : 'HealthPlus Pharmacy';
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderId = `ord_${Date.now().toString().slice(-6)}`;

    const newOrder: Order = {
      orderId,
      patientId: currentPatientProfile.patientId,
      patientName: currentPatientProfile.name,
      storeId,
      storeName,
      items,
      totalPrice: total,
      status: 'Pending',
      orderDate: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      deliveryAddress: deliveryAddress || currentPatientProfile.address,
      paymentMethod,
    };

    setOrders(prev => [newOrder, ...prev]);

    // Deduct stock in real-time
    setMedicines(prev =>
      prev.map(med => {
        const ordered = items.find(i => i.medicineId === med.medicineId);
        if (ordered) {
          const updatedStock = Math.max(0, med.stock - ordered.quantity);
          return {
            ...med,
            stock: updatedStock,
            availability: updatedStock > 0,
          };
        }
        return med;
      })
    );

    // Add bill
    const newBill: Bill = {
      billId: `bill_${Date.now()}`,
      patientId: currentPatientProfile.patientId,
      patientName: currentPatientProfile.name,
      type: 'Medicine Order',
      referenceTitle: `Pharmacy Order #${orderId} (${storeName})`,
      amount: total,
      date: new Date().toISOString().split('T')[0],
      status: paymentMethod === 'Online Paid' ? 'Paid' : 'Pending',
      invoiceNumber: `MED-${Date.now().toString().slice(-5)}`,
    };
    setBills(prev => [newBill, ...prev]);

    showToast(`Order #${orderId} placed with ${storeName}! Total: ₹${total}`, 'success');
    return { success: true, orderId };
  };

  const payBill = (billId: string) => {
    setBills(prev =>
      prev.map(b => (b.billId === billId ? { ...b, status: 'Paid' as const } : b))
    );
    showToast('Payment successful! Invoice receipt generated.', 'success');
  };

  // Doctor Actions
  const updateAppointmentStatus = (appointmentId: string, status: AppointmentStatus, notes?: string) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.appointmentId === appointmentId
          ? { ...apt, status, notes: notes !== undefined ? notes : apt.notes }
          : apt
      )
    );
    showToast(`Appointment marked as ${status}`, 'success');
  };

  const createPrescription = (data: {
    patientId: string;
    medicines: PrescribedMedicineItem[];
    diagnosis: string;
    additionalNotes?: string;
    followUpDate?: string;
  }) => {
    const targetPatient = patients.find(p => p.patientId === data.patientId) || patients[0];
    const newPrescriptionId = `rx_${Date.now().toString().slice(-5)}`;

    const newPrescription: Prescription = {
      prescriptionId: newPrescriptionId,
      patientId: targetPatient.patientId,
      patientName: targetPatient.name,
      doctorId: currentDoctorProfile.doctorId,
      doctorName: currentDoctorProfile.name,
      doctorSpecialization: currentDoctorProfile.specialization,
      date: new Date().toISOString().split('T')[0],
      medicines: data.medicines,
      diagnosis: data.diagnosis,
      additionalNotes: data.additionalNotes,
      followUpDate: data.followUpDate,
    };

    setPrescriptions(prev => [newPrescription, ...prev]);

    // If follow-up date is set, schedule follow-up automatically
    if (data.followUpDate) {
      scheduleFollowUp(
        targetPatient.patientId,
        data.followUpDate,
        `Follow-up for ${data.diagnosis}`,
        data.additionalNotes
      );
    }

    showToast(`Prescription #${newPrescriptionId} created for ${targetPatient.name}`, 'success');
    return { success: true, prescriptionId: newPrescriptionId };
  };

  const scheduleFollowUp = (patientId: string, date: string, reason: string, notes?: string) => {
    const targetPatient = patients.find(p => p.patientId === patientId) || patients[0];
    const newFollowUp: FollowUp = {
      followUpId: `fol_${Date.now().toString().slice(-5)}`,
      patientId,
      patientName: targetPatient.name,
      doctorId: currentDoctorProfile.doctorId,
      doctorName: currentDoctorProfile.name,
      date,
      reason,
      status: 'Scheduled',
      notes,
    };
    setFollowUps(prev => [newFollowUp, ...prev]);
    showToast(`Follow-up scheduled with ${targetPatient.name} on ${date}`, 'success');
  };

  const markFollowUpCompleted = (followUpId: string) => {
    setFollowUps(prev =>
      prev.map(f => (f.followUpId === followUpId ? { ...f, status: 'Completed' as const } : f))
    );
    showToast('Follow-up marked as completed', 'success');
  };

  const uploadReport = (data: {
    patientId: string;
    reportName: string;
    reportType: MedicalReport['reportType'];
    labName: string;
    summary: string;
    findings?: string[];
  }) => {
    const targetPatient = patients.find(p => p.patientId === data.patientId) || patients[0];
    const newReport: MedicalReport = {
      reportId: `rep_${Date.now().toString().slice(-5)}`,
      patientId: data.patientId,
      patientName: targetPatient.name,
      doctorId: currentDoctorProfile.doctorId,
      doctorName: currentDoctorProfile.name,
      reportName: data.reportName,
      reportType: data.reportType,
      date: new Date().toISOString().split('T')[0],
      labName: data.labName,
      status: 'Ready',
      summary: data.summary,
      findings: data.findings || [],
    };
    setReports(prev => [newReport, ...prev]);
    showToast(`Report "${data.reportName}" uploaded for ${targetPatient.name}`, 'success');
  };

  // Store Actions
  const addMedicine = (medData: Omit<Medicine, 'medicineId' | 'storeId' | 'storeName'>) => {
    const newId = `med_${Date.now().toString().slice(-5)}`;
    const newMed: Medicine = {
      ...medData,
      medicineId: newId,
      storeId: currentStoreProfile.storeId,
      storeName: currentStoreProfile.name,
    };
    setMedicines(prev => [newMed, ...prev]);
    showToast(`Added ${newMed.name} to pharmacy inventory`, 'success');
  };

  const updateMedicine = (medicineId: string, updates: Partial<Medicine>) => {
    setMedicines(prev =>
      prev.map(m => (m.medicineId === medicineId ? { ...m, ...updates } : m))
    );
    showToast('Medicine details updated', 'success');
  };

  const deleteMedicine = (medicineId: string) => {
    const med = medicines.find(m => m.medicineId === medicineId);
    setMedicines(prev => prev.filter(m => m.medicineId !== medicineId));
    showToast(`Deleted ${med?.name || 'medicine'} from inventory`, 'info');
  };

  const updateStock = (medicineId: string, newStock: number) => {
    const validStock = Math.max(0, newStock);
    setMedicines(prev =>
      prev.map(m =>
        m.medicineId === medicineId
          ? { ...m, stock: validStock, availability: validStock > 0 }
          : m
      )
    );
    showToast(`Updated stock level to ${validStock} units`, 'success');
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev =>
      prev.map(o => (o.orderId === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Order #${orderId} marked as ${newStatus}`, 'success');
  };

  const updateStoreDetails = (updates: Partial<MedicalStore>) => {
    setStores(prev =>
      prev.map(s => (s.storeId === currentStoreProfile.storeId ? { ...s, ...updates } : s))
    );
    showToast('Pharmacy store details updated', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        setCurrentRole,
        loginAsRole,
        logout,
        isLoggedIn,
        currentPatientProfile,
        currentDoctorProfile,
        currentStoreProfile,
        patients,
        doctors,
        stores,
        medicines,
        appointments,
        prescriptions,
        reports,
        orders,
        labTests,
        bills,
        followUps,
        bookAppointment,
        cancelAppointment,
        rescheduleAppointment,
        bookLabTest,
        placeOrder,
        payBill,
        updateAppointmentStatus,
        createPrescription,
        scheduleFollowUp,
        markFollowUpCompleted,
        uploadReport,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        updateStock,
        updateOrderStatus,
        updateStoreDetails,
        isAIAssistantOpen,
        setIsAIAssistantOpen,
        activeToast,
        showToast,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
