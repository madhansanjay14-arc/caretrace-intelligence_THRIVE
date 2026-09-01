import React from 'react';
import { Patient, JourneyStep } from '../types';
import { 
  User, 
  Heart, 
  MapPin, 
  Phone, 
  Check, 
  X, 
  ChevronRight,
  AlertCircle,
  Calendar
} from 'lucide-react';

interface PatientRiskCardProps {
  patient: Patient;
  patients: Patient[];
  onSelectPatient: (p: Patient) => void;
  onStepClick?: (step: JourneyStep) => void;
}

export const PatientRiskCard: React.FC<PatientRiskCardProps> = ({
  patient,
  patients,
  onSelectPatient,
  onStepClick,
}) => {
  const isHigh = patient.riskLevel === 'HIGH';
  const isMedium = patient.riskLevel === 'MEDIUM';

  const riskColor = isHigh ? '#FF5C5C' : isMedium ? '#FBBF24' : '#34D399';
  const riskBg = isHigh 
    ? 'bg-[#FF5C5C]/15 border-[#FF5C5C]/40 text-[#FF5C5C]' 
    : isMedium 
    ? 'bg-[#FBBF24]/15 border-[#FBBF24]/40 text-[#FBBF24]' 
    : 'bg-[#34D399]/15 border-[#34D399]/40 text-[#34D399]';

  return (
    <div className="bg-[#162238] border border-[#2B3A55] rounded-xl flex-1 flex flex-col p-5 shadow-sm justify-between gap-4">
      {/* 1. TOP: PATIENT IDENTITY */}
      <div>
        <div className="flex items-center justify-between border-b border-[#2B3A55] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22D3EE] inline-block" />
            <span className="font-mono text-xs font-bold text-[#CBD5E1] uppercase tracking-wider">
              1. PATIENT + RISK
            </span>
          </div>
          
          {/* Quick Switcher dropdown to switch between synthetic cohort records */}
          <select
            id="patient-selector-dropdown"
            value={patient.id}
            onChange={(e) => {
              const selected = patients.find(p => p.id === e.target.value);
              if (selected) onSelectPatient(selected);
            }}
            className="bg-[#101B2E] border border-[#2B3A55] text-[11px] font-mono text-[#22D3EE] rounded px-2 py-1 outline-none cursor-pointer focus:border-[#22D3EE]"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id} className="bg-[#101B2E] text-white">
                {p.name} ({p.id}) — {p.simulatedRisk}/100
              </option>
            ))}
          </select>
        </div>

        {/* Patient Hero Info */}
        <div className="bg-[#101B2E] border border-[#2B3A55] rounded-lg p-4 mb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs text-[#22D3EE] bg-[#22D3EE]/10 px-2 py-0.5 rounded border border-[#22D3EE]/30 font-bold">
                  {patient.id}
                </span>
                <span className="text-[11px] font-mono text-[#94A3B8]">
                  Age {patient.age} • {patient.gender}
                </span>
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">
                {patient.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-[#CBD5E1] font-mono">
                <Heart className="w-3.5 h-3.5 text-[#22D3EE]" />
                <span>Care Pathway: <strong className="text-white font-semibold">{patient.pathway}</strong></span>
              </div>
            </div>

            {/* Prominent Risk Metric */}
            <div className="text-right flex flex-col items-end shrink-0">
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-black uppercase tracking-wider border ${riskBg}`}>
                {patient.riskLevel} RISK
              </span>
              <div 
                className="font-mono text-4xl font-black mt-1 leading-none tracking-tight"
                style={{ color: riskColor }}
              >
                {patient.simulatedRisk}
                <span className="text-lg text-[#94A3B8] font-normal">/100</span>
              </div>
              <span className="text-[10px] font-mono text-[#94A3B8] uppercase mt-0.5">
                Simulated Score
              </span>
            </div>
          </div>

          {/* Key Clinical & Logistics Stats */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#2B3A55] text-[11px] font-mono">
            <div className="flex items-center gap-1.5 text-[#CBD5E1]">
              <MapPin className="w-3.5 h-3.5 text-[#22D3EE] shrink-0" />
              <span>{patient.distanceMiles} miles from clinic</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#CBD5E1]">
              <AlertCircle className="w-3.5 h-3.5 text-[#FF5C5C] shrink-0" />
              <span>{patient.missedAppointments} missed visits</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PATIENT FOLLOW-UP JOURNEY */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-[#CBD5E1] uppercase tracking-wider font-mono flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#22D3EE]" />
            Patient Follow-up Journey
          </h4>
          <span className="text-[10px] font-mono text-[#38BDF8] uppercase">
            Care Timeline
          </span>
        </div>

        {/* Linear Stepper Journey */}
        <div className="bg-[#101B2E] border border-[#2B3A55] rounded-lg p-3.5 flex flex-col gap-2.5">
          {patient.journey.map((step, idx) => {
            const isCompleted = step.status === 'completed';
            const isMissed = step.status === 'missed';
            const isActive = step.status === 'active';
            const isUpcoming = step.status === 'upcoming';

            return (
              <div
                key={step.id}
                onClick={() => onStepClick && onStepClick(step)}
                className={`flex items-start gap-3 p-2 rounded transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-[#22D3EE]/10 border border-[#22D3EE]/40' 
                    : isMissed
                    ? 'bg-[#FF5C5C]/10 border border-[#FF5C5C]/30'
                    : 'hover:bg-[#24344D]/40 border border-transparent'
                }`}
              >
                {/* Node Icon */}
                <div className="shrink-0 mt-0.5">
                  {isCompleted && (
                    <div className="w-5 h-5 rounded-full bg-[#34D399] flex items-center justify-center text-[#0B132B]">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                  {isMissed && (
                    <div className="w-5 h-5 rounded-full bg-[#FF5C5C] flex items-center justify-center text-white">
                      <X className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                  {isActive && (
                    <div className="w-5 h-5 rounded-full bg-[#22D3EE] flex items-center justify-center text-[#0B132B] animate-pulse">
                      <span className="w-1.5 h-1.5 bg-[#0B132B] rounded-full" />
                    </div>
                  )}
                  {isUpcoming && (
                    <div className="w-5 h-5 rounded-full bg-[#24344D] border border-[#64748B]" />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-bold font-mono uppercase ${
                      isActive ? 'text-[#22D3EE]' : isMissed ? 'text-[#FF5C5C]' : isCompleted ? 'text-[#34D399]' : 'text-[#94A3B8]'
                    }`}>
                      {step.title}
                    </span>
                    <span className="text-[10px] font-mono text-[#94A3B8]">{step.date}</span>
                  </div>
                  <p className="text-[11px] text-[#CBD5E1] mt-0.5 leading-snug">
                    {step.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Coordinator Footer */}
      <div className="pt-2 border-t border-[#2B3A55] flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
        <span>Care Coordinator: <strong className="text-white">{patient.careCoordinator}</strong></span>
        <span className="text-[#22D3EE]">{patient.contactNumber}</span>
      </div>
    </div>
  );
};
