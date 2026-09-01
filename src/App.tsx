/**
 * CareTrace Intelligence - Command Center Application
 * Detect. Explain. Simulate. Act.
 */

import React, { useState, useEffect } from 'react';
import { PATIENTS_DATA, calculateSimulatedRisk } from './data/patients';
import { fetchPatientsFromBackend } from './services/api';
import { Patient, ActiveNavTab, JourneyStep } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { PatientRiskCard } from './components/PatientRiskCard';
import { WhyRiskCard } from './components/WhyRiskCard';
import { ActionCenter } from './components/ActionCenter';
import { SimulatedRiskTrend } from './components/SimulatedRiskTrend';
import { QueueView } from './components/QueueView';
import { AnalyticsView } from './components/AnalyticsView';
import { PatientDirectoryView } from './components/PatientDirectoryView';
import { RiskAlertsView } from './components/RiskAlertsView';
import { StaffingView } from './components/StaffingView';
import { 
  ScheduleFollowupModal, 
  SendReminderModal, 
  ContactPatientModal, 
  EmergencyAlertModal 
} from './components/modals/ActionModals';
import { ProtocolGuideModal, SettingsModal } from './components/modals/InfoModals';
import { AddPatientModal } from './components/modals/AddPatientModal';
import { Toast, ToastMessage } from './components/Toast';

export default function App() {
  // 1. Patient & Navigation State
  const [patients, setPatients] = useState<Patient[]>(PATIENTS_DATA);
  const [selectedPatient, setSelectedPatient] = useState<Patient>(PATIENTS_DATA[0]); // Default: Sarah Jenkins P-1042
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('dashboard');
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true);
  const [isLoadingBackend, setIsLoadingBackend] = useState<boolean>(true);

  // 2. What-If Intervention Simulation State (Defaults to recommended demo scenario: missed from 4 -> 2, yielding 87 -> 68)
  const [whatIfMissed, setWhatIfMissed] = useState<number>(2);
  const [transportSupport, setTransportSupport] = useState<boolean>(false);
  const [telehealthEnroll, setTelehealthEnroll] = useState<boolean>(false);

  // 3. Modal States
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isProtocolOpen, setIsProtocolOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Add toast helper
  const addToast = (text: string, type: 'success' | 'alert' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Re-fetch or update patient state when new patient is saved
  const handlePatientAdded = async (newPatientRaw: any) => {
    setIsLoadingBackend(true);
    const result = await fetchPatientsFromBackend();
    setIsLoadingBackend(false);

    if (result.patients && result.patients.length > 0) {
      setPatients(result.patients);
      // Select the newly added patient
      const newOne = result.patients.find(
        (p) => p.id.toLowerCase() === (newPatientRaw.patient_id || newPatientRaw.id || '').toLowerCase()
      );
      if (newOne) {
        handleSelectPatient(newOne);
      }
    }
    addToast(`PATIENT SAVED: ${newPatientRaw.name} (${newPatientRaw.patient_id}) enrolled.`, 'success');
  };

  // Fetch backend patients on startup
  useEffect(() => {
    let isMounted = true;
    async function loadPatients() {
      setIsLoadingBackend(true);
      const result = await fetchPatientsFromBackend();
      if (!isMounted) return;
      setIsLoadingBackend(false);
      setIsBackendConnected(result.isFromBackend);

      if (result.patients && result.patients.length > 0) {
        setPatients(result.patients);
        // Find Sarah Jenkins (P-1042) or default to highest risk patient
        const sarahOrTop = result.patients.find((p) => p.id === 'P-1042') || result.patients[0];
        setSelectedPatient(sarahOrTop);
        if (sarahOrTop.id === 'P-1042') {
          setWhatIfMissed(2); // Retain approved judge storyline 87 -> 68
        } else {
          setWhatIfMissed(sarahOrTop.missedAppointments);
        }
      }

      if (result.isFromBackend) {
        addToast('Connected to Google Sheets live backend', 'success');
      } else if (result.error) {
        addToast('Google Sheets backend unreachable, loaded local cache', 'info');
      }
    }

    loadPatients();
    return () => {
      isMounted = false;
    };
  }, []);

  // Patient Selection Handler (Resets What-If sliders to that patient's baseline)
  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setWhatIfMissed(patient.missedAppointments);
    setTransportSupport(false);
    setTelehealthEnroll(false);
    addToast(`Loaded focus record: ${patient.name} (${patient.id})`, 'info');
  };

  // Reset Scenario Handler
  const handleResetWhatIf = () => {
    setWhatIfMissed(selectedPatient.missedAppointments);
    setTransportSupport(false);
    setTelehealthEnroll(false);
    addToast(`Reset scenario to original baseline for ${selectedPatient.name}`, 'info');
  };

  // Dynamic calculation for the currently selected patient & What-If state
  const { projectedRisk, improvement } = calculateSimulatedRisk(
    selectedPatient,
    whatIfMissed,
    transportSupport,
    telehealthEnroll
  );

  const isSimulated =
    whatIfMissed !== selectedPatient.missedAppointments ||
    transportSupport ||
    telehealthEnroll;

  const highRiskCount = patients.filter((p) => p.riskLevel === 'HIGH' || p.simulatedRisk >= 70).length;

  return (
    <div className="bg-[#0B132B] text-[#F8FAFC] min-h-screen flex font-sans overflow-x-hidden selection:bg-[#22D3EE]/30 selection:text-[#22D3EE]">
      {/* 1. Side Navigation Bar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onEmergencyAlert={() => setIsEmergencyOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSupport={() => setIsProtocolOpen(true)}
        highRiskCount={highRiskCount}
        patientCount={patients.length}
        alertsCount={isBackendConnected ? 4 : 5}
      />

      {/* 2. Top App Bar */}
      <Header
        patients={patients}
        selectedPatient={selectedPatient}
        onSelectPatient={handleSelectPatient}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isBackendConnected={isBackendConnected}
        isLoadingBackend={isLoadingBackend}
        onToggleNotificationDrawer={() => {
          setActiveTab('alerts');
          addToast('Navigated to live Risk Alerts triage feed', 'alert');
        }}
      />

      {/* 3. Main Content Canvas */}
      <main
        id="main-app-content"
        className="ml-20 lg:ml-64 mt-16 p-3 sm:p-5 lg:p-6 w-[calc(100%-5rem)] lg:w-[calc(100%-16rem)] min-h-[calc(100vh-4rem)] flex flex-col gap-4 overflow-y-auto"
      >
        {/* ================= VIEW 1: MAIN DASHBOARD (16:9 Clinical Command Center) ================= */}
        {activeTab === 'dashboard' && (
          <div className="flex flex-col gap-3.5 flex-1">
            {/* Quick 10-Second Judge Comprehension Storyline Banner */}
            <div className="bg-[#162238] border border-[#2B3A55] rounded-lg px-4 py-2.5 flex flex-col md:flex-row items-center justify-between gap-2 shadow-sm font-mono">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-ping shrink-0" />
                <span className="font-bold text-white uppercase tracking-wider text-xs">
                  Clinical Decision-Support Pipeline:
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#CBD5E1] uppercase font-bold">
                <span className="px-2.5 py-1 rounded bg-[#101B2E] border border-[#2B3A55] text-[#22D3EE]">
                  1. DETECT RISK
                </span>
                <span className="text-[#64748B]">→</span>
                <span className="px-2.5 py-1 rounded bg-[#101B2E] border border-[#2B3A55] text-white">
                  2. EXPLAIN WHY
                </span>
                <span className="text-[#64748B]">→</span>
                <span className="px-2.5 py-1 rounded bg-[#101B2E] border border-[#2B3A55] text-[#FBBF24]">
                  3. SIMULATE WHAT-IF
                </span>
                <span className="text-[#64748B]">→</span>
                <span className="px-2.5 py-1 rounded bg-[#101B2E] border border-[#2B3A55] text-[#34D399]">
                  4. TAKE ACTION
                </span>
              </div>
              <div className="hidden xl:flex items-center gap-2 text-[11px] text-[#94A3B8] uppercase">
                <span>FOCUS: <strong className="text-[#22D3EE]">{selectedPatient.name}</strong></span>
                <span>•</span>
                <span>RISK: <strong className="text-[#FF5C5C]">{selectedPatient.simulatedRisk}/100</strong></span>
              </div>
            </div>

            {/* Top 3-Column Command Grid (Left: Patient + Risk, Center: Why At Risk?, Right: What-If + Action) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
              {/* LEFT COLUMN: PATIENT + RISK & JOURNEY */}
              <section id="column-patient-risk" className="flex flex-col h-full">
                <PatientRiskCard
                  patient={selectedPatient}
                  patients={patients}
                  onSelectPatient={handleSelectPatient}
                  onStepClick={(step: JourneyStep) => {
                    addToast(`Journey milestone: ${step.title} (${step.detail})`, 'info');
                  }}
                />
              </section>

              {/* CENTER COLUMN: WHY IS THIS PATIENT AT RISK? */}
              <section id="column-why-at-risk" className="flex flex-col h-full">
                <WhyRiskCard patient={selectedPatient} />
              </section>

              {/* RIGHT COLUMN: WHAT-IF INTERVENTION & ACTION */}
              <section id="column-whatif-action" className="flex flex-col h-full">
                <ActionCenter
                  patients={patients}
                  selectedPatient={selectedPatient}
                  onSelectPatient={handleSelectPatient}
                  onScheduleFollowup={() => setIsScheduleOpen(true)}
                  onSendReminder={() => setIsReminderOpen(true)}
                  onContactPatient={() => setIsContactOpen(true)}
                  whatIfMissed={whatIfMissed}
                  setWhatIfMissed={setWhatIfMissed}
                  transportSupport={transportSupport}
                  setTransportSupport={setTransportSupport}
                  telehealthEnroll={telehealthEnroll}
                  setTelehealthEnroll={setTelehealthEnroll}
                  onResetWhatIf={handleResetWhatIf}
                />
              </section>
            </div>

            {/* Bottom Row: Simulated Risk Trajectory & Intervention Horizon */}
            <div className="w-full">
              <SimulatedRiskTrend
                patient={selectedPatient}
                projectedRisk={projectedRisk}
                isSimulated={isSimulated}
              />
            </div>
          </div>
        )}

        {/* ================= VIEW 2: FULL PRIORITY QUEUE ================= */}
        {activeTab === 'queue' && (
          <QueueView
            patients={patients}
            selectedPatient={selectedPatient}
            onSelectPatient={(p) => {
              handleSelectPatient(p);
              setActiveTab('dashboard');
            }}
            onScheduleFollowup={(p) => {
              setSelectedPatient(p);
              setIsScheduleOpen(true);
            }}
            onSendReminder={(p) => {
              setSelectedPatient(p);
              setIsReminderOpen(true);
            }}
            onContactPatient={(p) => {
              setSelectedPatient(p);
              setIsContactOpen(true);
            }}
          />
        )}

        {/* ================= VIEW 3: COHORT ANALYTICS ================= */}
        {activeTab === 'analytics' && (
          <AnalyticsView
            patients={patients}
            onSelectPatient={(p) => {
              handleSelectPatient(p);
              setActiveTab('dashboard');
            }}
          />
        )}

        {/* ================= VIEW 4: PATIENTS ROSTER DIRECTORY ================= */}
        {activeTab === 'patients' && (
          <PatientDirectoryView
            patients={patients}
            selectedPatient={selectedPatient}
            onSelectPatient={(p) => {
              handleSelectPatient(p);
              setActiveTab('dashboard');
            }}
            onOpenFollowup={(p) => {
              setSelectedPatient(p);
              setIsScheduleOpen(true);
            }}
          />
        )}

        {/* ================= VIEW 5: CLINICAL RISK ALERTS ================= */}
        {activeTab === 'alerts' && (
          <RiskAlertsView
            patients={patients}
            selectedPatient={selectedPatient}
            onSelectPatient={(p) => {
              handleSelectPatient(p);
              setActiveTab('dashboard');
            }}
            onScheduleFollowup={(p) => {
              setSelectedPatient(p);
              setIsScheduleOpen(true);
            }}
            onSendReminder={(p) => {
              setSelectedPatient(p);
              setIsReminderOpen(true);
            }}
            onContactPatient={(p) => {
              setSelectedPatient(p);
              setIsContactOpen(true);
            }}
          />
        )}

        {/* ================= VIEW 6: CARE TEAM STAFFING ================= */}
        {activeTab === 'staffing' && (
          <StaffingView
            patients={patients}
            onSelectPatient={(p) => {
              handleSelectPatient(p);
              setActiveTab('dashboard');
            }}
          />
        )}
      </main>

      {/* 4. Action & Alert Modal Dialogs */}
      <ScheduleFollowupModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        patient={selectedPatient}
        onSuccess={(msg) => addToast(msg, 'success')}
      />

      <SendReminderModal
        isOpen={isReminderOpen}
        onClose={() => setIsReminderOpen(false)}
        patient={selectedPatient}
        onSuccess={(msg) => addToast(msg, 'success')}
      />

      <ContactPatientModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        patient={selectedPatient}
        onSuccess={(msg) => addToast(msg, 'success')}
      />

      <EmergencyAlertModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        patient={selectedPatient}
        onSuccess={(msg) => addToast(msg, 'alert')}
      />

      <ProtocolGuideModal
        isOpen={isProtocolOpen}
        onClose={() => setIsProtocolOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSuccess={(msg) => addToast(msg, 'success')}
      />

      {/* 5. Floating Toast Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
