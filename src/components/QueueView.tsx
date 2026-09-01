import React, { useState } from 'react';
import { Patient, RiskFilter } from '../types';
import { 
  ClipboardList, 
  Search, 
  ArrowUpDown, 
  CalendarCheck, 
  Send, 
  PhoneCall
} from 'lucide-react';

interface QueueViewProps {
  patients: Patient[];
  selectedPatient: Patient;
  onSelectPatient: (patient: Patient) => void;
  onScheduleFollowup: (patient: Patient) => void;
  onSendReminder: (patient: Patient) => void;
  onContactPatient: (patient: Patient) => void;
}

export const QueueView: React.FC<QueueViewProps> = ({
  patients,
  selectedPatient,
  onSelectPatient,
  onScheduleFollowup,
  onSendReminder,
  onContactPatient,
}) => {
  const [filter, setFilter] = useState<RiskFilter>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'simulatedRisk' | 'name' | 'missedAppointments'>('simulatedRisk');
  const [sortAsc, setSortAsc] = useState(false);

  const filteredPatients = patients
    .filter((p) => {
      if (filter === 'ALL') return true;
      return p.riskLevel === filter;
    })
    .filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.pathway.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'simulatedRisk') {
        comparison = a.simulatedRisk - b.simulatedRisk;
      } else if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'missedAppointments') {
        comparison = a.missedAppointments - b.missedAppointments;
      }
      return sortAsc ? comparison : -comparison;
    });

  const toggleSort = (field: 'simulatedRisk' | 'name' | 'missedAppointments') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-3.5 overflow-hidden h-full">
      {/* Top Controls */}
      <div className="bg-[#162238] border border-[#2B3A55] rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0 shadow-sm">
        <div>
          <h2 className="font-bold text-base text-white flex items-center gap-2 uppercase tracking-wider">
            <ClipboardList className="w-4 h-4 text-[#22D3EE]" />
            <span>Clinical Priority Triage Queue</span>
          </h2>
          <p className="text-[11px] font-mono text-[#94A3B8] mt-0.5 uppercase tracking-wide">
            Simulated patient queue ranked by prioritized follow-up sensitivity factors.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="FILTER QUEUE..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#101B2E] border border-[#2B3A55] rounded py-1 pl-8 pr-3 text-[11px] text-white font-mono w-44 focus:w-56 focus:border-[#22D3EE] outline-none transition-all uppercase placeholder:text-[#64748B]"
            />
          </div>

          {/* Risk Level Filter */}
          <div className="flex items-center gap-1 bg-[#101B2E] p-1 rounded border border-[#2B3A55]">
            {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as RiskFilter[]).map((rf) => (
              <button
                key={rf}
                onClick={() => setFilter(rf)}
                className={`font-mono text-[10px] px-2 py-0.5 rounded transition-all uppercase cursor-pointer ${
                  filter === rf
                    ? 'bg-[#22D3EE] text-[#0B132B] font-bold'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#24344D]'
                }`}
              >
                {rf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-[#162238] border border-[#2B3A55] rounded-lg flex-1 overflow-hidden flex flex-col shadow-sm">
        <div className="overflow-x-auto overflow-y-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#101B2E] sticky top-0 z-20 border-b border-[#2B3A55] font-mono text-[10px] text-[#CBD5E1] uppercase">
              <tr>
                <th
                  onClick={() => toggleSort('simulatedRisk')}
                  className="py-3 px-4 cursor-pointer hover:text-[#22D3EE] transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Risk Score</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('name')}
                  className="py-3 px-4 cursor-pointer hover:text-[#22D3EE] transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Patient Identifier</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Care Pathway</th>
                <th
                  onClick={() => toggleSort('missedAppointments')}
                  className="py-3 px-4 cursor-pointer hover:text-[#22D3EE] transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Missed Appts</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Primary Factor</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2B3A55] font-sans text-xs">
              {filteredPatients.map((patient) => {
                const isSelected = patient.id === selectedPatient.id;
                const isHigh = patient.riskLevel === 'HIGH';
                const isMed = patient.riskLevel === 'MEDIUM';

                const badgeClass = isHigh
                  ? 'bg-[#FF5C5C]/20 text-[#FF5C5C] border border-[#FF5C5C]/40'
                  : isMed
                  ? 'bg-[#FBBF24]/20 text-[#FBBF24] border border-[#FBBF24]/40'
                  : 'bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/40';

                return (
                  <tr
                    key={patient.id}
                    onClick={() => onSelectPatient(patient)}
                    className={`hover:bg-[#24344D]/50 transition-colors cursor-pointer group ${
                      isSelected ? 'bg-[#22D3EE]/15' : ''
                    }`}
                  >
                    {/* Risk Score */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-sm font-bold px-2 py-0.5 rounded ${badgeClass}`}>
                          {patient.simulatedRisk}
                        </span>
                        <span className="font-mono text-[10px] text-[#94A3B8] hidden sm:inline uppercase font-bold">
                          {patient.riskLevel}
                        </span>
                      </div>
                    </td>

                    {/* Patient Name & ID */}
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-bold text-xs text-white group-hover:text-[#22D3EE] transition-colors flex items-center gap-2">
                          <span>{patient.name}</span>
                          {isSelected && (
                            <span className="text-[9px] font-mono bg-[#22D3EE] text-[#0B132B] px-1.5 py-0.5 rounded font-bold uppercase">
                              Active Focus
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-[10px] text-[#94A3B8]">
                          {patient.id} • Age {patient.age} • {patient.gender}
                        </div>
                      </div>
                    </td>

                    {/* Pathway */}
                    <td className="py-3 px-4 font-mono text-xs text-[#22D3EE] font-medium">
                      {patient.pathway}
                    </td>

                    {/* Missed Appts */}
                    <td className="py-3 px-4 font-mono text-xs">
                      <span className={patient.missedAppointments >= 3 ? 'text-[#FF5C5C] font-bold' : 'text-white'}>
                        {patient.missedAppointments} missed
                      </span>
                    </td>

                    {/* Primary Factor */}
                    <td className="py-3 px-4 text-xs text-[#CBD5E1] max-w-[200px] truncate">
                      {patient.primaryRiskReason}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3 px-4 text-right">
                      <div
                        className="flex items-center justify-end gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => onScheduleFollowup(patient)}
                          className="bg-[#22D3EE]/20 hover:bg-[#22D3EE] text-[#22D3EE] hover:text-[#0B132B] p-1.5 rounded transition-all border border-[#22D3EE]/40 cursor-pointer"
                          title="Schedule Follow-up"
                        >
                          <CalendarCheck className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onSendReminder(patient)}
                          className="bg-[#101B2E] hover:bg-[#24344D] text-[#94A3B8] hover:text-white p-1.5 rounded transition-all border border-[#2B3A55] cursor-pointer"
                          title="Send Reminder"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onContactPatient(patient)}
                          className="bg-[#101B2E] hover:bg-[#24344D] text-[#94A3B8] hover:text-white p-1.5 rounded transition-all border border-[#2B3A55] cursor-pointer"
                          title="Contact Patient"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

