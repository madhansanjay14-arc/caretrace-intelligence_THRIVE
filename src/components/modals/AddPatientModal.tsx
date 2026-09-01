import React, { useState } from 'react';
import { Patient, RiskLevel } from '../../types';
import { savePatientToBackend } from '../../services/api';
import { 
  UserPlus, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Activity, 
  ShieldAlert, 
  MapPin, 
  Calendar 
} from 'lucide-react';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingPatients: Patient[];
  onPatientSaved: (newPatient: any) => void;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({
  isOpen,
  onClose,
  existingPatients,
  onPatientSaved,
}) => {
  const [patientId, setPatientId] = useState('P-2001');
  const [name, setName] = useState('Arun Kumar');
  const [age, setAge] = useState<number | string>(55);
  const [gender, setGender] = useState('Male');
  const [pathway, setPathway] = useState('Diabetes Management');
  const [riskScore, setRiskScore] = useState<number | string>(76);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('HIGH');
  const [missedVisits, setMissedVisits] = useState<number | string>(3);
  const [distanceMiles, setDistanceMiles] = useState<number | string>(20);
  const [erVisits, setErVisits] = useState<number | string>(2);
  const [attendanceRate, setAttendanceRate] = useState<number | string>(60);

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  // Auto-sync risk level with risk score
  const handleRiskScoreChange = (val: string) => {
    setRiskScore(val);
    const num = Number(val);
    if (!isNaN(num)) {
      if (num >= 70) setRiskLevel('HIGH');
      else if (num >= 40) setRiskLevel('MEDIUM');
      else setRiskLevel('LOW');
    }
  };

  const validateForm = (): boolean => {
    setValidationError(null);

    const trimmedId = String(patientId).trim();
    if (!trimmedId) {
      setValidationError('Patient ID must not be empty.');
      return false;
    }

    // Check duplicate ID
    const isDuplicate = existingPatients.some(
      (p) => p.id.toLowerCase() === trimmedId.toLowerCase()
    );
    if (isDuplicate) {
      setValidationError(`Patient ID "${trimmedId}" already exists. Duplicate IDs are not allowed.`);
      return false;
    }

    const trimmedName = String(name).trim();
    if (!trimmedName) {
      setValidationError('Patient Name must not be empty.');
      return false;
    }

    const numAge = Number(age);
    if (isNaN(numAge) || numAge <= 0 || !Number.isInteger(numAge)) {
      setValidationError('Age must be a valid positive integer.');
      return false;
    }

    const numScore = Number(riskScore);
    if (isNaN(numScore) || numScore < 0 || numScore > 100) {
      setValidationError('Risk Score must be a number between 0 and 100.');
      return false;
    }

    const numMissed = Number(missedVisits);
    if (isNaN(numMissed) || numMissed < 0 || !Number.isInteger(numMissed)) {
      setValidationError('Missed Visits must be a non-negative integer (>= 0).');
      return false;
    }

    const numDistance = Number(distanceMiles);
    if (isNaN(numDistance) || numDistance < 0) {
      setValidationError('Distance to clinic must be a non-negative number (>= 0).');
      return false;
    }

    const numEr = Number(erVisits);
    if (isNaN(numEr) || numEr < 0 || !Number.isInteger(numEr)) {
      setValidationError('ER Visits must be a non-negative integer (>= 0).');
      return false;
    }

    const numAttendance = Number(attendanceRate);
    if (isNaN(numAttendance) || numAttendance < 0 || numAttendance > 100) {
      setValidationError('Attendance rate must be a percentage between 0 and 100.');
      return false;
    }

    return true;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    const patientPayload = {
      patient_id: String(patientId).trim(),
      name: String(name).trim(),
      age: Number(age),
      gender,
      pathway,
      risk_score: Number(riskScore),
      risk_level: riskLevel,
      missed_visits: Number(missedVisits),
      distance_miles: Number(distanceMiles),
      er_visits: Number(erVisits),
      attendance_rate: Number(attendanceRate),
    };

    const res = await savePatientToBackend(patientPayload);
    setIsSaving(false);

    if (res.success) {
      onPatientSaved(patientPayload);
      onClose();
    } else {
      setValidationError(res.error || 'Failed to save patient. Please check your inputs and try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0D1B2A] border border-[#1E293B] rounded-xl w-full max-w-xl shadow-2xl overflow-hidden border-t-2 border-t-[#22D3EE] max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#1E293B] flex items-center justify-between bg-[#07111F] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#22D3EE]/20 border border-[#22D3EE]/40 flex items-center justify-center text-[#22D3EE]">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#F8FAFC] uppercase tracking-wider">
                Enroll New Cohort Patient
              </h3>
              <p className="text-[10px] font-mono text-[#94A3B8] uppercase">
                Google Sheets In-App Data Input • Deterministic Surveillance
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

        {/* Modal Form Content */}
        <form onSubmit={handleSave} className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Inline Validation Alert */}
          {validationError && (
            <div className="p-3 bg-[#FF5C5C]/15 border border-[#FF5C5C]/40 rounded-lg flex items-center gap-2.5 text-xs text-[#FF5C5C] font-mono">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Row 1: Patient ID & Full Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono text-[#94A3B8] uppercase mb-1 font-bold">
                Patient ID <span className="text-[#FF5C5C]">*</span>
              </label>
              <input
                id="input-patient-id"
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="e.g. P-2001"
                className="w-full bg-[#07111F] border border-[#1E293B] rounded px-3 py-1.5 text-xs text-[#F8FAFC] font-mono focus:border-[#22D3EE] outline-none uppercase"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[#94A3B8] uppercase mb-1 font-bold">
                Patient Name <span className="text-[#FF5C5C]">*</span>
              </label>
              <input
                id="input-patient-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Arun Kumar"
                className="w-full bg-[#07111F] border border-[#1E293B] rounded px-3 py-1.5 text-xs text-[#F8FAFC] font-sans focus:border-[#22D3EE] outline-none"
                required
              />
            </div>
          </div>

          {/* Row 2: Age, Gender, Care Pathway */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-mono text-[#94A3B8] uppercase mb-1 font-bold">
                Age (Years) <span className="text-[#FF5C5C]">*</span>
              </label>
              <input
                id="input-patient-age"
                type="number"
                min="1"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="55"
                className="w-full bg-[#07111F] border border-[#1E293B] rounded px-3 py-1.5 text-xs text-[#F8FAFC] font-mono focus:border-[#22D3EE] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[#94A3B8] uppercase mb-1 font-bold">
                Gender
              </label>
              <select
                id="select-patient-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-[#07111F] border border-[#1E293B] rounded px-3 py-1.5 text-xs text-[#F8FAFC] font-mono focus:border-[#22D3EE] outline-none cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Unspecified">Unspecified</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[#94A3B8] uppercase mb-1 font-bold">
                Care Pathway
              </label>
              <select
                id="select-patient-pathway"
                value={pathway}
                onChange={(e) => setPathway(e.target.value)}
                className="w-full bg-[#07111F] border border-[#1E293B] rounded px-3 py-1.5 text-xs text-[#F8FAFC] font-sans focus:border-[#22D3EE] outline-none cursor-pointer"
              >
                <option value="Diabetes Management">Diabetes Management</option>
                <option value="CHF Management">CHF Management</option>
                <option value="COPD Management">COPD Management</option>
                <option value="Hypertension">Hypertension Care</option>
                <option value="Anticoagulation Therapy">Anticoagulation Therapy</option>
                <option value="Cardiac Rehabilitation">Cardiac Rehabilitation</option>
                <option value="Asthma Management">Asthma Management</option>
                <option value="Specialty Care">Specialty Care</option>
              </select>
            </div>
          </div>

          {/* Row 3: Risk Score & Risk Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[#07111F] border border-[#1E293B] rounded-lg">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-mono text-[#94A3B8] uppercase font-bold">
                  Simulated Risk Score (0-100)
                </label>
                <span className="text-xs font-mono font-bold text-[#22D3EE]">{riskScore}/100</span>
              </div>
              <input
                id="input-patient-risk-score"
                type="number"
                min="0"
                max="100"
                value={riskScore}
                onChange={(e) => handleRiskScoreChange(e.target.value)}
                placeholder="76"
                className="w-full bg-[#0B132B] border border-[#1E293B] rounded px-3 py-1.5 text-xs text-[#F8FAFC] font-mono focus:border-[#22D3EE] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[#94A3B8] uppercase mb-1 font-bold">
                Risk Tier / Level
              </label>
              <select
                id="select-patient-risk-level"
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}
                className={`w-full bg-[#0B132B] border border-[#1E293B] rounded px-3 py-1.5 text-xs font-mono font-bold focus:border-[#22D3EE] outline-none cursor-pointer ${
                  riskLevel === 'HIGH'
                    ? 'text-[#FF5C5C]'
                    : riskLevel === 'MEDIUM'
                    ? 'text-[#FBBF24]'
                    : 'text-[#34D399]'
                }`}
              >
                <option value="HIGH">HIGH RISK (≥ 70)</option>
                <option value="MEDIUM">MEDIUM RISK (40-69)</option>
                <option value="LOW">LOW RISK (&lt; 40)</option>
              </select>
            </div>
          </div>

          {/* Row 4: Missed Visits, Distance, ER Visits, Attendance */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[10px] font-mono text-[#94A3B8] uppercase mb-1 font-bold">
                Missed Visits
              </label>
              <input
                id="input-patient-missed"
                type="number"
                min="0"
                max="20"
                value={missedVisits}
                onChange={(e) => setMissedVisits(e.target.value)}
                placeholder="3"
                className="w-full bg-[#07111F] border border-[#1E293B] rounded px-3 py-1.5 text-xs text-[#F8FAFC] font-mono focus:border-[#22D3EE] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[#94A3B8] uppercase mb-1 font-bold">
                Distance (miles)
              </label>
              <input
                id="input-patient-distance"
                type="number"
                min="0"
                max="100"
                value={distanceMiles}
                onChange={(e) => setDistanceMiles(e.target.value)}
                placeholder="20"
                className="w-full bg-[#07111F] border border-[#1E293B] rounded px-3 py-1.5 text-xs text-[#F8FAFC] font-mono focus:border-[#22D3EE] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[#94A3B8] uppercase mb-1 font-bold">
                ER Visits (6mo)
              </label>
              <input
                id="input-patient-er"
                type="number"
                min="0"
                max="20"
                value={erVisits}
                onChange={(e) => setErVisits(e.target.value)}
                placeholder="2"
                className="w-full bg-[#07111F] border border-[#1E293B] rounded px-3 py-1.5 text-xs text-[#F8FAFC] font-mono focus:border-[#22D3EE] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[#94A3B8] uppercase mb-1 font-bold">
                Attendance (%)
              </label>
              <input
                id="input-patient-attendance"
                type="number"
                min="0"
                max="100"
                value={attendanceRate}
                onChange={(e) => setAttendanceRate(e.target.value)}
                placeholder="60"
                className="w-full bg-[#07111F] border border-[#1E293B] rounded px-3 py-1.5 text-xs text-[#F8FAFC] font-mono focus:border-[#22D3EE] outline-none"
                required
              />
            </div>
          </div>

          {/* Quick Summary Preview */}
          <div className="bg-[#101B2E] border border-[#2B3A55] rounded-lg p-3 text-[11px] font-mono text-[#CBD5E1] flex items-center justify-between">
            <span>
              Summary: <strong>{name || 'New Patient'}</strong> ({patientId || 'P-XXXX'}) • {age || 0} y/o {gender}
            </span>
            <span
              className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                riskLevel === 'HIGH'
                  ? 'bg-[#FF5C5C]/20 text-[#FF5C5C]'
                  : riskLevel === 'MEDIUM'
                  ? 'bg-[#FBBF24]/20 text-[#FBBF24]'
                  : 'bg-[#34D399]/20 text-[#34D399]'
              }`}
            >
              {riskScore}/100 {riskLevel}
            </span>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-3 border-t border-[#1E293B] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="bg-[#07111F] border border-[#1E293B] text-[#94A3B8] hover:text-white px-4 py-2 rounded text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
            >
              CANCEL
            </button>
            <button
              id="submit-save-patient-btn"
              type="submit"
              disabled={isSaving}
              className="bg-[#22D3EE] text-[#07111F] hover:bg-[#22D3EE]/90 px-5 py-2 rounded text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-md"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-[#07111F] border-t-transparent rounded-full animate-spin" />
                  <span>SAVING PATIENT...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>SAVE PATIENT</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
