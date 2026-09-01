import React, { useState } from 'react';
import { Patient } from '../types';
import { 
  Users, 
  Search, 
  ChevronRight, 
  MapPin,
  UserPlus
} from 'lucide-react';

interface PatientDirectoryViewProps {
  patients: Patient[];
  selectedPatient: Patient;
  onSelectPatient: (patient: Patient) => void;
  onOpenFollowup: (patient: Patient) => void;
  onOpenAddPatient?: () => void;
}

export const PatientDirectoryView: React.FC<PatientDirectoryViewProps> = ({
  patients,
  selectedPatient,
  onSelectPatient,
  onOpenFollowup,
  onOpenAddPatient,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.pathway.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col gap-3.5 overflow-hidden h-full">
      {/* Top Header */}
      <div className="bg-[#162238] border border-[#2B3A55] rounded-lg p-4 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <h2 className="font-bold text-base text-white flex items-center gap-2 uppercase tracking-wider">
            <Users className="w-4 h-4 text-[#22D3EE]" />
            <span>Fictional Patient Cohort Roster</span>
          </h2>
          <p className="text-[11px] font-mono text-[#94A3B8] mt-0.5 uppercase tracking-wide">
            Synthetic patient records designed for healthcare decision-support evaluation.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {onOpenAddPatient && (
            <button
              id="directory-add-patient-btn"
              onClick={onOpenAddPatient}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#22D3EE]/15 hover:bg-[#22D3EE]/25 border border-[#22D3EE]/40 text-[#22D3EE] hover:text-white rounded text-[11px] font-mono font-bold transition-all cursor-pointer uppercase tracking-wider shadow-sm shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Add Patient</span>
            </button>
          )}

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="SEARCH ROSTER..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#101B2E] border border-[#2B3A55] rounded py-1 pl-8 pr-3 text-[11px] text-white font-mono w-44 sm:w-48 focus:w-56 focus:border-[#22D3EE] outline-none transition-all uppercase placeholder:text-[#64748B]"
            />
          </div>
        </div>
      </div>

      {/* Grid of Patient Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 overflow-y-auto pr-1 pb-4 flex-1">
        {filtered.map((patient) => {
          const isSelected = patient.id === selectedPatient.id;
          const isHigh = patient.riskLevel === 'HIGH';
          const isMed = patient.riskLevel === 'MEDIUM';

          const borderStripe = isHigh
            ? 'border-l-3 border-l-[#FF5C5C]'
            : isMed
            ? 'border-l-3 border-l-[#FBBF24]'
            : 'border-l-3 border-l-[#34D399]';

          const riskBadge = isHigh
            ? 'bg-[#FF5C5C]/20 text-[#FF5C5C] border border-[#FF5C5C]/40'
            : isMed
            ? 'bg-[#FBBF24]/20 text-[#FBBF24] border border-[#FBBF24]/40'
            : 'bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/40';

          return (
            <div
              key={patient.id}
              onClick={() => onSelectPatient(patient)}
              className={`bg-[#162238] border border-[#2B3A55] rounded-lg p-3.5 ${borderStripe} flex flex-col justify-between cursor-pointer hover:bg-[#24344D]/50 transition-all relative group shadow-sm ${
                isSelected ? 'ring-1 ring-[#22D3EE] bg-[#22D3EE]/15' : ''
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-1.5">
                  <div>
                    <h3 className="font-bold text-xs text-white group-hover:text-[#22D3EE] transition-colors">
                      {patient.name}
                    </h3>
                    <div className="font-mono text-[10px] text-[#94A3B8]">
                      ID: {patient.id} • {patient.age} y/o {patient.gender}
                    </div>
                  </div>

                  <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${riskBadge}`}>
                    {patient.simulatedRisk}/100
                  </span>
                </div>

                <div className="text-xs text-[#22D3EE] font-mono mb-1.5 truncate font-medium">
                  {patient.pathway}
                </div>

                <div className="text-xs text-[#CBD5E1] line-clamp-2 mb-3 leading-relaxed">
                  {patient.explanation}
                </div>
              </div>

              <div className="pt-2.5 border-t border-[#2B3A55] flex items-center justify-between font-mono text-[10px] text-[#94A3B8] uppercase">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#22D3EE]" />
                  <span>{patient.distanceMiles} MILES</span>
                </div>
                <div className="flex items-center gap-1 text-[#22D3EE] font-bold group-hover:translate-x-0.5 transition-transform">
                  <span>Focus in Command</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

