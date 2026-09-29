import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  User,
  Stethoscope,
  Store,
  Calendar,
  FileText,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Clock,
  HeartPulse,
  Activity,
  Layers,
  MapPin,
  Pill,
  Send,
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'register', role?: UserRole) => void;
  onNavigateToDashboard: (role: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, onNavigateToDashboard }) => {
  const { loginAsRole, currentRole, isLoggedIn } = useApp();

  const handleSelectRole = (role: UserRole) => {
    loginAsRole(role);
    onNavigateToDashboard(role);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cyan-50/70 via-white to-slate-50 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-100/70 text-cyan-800 text-xs font-semibold mb-6 border border-cyan-200 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              <span>Next-Generation Connected Healthcare Ecosystem</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Connecting Patients, Doctors &amp; Medicines
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              MediBridge AI brings patients, healthcare professionals, and medical stores together on one intelligent healthcare platform.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => onOpenAuth('register')}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-cyan-600/25 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenAuth('login')}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-xs transition-all"
              >
                Login
              </button>
            </div>

            {/* Quick Demo Switcher Prompts */}
            <p className="mt-4 text-xs text-slate-400">
              ⚡ Instant prototype exploration: Click any role card below to test its dedicated dashboard.
            </p>
          </div>

          {/* Three Role Cards */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {/* Patient Card */}
            <div
              onClick={() => handleSelectRole('patient')}
              className="group bg-white rounded-2xl p-7 border border-slate-200/80 shadow-md hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-xs">
                  <User className="w-7 h-7" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-slate-900">Patient</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    Portal
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Find care, manage appointments and access your healthcare information.
                </p>
                <ul className="mt-5 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>Search verified doctors &amp; book slots</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>Instant access to prescriptions &amp; reports</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>Live medicine stock search at nearby stores</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-blue-600 font-semibold text-xs group-hover:translate-x-1 transition-transform">
                <span>Enter Patient Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Doctor Card */}
            <div
              onClick={() => handleSelectRole('doctor')}
              className="group bg-white rounded-2xl p-7 border border-slate-200/80 shadow-md hover:shadow-xl hover:border-emerald-300 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-xs">
                  <Stethoscope className="w-7 h-7" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-slate-900">Doctor</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Portal
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Manage patients, appointments, prescriptions and follow-ups.
                </p>
                <ul className="mt-5 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Real-time appointment schedule &amp; triage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Digital prescription builder with auto-sync</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Patient history, lab review &amp; follow-ups</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-emerald-600 font-semibold text-xs group-hover:translate-x-1 transition-transform">
                <span>Enter Doctor Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Medical Store Card */}
            <div
              onClick={() => handleSelectRole('store')}
              className="group bg-white rounded-2xl p-7 border border-slate-200/80 shadow-md hover:shadow-xl hover:border-amber-300 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-6 group-hover:bg-amber-600 group-hover:text-white transition-colors shadow-xs">
                  <Store className="w-7 h-7" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-slate-900">Medical Store</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    Portal
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Manage medicines, inventory, availability and orders.
                </p>
                <ul className="mt-5 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Live inventory tracker with low-stock alerts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Direct patient orders workflow &amp; fulfillment</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Price adjustments &amp; availability switches</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-amber-600 font-semibold text-xs group-hover:translate-x-1 transition-transform">
                <span>Enter Store Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-Role Interactive Triangle Flow */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs uppercase font-bold tracking-widest text-cyan-600 mb-2">
              Cross-Platform Synergy
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              How the Three Roles Harmonize
            </h3>
            <p className="mt-3 text-sm text-slate-600">
              Unlike fragmented healthcare apps, MediBridge connects data across all touchpoints in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-2">Workflow 1</span>
                <h4 className="font-bold text-slate-900 text-base mb-2">Patient ➔ Doctor</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Patient filters specialists, picks a time slot, and reserves an appointment. The Doctor receives the booking instantly, conducts the consultation, and uploads digital prescriptions directly into the patient's record.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-2 text-xs font-semibold text-slate-700">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>Unified appointments &amp; e-prescriptions</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-2">Workflow 2</span>
                <h4 className="font-bold text-slate-900 text-base mb-2">Patient ➔ Medical Store</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Patient searches for prescribed medicines (e.g., Paracetamol or Azithromycin), sees live inventory at nearby pharmacies, compares prices, and places an order for doorstep delivery or rapid counter pickup.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-2 text-xs font-semibold text-slate-700">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                <span>Live pharmacy stock &amp; order fulfillment</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-2">Workflow 3</span>
                <h4 className="font-bold text-slate-900 text-base mb-2">Medical Store ➔ Patient</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pharmacies update stock counts and prices in seconds. Low stock warnings prevent shortages, and status transitions (Pending → Preparing → Ready) notify patients dynamically on their bills and orders screen.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-2 text-xs font-semibold text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Transparent billing &amp; inventory balance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs uppercase font-bold tracking-widest text-cyan-600 mb-2">
              Capabilities
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Engineered for Modern Healthcare Operations
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1.5">Intelligent Scheduling</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Smart booking slots with automatic conflict resolution, in-person and tele-consultation options, and doctor availability calendars.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1.5">Digital Prescriptions</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Standardized dosage formulations, frequency, and instructions that sync automatically with patient records and partner pharmacies.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-4">
                <Pill className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1.5">Live Medicine Radar</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Check exact quantities and unit prices for brands and generic compounds across accredited local medical stores.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <Activity className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1.5">Diagnostic &amp; Lab Reports</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Secure repository for blood tests, ECGs, and scans. Doctors and patients view results with clinical reference ranges.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1.5">MediBridge AI Assistant</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Natural-language triage and navigation assistant that adapts to role permissions while observing strict ethical health boundaries.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1.5">HIPAA-Grade Security</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Strict role-based access control ensuring doctors only see authorized patient records and pharmacies only receive verified orders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 text-xs font-semibold mb-3">
                <HeartPulse className="w-3.5 h-3.5 text-cyan-600" />
                <span>Our Healthcare Mission</span>
              </div>
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                Bridging the Gap Between Clinical Consultation and Pharmacy Access
              </h3>
              <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                In traditional healthcare, patients leave clinic appointments with paper slips, search aimlessly for pharmacies with stock, and struggle to manage scattered diagnostic tests.
              </p>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                MediBridge AI fixes this by uniting all three parties into an interconnected digital loop. Every appointment booked, prescription written, or inventory update flows directly to the relevant dashboard.
              </p>

              <div className="mt-6 grid grid-cols-3 gap-4 border-t border-slate-100 pt-6">
                <div>
                  <p className="text-2xl font-black text-cyan-600">300+</p>
                  <p className="text-xs text-slate-500 font-medium">Partner Doctors</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-cyan-600">120+</p>
                  <p className="text-xs text-slate-500 font-medium">Verified Pharmacies</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-cyan-600">99.8%</p>
                  <p className="text-xs text-slate-500 font-medium">Appointment Reliability</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-tr from-cyan-900 via-slate-900 to-teal-900 p-8 rounded-3xl text-white shadow-xl">
              <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                The MediBridge AI Principle
              </h4>
              <div className="space-y-4 text-xs text-slate-300">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <strong className="text-white block mb-1">1. Patient = Gets Healthcare</strong>
                  One unified portal to search certified specialists, schedule visits, inspect medical records, compare medication pricing, and order doorstep refills.
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <strong className="text-white block mb-1">2. Doctor = Provides Healthcare</strong>
                  A streamlined clinical cockpit to view queues, author e-prescriptions, track patient recovery trajectories, and schedule follow-ups.
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <strong className="text-white block mb-1">3. Medical Store = Provides Medicines</strong>
                  Real-time inventory intelligence, dynamic price management, low-stock threshold triggers, and fulfillment pipelines for prescription orders.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xs uppercase font-bold tracking-widest text-cyan-600 mb-2">
              Contact &amp; Inquiries
            </h2>
            <h3 className="text-2xl font-bold text-slate-900">
              Connect with the MediBridge Network
            </h3>
            <p className="text-xs text-slate-600 mt-2">
              Whether you are a hospital administrator, practicing physician, or pharmacy director, our team is ready to assist.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <form
              onSubmit={e => {
                e.preventDefault();
                alert('Thank you! Your message has been received by our clinical partnerships team.');
              }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Kumar"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="rajesh@hospital.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Organization / Role</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white">
                  <option>Independent Patient / General Inquiry</option>
                  <option>Medical Practitioner / Clinic</option>
                  <option>Retail Pharmacy / Chain Store</option>
                  <option>Hospital System Integration</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Message</label>
                <textarea
                  rows={3}
                  required
                  placeholder="How can MediBridge AI support your healthcare workflow?"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                ></textarea>
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-teal-500 flex items-center justify-center text-white">
                <Activity className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-white">
                MediBridge<span className="text-cyan-400">.AI</span>
              </span>
            </div>

            <div className="flex flex-wrap gap-6 text-slate-300">
              <button onClick={() => handleSelectRole('patient')} className="hover:text-cyan-400 transition-colors">
                Patient Portal
              </button>
              <button onClick={() => handleSelectRole('doctor')} className="hover:text-cyan-400 transition-colors">
                Doctor Portal
              </button>
              <button onClick={() => handleSelectRole('store')} className="hover:text-cyan-400 transition-colors">
                Medical Store Portal
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} MediBridge AI. All rights reserved. Professional Healthcare SaaS.</p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              All sample records, doctors &amp; pharmacies are interactive demo data.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
