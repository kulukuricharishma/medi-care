import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User as UserIcon,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Search,
  Calendar,
  Pill,
  Clock,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  actionButton?: {
    label: string;
    action: () => void;
  };
  timestamp: string;
}

interface AIAssistantModalProps {
  onNavigateToTab?: (tab: string) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ onNavigateToTab }) => {
  const {
    isAIAssistantOpen,
    setIsAIAssistantOpen,
    currentRole,
    currentUser,
    appointments,
    doctors,
    medicines,
    stores,
    orders,
    followUps,
    reports,
    currentPatientProfile,
    currentDoctorProfile,
    currentStoreProfile,
  } = useApp();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested prompts per role
  const suggestedPrompts = {
    patient: [
      'Find a cardiologist',
      'Show my upcoming appointments',
      'Where is Paracetamol 500mg available?',
      'Find medical stores with this medicine',
      'When is my next appointment?',
    ],
    doctor: [
      "Show today's appointments",
      'Show my pending follow-ups',
      'Show recent reports',
      'Open my patient list',
      'How many patients are scheduled today?',
    ],
    store: [
      'Show low-stock medicines',
      'How many orders are pending?',
      'Is Paracetamol available?',
      "Show today's orders",
      'List medicines needing reorder',
    ],
  };

  // Initialize welcome message when opened or role changes
  useEffect(() => {
    if (isAIAssistantOpen && messages.length === 0) {
      const welcomeTexts = {
        patient: `Hello ${currentUser.name}! I am your MediBridge Health Assistant. I can help you find specialist doctors, track your appointments, verify medicine availability across local pharmacies, and navigate your medical reports.`,
        doctor: `Welcome Dr. Sharma! I am your MediBridge Clinical Assistant. I can summarize today's appointment schedule, highlight pending follow-up consultations, and provide patient record updates.`,
        store: `Hello ${currentStoreProfile?.name || 'Pharmacy Partner'}! I am your MediBridge Inventory & Order Assistant. I can notify you of low-stock thresholds, pending patient orders, and real-time stock levels.`,
      };

      setMessages([
        {
          id: 'welcome',
          sender: 'assistant',
          text: welcomeTexts[currentRole],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [isAIAssistantOpen, currentRole, currentUser.name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Context-aware & role-enforced response generator
    setTimeout(() => {
      const response = generateAIResponse(query);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 600);
  };

  const generateAIResponse = (query: string): ChatMessage => {
    const lower = query.toLowerCase();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Enforce Safety Guardrail against medical diagnoses or prescribing
    const diagnosisKeywords = ['diagnose', 'symptom diagnosis', 'prescribe me', 'what disease do i have', 'treat my', 'cure'];
    if (diagnosisKeywords.some(k => lower.includes(k))) {
      return {
        id: `bot_${Date.now()}`,
        sender: 'assistant',
        text: `⚠️ Medical Advisory Notice:\nMediBridge AI is designed for administrative coordination and cannot diagnose conditions or prescribe pharmaceuticals independently.\n\nPlease consult one of our verified physicians for an accurate clinical assessment.`,
        actionButton: {
          label: 'Book a Doctor Consultation',
          action: () => {
            setIsAIAssistantOpen(false);
            if (onNavigateToTab) onNavigateToTab('doctors');
          },
        },
        timestamp: time,
      };
    }

    // PATIENT ROLE RESPONSES
    if (currentRole === 'patient') {
      if (lower.includes('cardiologist') || lower.includes('heart doctor')) {
        const cardiologists = doctors.filter(d => d.specialization.toLowerCase().includes('cardio'));
        const docNames = cardiologists.map(d => `${d.name} (${d.hospital}, fee: ₹${d.consultationFee})`).join('\n• ');
        return {
          id: `bot_${Date.now()}`,
          sender: 'assistant',
          text: `Found ${cardiologists.length} Cardiologist(s) on MediBridge:\n• ${docNames}\n\nDr. Ananya Rao is available Mon-Fri (10:00 AM - 03:00 PM). Would you like to view profile or book an appointment?`,
          actionButton: {
            label: 'View Cardiologists',
            action: () => {
              setIsAIAssistantOpen(false);
              if (onNavigateToTab) onNavigateToTab('doctors');
            },
          },
          timestamp: time,
        };
      }

      if (lower.includes('appointment') || lower.includes('schedule') || lower.includes('when')) {
        const pId = currentPatientProfile?.patientId || 'pat_1';
        const patientUpcoming = appointments.filter(
          a => a.patientId === pId && a.status === 'Upcoming'
        );
        if (patientUpcoming.length === 0) {
          return {
            id: `bot_${Date.now()}`,
            sender: 'assistant',
            text: `You have no upcoming appointments scheduled at this moment. You can browse our doctors to book a new consultation.`,
            actionButton: {
              label: 'Browse Doctors',
              action: () => {
                setIsAIAssistantOpen(false);
                if (onNavigateToTab) onNavigateToTab('doctors');
              },
            },
            timestamp: time,
          };
        }
        const aptList = patientUpcoming
          .map(a => `• ${a.doctorName} (${a.doctorSpecialization}) on ${a.date} at ${a.time} [${a.type}]`)
          .join('\n');
        return {
          id: `bot_${Date.now()}`,
          sender: 'assistant',
          text: `You have ${patientUpcoming.length} upcoming appointment(s):\n${aptList}`,
          actionButton: {
            label: 'Manage Appointments',
            action: () => {
              setIsAIAssistantOpen(false);
              if (onNavigateToTab) onNavigateToTab('appointments');
            },
          },
          timestamp: time,
        };
      }

      if (lower.includes('paracetamol') || lower.includes('crocin') || lower.includes('dolo')) {
        const matching = medicines.filter(
          m => m.name.toLowerCase().includes('paracetamol') || m.genericName.toLowerCase().includes('paracetamol')
        );
        const storesWithStock = matching
          .filter(m => m.stock > 0)
          .map(m => `• ${m.storeName}: ₹${m.price} (${m.stock} units available, ${m.brand})`);

        return {
          id: `bot_${Date.now()}`,
          sender: 'assistant',
          text: `Paracetamol 500mg availability near you:\n${storesWithStock.join('\n')}\n\nYou can order for direct pickup or doorstep delivery directly from the Medicines tab.`,
          actionButton: {
            label: 'Search & Order Medicines',
            action: () => {
              setIsAIAssistantOpen(false);
              if (onNavigateToTab) onNavigateToTab('medicines');
            },
          },
          timestamp: time,
        };
      }

      if (lower.includes('store') || lower.includes('pharmacy')) {
        const storeList = stores.map(s => `• ${s.name} - ${s.address} (${s.openingHours})`).join('\n');
        return {
          id: `bot_${Date.now()}`,
          sender: 'assistant',
          text: `Here are the partner pharmacies available in your area:\n${storeList}`,
          actionButton: {
            label: 'Explore Medical Stores',
            action: () => {
              setIsAIAssistantOpen(false);
              if (onNavigateToTab) onNavigateToTab('stores');
            },
          },
          timestamp: time,
        };
      }

      if (lower.includes('report') || lower.includes('lab') || lower.includes('test')) {
        const pId = currentPatientProfile?.patientId || 'pat_1';
        const patientReports = reports.filter(r => r.patientId === pId);
        return {
          id: `bot_${Date.now()}`,
          sender: 'assistant',
          text: `You have ${patientReports.length} medical reports on file. The latest is "${patientReports[0]?.reportName || 'CBC Report'}" dated ${patientReports[0]?.date || 'recently'}. All documents are securely verified.`,
          actionButton: {
            label: 'View Medical Reports',
            action: () => {
              setIsAIAssistantOpen(false);
              if (onNavigateToTab) onNavigateToTab('reports');
            },
          },
          timestamp: time,
        };
      }
    }

    // DOCTOR ROLE RESPONSES
    if (currentRole === 'doctor') {
      const docId = currentDoctorProfile?.doctorId || 'doc_1';
      if (lower.includes('today') || lower.includes('appointment') || lower.includes('schedule')) {
        const docAppts = appointments.filter(
          a => a.doctorId === docId && a.status === 'Upcoming'
        );
        const list = docAppts.map(a => `• ${a.time}: ${a.patientName} (${a.type}) - "${a.reason}"`).join('\n');
        return {
          id: `bot_${Date.now()}`,
          sender: 'assistant',
          text: `Doctor, you have ${docAppts.length} active scheduled appointments:\n${list || 'No upcoming appointments today.'}`,
          actionButton: {
            label: 'Open Appointments',
            action: () => {
              setIsAIAssistantOpen(false);
              if (onNavigateToTab) onNavigateToTab('appointments');
            },
          },
          timestamp: time,
        };
      }

      if (lower.includes('follow-up') || lower.includes('followup')) {
        const pending = followUps.filter(f => f.status === 'Scheduled');
        const list = pending.map(f => `• ${f.patientName} on ${f.date} (${f.reason})`).join('\n');
        return {
          id: `bot_${Date.now()}`,
          sender: 'assistant',
          text: `You have ${pending.length} pending follow-ups:\n${list}`,
          actionButton: {
            label: 'View Follow-ups',
            action: () => {
              setIsAIAssistantOpen(false);
              if (onNavigateToTab) onNavigateToTab('followups');
            },
          },
          timestamp: time,
        };
      }

      if (lower.includes('report') || lower.includes('lab')) {
        const recent = reports.slice(0, 3);
        const list = recent.map(r => `• ${r.patientName}: ${r.reportName} (${r.status})`).join('\n');
        return {
          id: `bot_${Date.now()}`,
          sender: 'assistant',
          text: `Recent diagnostic reports uploaded:\n${list}`,
          actionButton: {
            label: 'Review Reports',
            action: () => {
              setIsAIAssistantOpen(false);
              if (onNavigateToTab) onNavigateToTab('reports');
            },
          },
          timestamp: time,
        };
      }

      if (lower.includes('patient')) {
        return {
          id: `bot_${Date.now()}`,
          sender: 'assistant',
          text: `You have authorized access to patient health records, allergy notes, prescription histories, and consultation logs.`,
          actionButton: {
            label: 'Open Patient Directory',
            action: () => {
              setIsAIAssistantOpen(false);
              if (onNavigateToTab) onNavigateToTab('patients');
            },
          },
          timestamp: time,
        };
      }
    }

    // MEDICAL STORE ROLE RESPONSES
    if (currentRole === 'store') {
      const sId = currentStoreProfile?.storeId || 'store_1';
      const storeName = currentStoreProfile?.name || 'Your Medical Store';

      if (lower.includes('low') || lower.includes('stock') || lower.includes('reorder')) {
        const storeMeds = medicines.filter(m => m.storeId === sId);
        const lowStock = storeMeds.filter(m => m.stock < 10);
        const list = lowStock.map(m => `⚠️ ${m.name} — ${m.stock} remaining (Threshold: <10 units)`).join('\n');
        return {
          id: `bot_${Date.now()}`,
          sender: 'assistant',
          text: `Low-stock alert for ${storeName}:\n${list || 'All medicines have sufficient inventory.'}`,
          actionButton: {
            label: 'Go to Low Stock Manager',
            action: () => {
              setIsAIAssistantOpen(false);
              if (onNavigateToTab) onNavigateToTab('low-stock');
            },
          },
          timestamp: time,
        };
      }

      if (lower.includes('order') || lower.includes('pending')) {
        const storeOrders = orders.filter(o => o.storeId === sId);
        const pending = storeOrders.filter(o => o.status === 'Pending' || o.status === 'Preparing');
        const list = pending.map(o => `• Order #${o.orderId} for ${o.patientName} (₹${o.totalPrice}) - Status: ${o.status}`).join('\n');
        return {
          id: `bot_${Date.now()}`,
          sender: 'assistant',
          text: `You have ${pending.length} active order(s) requiring attention:\n${list || 'No pending orders currently.'}`,
          actionButton: {
            label: 'Process Orders',
            action: () => {
              setIsAIAssistantOpen(false);
              if (onNavigateToTab) onNavigateToTab('orders');
            },
          },
          timestamp: time,
        };
      }

      if (lower.includes('paracetamol')) {
        const med = medicines.find(
          m => m.storeId === sId && m.name.toLowerCase().includes('paracetamol')
        );
        return {
          id: `bot_${Date.now()}`,
          sender: 'assistant',
          text: med
            ? `Paracetamol in your store inventory:\n• Current Stock: ${med.stock} units\n• Price: ₹${med.price}\n• Status: ${med.stock > 0 ? (med.stock < 10 ? 'Low Stock' : 'Available') : 'Out of Stock'}`
            : `Paracetamol is not currently listed in your pharmacy inventory.`,
          actionButton: {
            label: 'Manage Inventory',
            action: () => {
              setIsAIAssistantOpen(false);
              if (onNavigateToTab) onNavigateToTab('inventory');
            },
          },
          timestamp: time,
        };
      }
    }

    // Default intelligent fallback
    return {
      id: `bot_${Date.now()}`,
      sender: 'assistant',
      text: `I've analyzed your request with respect to your ${currentRole} permissions. You can use the quick prompt chips below for fast access to your dashboard metrics, inventory status, or schedule.`,
      timestamp: time,
    };
  };

  if (!isAIAssistantOpen) {
    return (
      <button
        onClick={() => setIsAIAssistantOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 text-white rounded-full shadow-2xl hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all duration-200 group border border-white/20"
        title="Open MediBridge AI Assistant"
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 text-white animate-spin-slow" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse"></span>
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-xs font-bold leading-none">MediBridge AI</p>
          <p className="text-[10px] text-cyan-100 capitalize">{currentRole} Assistant</p>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 flex flex-col w-full sm:w-[420px] h-full sm:h-[620px] bg-white sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 text-white px-4 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-white">MediBridge AI</span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-cyan-500/30 text-cyan-300 border border-cyan-400/30">
                {currentRole}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              Live Healthcare Assistant
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAIAssistantOpen(false)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Safety Notice Banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-3 py-1.5 text-[11px] text-amber-900 flex items-start gap-1.5">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-tight">
          <strong>Advisory:</strong> AI Assistant provides workflow & data navigation only. Does not diagnose or prescribe.
        </p>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-cyan-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-cyan-600 text-white rounded-tr-none'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>

              {msg.actionButton && (
                <button
                  onClick={msg.actionButton.action}
                  className="mt-2.5 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-semibold border border-cyan-200 transition-colors text-[11px]"
                >
                  <span>{msg.actionButton.label}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}

              <span
                className={`block text-[9px] mt-1 text-right ${
                  msg.sender === 'user' ? 'text-cyan-200' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                <UserIcon className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-2 items-center text-slate-400 text-xs">
            <div className="w-7 h-7 rounded-lg bg-cyan-600 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 px-3 py-2 rounded-2xl rounded-tl-none flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts carousel */}
      <div className="p-2 bg-white border-t border-slate-100">
        <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 px-1">
          Suggested for {currentRole}:
        </p>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {suggestedPrompts[currentRole].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-cyan-50 hover:text-cyan-700 hover:border-cyan-200 border border-slate-200 text-slate-700 transition-colors shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={`Ask about ${currentRole === 'patient' ? 'doctors, medicines...' : currentRole === 'doctor' ? 'patients, follow-ups...' : 'stock, orders...'}`}
          className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white transition-colors shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
