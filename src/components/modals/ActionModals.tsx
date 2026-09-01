import React, { useState } from 'react';
import { Patient, JourneyStep } from '../../types';
import { sendActionToBackend } from '../../services/api';
import { 
  X, 
  Calendar, 
  Clock, 
  Send, 
  PhoneCall, 
  Video, 
  Car, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  User, 
  FileText, 
  MessageSquare,
  ShieldCheck,
  Building2,
  HelpCircle,
  Settings
} from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onSuccess: (message: string) => void;
}

/**
 * 1. SCHEDULE FOLLOW-UP MODAL
 */
export const ScheduleFollowupModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  patient,
  onSuccess,
}) => {
  const [selectedDate, setSelectedDate] = useState('2024-11-18');
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [provider, setProvider] = useState('Dr. Marcus Vance (Cardiology)');
  const [includeTransport, setIncludeTransport] = useState(true);
  const [includeReminder, setIncludeReminder] = useState(true);
  const [notes, setNotes] = useState(
    `Follow-up visit prioritized due to recent missed appointment and ${patient.primaryRiskReason}.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await sendActionToBackend({
      actionType: 'schedule_followup',
      patientId: patient.id,
      patientName: patient.name,
      details: {
        date: selectedDate,
        time: selectedTime,
        provider,
        transport: includeTransport,
        reminder: includeReminder,
      },
    });
    setIsSubmitting(false);
    onSuccess(res.message || `Follow-up scheduled for ${patient.name} on ${selectedDate} at ${selectedTime}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0D1B2A] border border-[#1E293B] rounded-lg w-full max-w-lg shadow-2xl overflow-hidden border-t-2 border-t-[#22D3EE]">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#1E293B] flex items-center justify-between bg-[#07111F]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#22D3EE]/20 border border-[#22D3EE]/40 flex items-center justify-center text-[#22D3EE]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#F8FAFC] uppercase tracking-wider">Schedule Clinical Follow-up</h3>
              <p className="text-[10px] font-mono text-[#94A3B8]">
                {patient.name} ({patient.id}) • {patient.pathway}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-white p-1 rounded hover:bg-[#1E293B] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono text-[#94A3B8] uppercase mb-1">
                Target Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-[#07111F] border border-[#1E293B] rounded px-3 py-1.5 text-xs text-[#F8FAFC] font-mono focus:border-[#22D3EE] outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[#94A3B8] uppercase mb-1">
                Time Window
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full bg-[#07111F] border border-[#1E293B] rounded px-3 py-1.5 text-xs text-[#F8FAFC] font-mono focus:border-[#22D3EE] outline-none"
              >
                <option>09:00 AM (Morning Slot)</option>
                <option>10:30 AM (Preferred)</option>
                <option>01:30 PM (Afternoon Slot)</option>
                <option>03:45 PM (Late Slot)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-[#94A3B8] uppercase mb-1">
              Assigned Provider / Clinic
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full bg-[#07111F] border border-[#1E293B] rounded px-3 py-1.5 text-xs text-[#F8FAFC] font-mono focus:border-[#22D3EE] outline-none"
            >
              <option>Dr. Marcus Vance — Heart & Vascular Clinic</option>
              <option>Dr. Sharon Liu — Pulmonary Care Center</option>
              <option>Nurse Practitioner Clinic — Rapid Access</option>
              <option>Virtual Outpatient Telehealth Hub</option>
            </select>
          </div>

          {/* Social Determinants & Logistics Assistance */}
          <div className="bg-[#07111F] p-3 rounded border border-[#1E293B] space-y-2">
            <span className="text-[9px] font-mono text-[#22D3EE] uppercase font-bold tracking-wider block">
              Automated Support Integrations
            </span>
            <label className="flex items-center gap-2 text-xs text-[#F8FAFC] cursor-pointer">
              <input
                type="checkbox"
                checked={includeTransport}
                onChange={(e) => setIncludeTransport(e.target.checked)}
                className="rounded text-[#22D3EE] focus:ring-0 bg-transparent border-[#1E293B]"
              />
              <span className="flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-[#22D3EE]" />
                Dispatch Ride Voucher (Addresses {patient.distanceMiles} mi distance barrier)
              </span>
            </label>

            <label className="flex items-center gap-2 text-xs text-[#F8FAFC] cursor-pointer">
              <input
                type="checkbox"
                checked={includeReminder}
                onChange={(e) => setIncludeReminder(e.target.checked)}
                className="rounded text-[#22D3EE] focus:ring-0 bg-transparent border-[#1E293B]"
              />
              <span>Send multi-channel SMS + Automated Phone Reminder 48h prior</span>
            </label>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-[#94A3B8] uppercase mb-1">
              Clinical Context Note
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#07111F] border border-[#1E293B] rounded p-2.5 text-xs text-[#F8FAFC] font-sans resize-none focus:border-[#22D3EE] outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex justify-end gap-2 border-t border-[#1E293B]">
            <button
              type="button"
              onClick={onClose}
              className="bg-[#07111F] border border-[#1E293B] px-3 py-1.5 rounded text-[10px] font-mono text-[#94A3B8] hover:text-white uppercase cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#22D3EE] text-[#07111F] px-4 py-1.5 rounded font-mono text-[10px] font-bold hover:bg-[#22D3EE]/90 transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
            >
              {isSubmitting ? (
                <span>DISPATCHING...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#07111F]" />
                  <span>CONFIRM & DISPATCH</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * 2. SEND REMINDER MODAL
 */
export const SendReminderModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  patient,
  onSuccess,
}) => {
  const [channel, setChannel] = useState<'sms' | 'email' | 'voice'>('sms');
  const [template, setTemplate] = useState(
    `Hello ${patient.name}, this is CareTrace Health with your care team. We noticed you missed your recent follow-up visit. Please reply 'YES' to receive a free transportation pass or reschedule your check-in.`
  );
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSend = async () => {
    setIsSending(true);
    const res = await sendActionToBackend({
      actionType: 'send_reminder',
      patientId: patient.id,
      patientName: patient.name,
      details: {
        channel,
        template,
      },
    });
    setIsSending(false);
    onSuccess(res.message || `Reminder successfully sent to ${patient.name} via ${channel.toUpperCase()}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0D1B2A] border border-[#1E293B] rounded-lg w-full max-w-lg shadow-2xl overflow-hidden border-t-2 border-t-[#22D3EE]">
        <div className="p-4 border-b border-[#1E293B] flex items-center justify-between bg-[#07111F]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#22D3EE]/20 border border-[#22D3EE]/40 flex items-center justify-center text-[#22D3EE]">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#F8FAFC] uppercase tracking-wider">Send Automated Reminder</h3>
              <p className="text-[10px] font-mono text-[#94A3B8]">
                Recipient: {patient.name} ({patient.contactNumber})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-white p-1 rounded hover:bg-[#1E293B] cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3.5">
          {/* Channel Tabs */}
          <div>
            <label className="block text-[10px] font-mono text-[#94A3B8] uppercase mb-1.5">
              Dispatch Channel
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'sms' as const, label: 'SMS TEXT', icon: MessageSquare },
                { id: 'voice' as const, label: 'VOICE CALL', icon: PhoneCall },
                { id: 'email' as const, label: 'SECURE EMAIL', icon: Send },
              ].map((c) => {
                const Icon = c.icon;
                const active = channel === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setChannel(c.id)}
                    className={`p-2 rounded font-mono text-[10px] border transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase ${
                      active
                        ? 'bg-[#22D3EE]/20 border-[#22D3EE] text-[#22D3EE] font-bold'
                        : 'bg-[#07111F] border-[#1E293B] text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Template Content */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-mono text-[#94A3B8] uppercase">
                Message Preview
              </label>
              <span className="text-[9px] font-mono text-[#22D3EE] uppercase">Tokenized</span>
            </div>
            <textarea
              rows={4}
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full bg-[#07111F] border border-[#1E293B] rounded p-2.5 text-xs text-[#F8FAFC] font-sans resize-none focus:border-[#22D3EE] outline-none"
            />
          </div>

          <div className="bg-[#07111F] p-2.5 rounded border border-[#1E293B] text-[10px] font-mono text-[#94A3B8] flex items-center justify-between uppercase">
            <span>Estimated Delivery: Instant</span>
            <span className="text-[#34D399] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Carrier Verified
            </span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex justify-end gap-2 border-t border-[#1E293B]">
            <button
              onClick={onClose}
              className="bg-[#07111F] border border-[#1E293B] px-3 py-1.5 rounded text-[10px] font-mono text-[#94A3B8] hover:text-white uppercase cursor-pointer"
            >
              CANCEL
            </button>
            <button
              onClick={handleSend}
              disabled={isSending}
              className="bg-[#22D3EE] text-[#07111F] px-4 py-1.5 rounded font-mono text-[10px] font-bold hover:bg-[#22D3EE]/90 transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
            >
              {isSending ? (
                <span>SENDING...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-[#07111F]" />
                  <span>TRANSMIT REMINDER</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 3. CONTACT PATIENT MODAL
 */
export const ContactPatientModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  patient,
  onSuccess,
}) => {
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected'>('idle');
  const [isLogging, setIsLogging] = useState(false);

  if (!isOpen) return null;

  const startSimulatedCall = () => {
    setCallStatus('calling');
    setTimeout(() => {
      setCallStatus('connected');
    }, 1200);
  };

  const handleLogCall = async () => {
    setIsLogging(true);
    const res = await sendActionToBackend({
      actionType: 'contact_lead',
      patientId: patient.id,
      patientName: patient.name,
      details: {
        callStatus,
        contactNumber: patient.contactNumber,
      },
    });
    setIsLogging(false);
    onSuccess(res.message || `Outreach logged for ${patient.name}. Follow-up window updated.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0D1B2A] border border-[#1E293B] rounded-lg w-full max-w-lg shadow-2xl overflow-hidden border-t-2 border-t-[#22D3EE]">
        <div className="p-4 border-b border-[#1E293B] flex items-center justify-between bg-[#07111F]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#22D3EE]/20 border border-[#22D3EE]/40 flex items-center justify-center text-[#22D3EE]">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#F8FAFC] uppercase tracking-wider">Direct Clinical Contact</h3>
              <p className="text-[10px] font-mono text-[#94A3B8]">{patient.name} • {patient.contactNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-white p-1 rounded hover:bg-[#1E293B] cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3.5">
          {/* Simulated Dialer Status */}
          <div className="bg-[#07111F] p-4 rounded border border-[#1E293B] text-center">
            {callStatus === 'idle' && (
              <div>
                <div className="text-[10px] text-[#94A3B8] font-mono mb-1 uppercase tracking-wider">Secure SIP Line</div>
                <div className="text-lg font-bold font-mono text-[#F8FAFC] mb-3">{patient.contactNumber}</div>
                <div className="flex justify-center gap-2.5">
                  <button
                    onClick={startSimulatedCall}
                    className="bg-[#22D3EE] text-[#07111F] px-3.5 py-1.5 rounded font-mono text-[10px] font-bold hover:bg-[#22D3EE]/90 flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> START DIALER
                  </button>
                  <button
                    onClick={() => {
                      onSuccess(`Telehealth secure room generated: https://telehealth.caretrace.internal/room/${patient.id}`);
                      onClose();
                    }}
                    className="bg-[#0D1B2A] border border-[#1E293B] text-[#22D3EE] px-3.5 py-1.5 rounded font-mono text-[10px] font-bold hover:bg-[#1E293B] flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
                  >
                    <Video className="w-3.5 h-3.5" /> LAUNCH VIDEO ROOM
                  </button>
                </div>
              </div>
            )}

            {callStatus === 'calling' && (
              <div className="py-3 space-y-2">
                <div className="w-8 h-8 rounded-full bg-[#22D3EE]/20 border border-[#22D3EE] flex items-center justify-center mx-auto text-[#22D3EE] pulse-ring">
                  <PhoneCall className="w-4 h-4 animate-pulse" />
                </div>
                <div className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider">Connecting to Patient Line...</div>
                <div className="text-[10px] font-mono text-[#94A3B8]">{patient.contactNumber}</div>
              </div>
            )}

            {callStatus === 'connected' && (
              <div className="py-2 space-y-1.5">
                <div className="inline-flex items-center gap-2 bg-[#34D399]/20 text-[#34D399] px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-ping" />
                  CONNECTED (00:34)
                </div>
                <div className="text-xs text-[#F8FAFC]">
                  Speaking with <span className="font-semibold">{patient.name}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Outreach Checklist */}
          <div className="space-y-1 text-[10px] font-mono text-[#94A3B8] uppercase">
            <div className="text-[#22D3EE] font-bold">Recommended Protocol:</div>
            <div className="flex items-center gap-2">✓ Assess transportation availability for clinic visit</div>
            <div className="flex items-center gap-2">✓ Inquire about current symptoms or medication refill needs</div>
            <div className="flex items-center gap-2">✓ Re-confirm scheduled appointment time</div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex justify-end gap-2 border-t border-[#1E293B]">
            <button
              onClick={onClose}
              className="bg-[#07111F] border border-[#1E293B] px-3 py-1.5 rounded text-[10px] font-mono text-[#94A3B8] hover:text-white uppercase cursor-pointer"
            >
              CANCEL
            </button>
            <button
              onClick={handleLogCall}
              disabled={isLogging}
              className="bg-[#22D3EE] text-[#07111F] px-4 py-1.5 rounded font-mono text-[10px] font-bold hover:bg-[#22D3EE]/90 transition-all cursor-pointer uppercase tracking-wider disabled:opacity-50"
            >
              {isLogging ? 'LOGGING...' : 'LOG OUTREACH COMPLETE'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 4. EMERGENCY ALERT MODAL
 */
export const EmergencyAlertModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onSuccess: (msg: string) => void;
}> = ({ isOpen, onClose, patient, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleDispatchEmergency = async () => {
    setIsSubmitting(true);
    const res = await sendActionToBackend({
      actionType: 'save_intervention',
      patientId: patient.id,
      patientName: patient.name,
      details: {
        alertType: 'emergency_rapid_triage',
        simulatedRisk: patient.simulatedRisk,
        reason: patient.primaryRiskReason,
      },
    });
    setIsSubmitting(false);
    onSuccess(res.message || `EMERGENCY ALERT: Rapid response nurse dispatched for ${patient.name} (${patient.id})!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0D1B2A] border border-[#FF5C5C] rounded-lg w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-4 bg-[#FF5C5C]/15 border-b border-[#FF5C5C]/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#FF5C5C] flex items-center justify-center text-white shadow-md">
              <AlertTriangle className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#FF5C5C] uppercase tracking-wider">Emergency Clinical Alert</h3>
              <p className="text-[10px] font-mono text-[#94A3B8] uppercase">High Priority Triage Escalation</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-white p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3.5">
          <div className="bg-[#07111F] p-3 rounded border border-[#1E293B] text-xs space-y-1.5 font-mono">
            <div className="text-[#F8FAFC] font-semibold">Patient: {patient.name} ({patient.id})</div>
            <div className="text-[#FF5C5C] font-bold">Simulated Risk Score: {patient.simulatedRisk}/100</div>
            <div className="text-[#94A3B8]">Pathway: {patient.pathway}</div>
            <div className="text-[#94A3B8]">Primary Trigger: {patient.primaryRiskReason}</div>
          </div>

          <p className="text-xs text-[#F8FAFC]/90 font-sans leading-relaxed">
            Dispatching an emergency alert will immediately notify the on-call Rapid Response Nurse and page Medical Director Dr. S. Chen.
          </p>

          <div className="pt-2 flex justify-end gap-2 border-t border-[#1E293B]">
            <button onClick={onClose} className="bg-[#07111F] border border-[#1E293B] px-3 py-1.5 rounded text-[10px] font-mono text-[#94A3B8] cursor-pointer uppercase">
              CANCEL
            </button>
            <button
              onClick={handleDispatchEmergency}
              disabled={isSubmitting}
              className="bg-[#FF5C5C] text-white px-4 py-1.5 rounded font-mono text-[10px] font-bold hover:bg-[#FF5C5C]/90 cursor-pointer uppercase tracking-wider disabled:opacity-50"
            >
              {isSubmitting ? 'DISPATCHING...' : 'DISPATCH RAPID TRIAGE'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
