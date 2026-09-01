import React, { useState } from 'react';
import { Patient } from '../types';
import { 
  Layers, 
  Users, 
  UserCheck, 
  Activity, 
  Calendar, 
  CheckCircle,
  Clock,
  ArrowRight,
  User
} from 'lucide-react';

interface StaffingViewProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  specialty: string;
  activeCases: number;
  criticalAlerts: number;
  capacityPct: number;
  avatar: string;
  initials: string;
  assignedPatients: string[];
}

const StaffAvatar: React.FC<{ name: string; avatarUrl: string; initials: string }> = ({
  name,
  avatarUrl,
  initials,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !avatarUrl) {
    return (
      <div 
        className="w-11 h-11 rounded bg-[#101B2E] border border-[#22D3EE]/40 flex items-center justify-center text-[#22D3EE] font-mono font-bold text-xs shrink-0 shadow-inner"
        title={name}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={avatarUrl}
      alt={name}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className="w-11 h-11 rounded object-cover border border-[#2B3A55] shrink-0"
    />
  );
};

export const StaffingView: React.FC<StaffingViewProps> = ({
  patients,
  onSelectPatient,
}) => {
  const staffMembers: StaffMember[] = [
    {
      id: 'STF-01',
      name: 'Dr. Sarah Chen',
      role: 'Medical Director',
      specialty: 'Cardiology / CHF Lead',
      activeCases: 24,
      criticalAlerts: 3,
      capacityPct: 85,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFo8tN6PIUwXCR4qwuntqUz0tuF9kfgLHxEsf6Ugh7abiWXBnhPqqwn6Ba1jltYFtOv8TjisYDefCvTNPa8bM_SBiluYMTb153KD60H51Vw2matO8EYHIvXfrOeJhE8H7D7dxVYGrgFZEQgd5VP5ZGjO4qkZPwX4O6jL_TaGZjPjDsVv5GZFpSkoMsw2OWhZGWe4Sj4d6bUUbcKSK6zDviDmKQvKFUywxod61LOYm1ZD3exDAjZx9B9Q',
      initials: 'SC',
      assignedPatients: ['P-1042', 'P-1088', 'P-1021'],
    },
    {
      id: 'STF-02',
      name: 'Sarah Connor, RN',
      role: 'Nurse Care Coordinator',
      specialty: 'Chronic Disease Management',
      activeCases: 18,
      criticalAlerts: 2,
      capacityPct: 72,
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&auto=format&fit=crop&q=80',
      initials: 'SC',
      assignedPatients: ['P-1042', 'P-1035', 'P-1077'],
    },
    {
      id: 'STF-03',
      name: 'David Kim, MSW',
      role: 'Clinical Social Worker',
      specialty: 'SDOH & Transport Assistance',
      activeCases: 15,
      criticalAlerts: 1,
      capacityPct: 60,
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
      initials: 'DK',
      assignedPatients: ['P-1042', 'P-1088', 'P-1014'],
    },
    {
      id: 'STF-04',
      name: 'Maria Santos, LPN',
      role: 'Triage Specialist',
      specialty: 'Remote Patient Monitoring',
      activeCases: 22,
      criticalAlerts: 0,
      capacityPct: 78,
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
      initials: 'MS',
      assignedPatients: ['P-1021', 'P-1035', 'P-1063'],
    },
  ];

  return (
    <div className="flex-1 flex flex-col gap-3.5 overflow-hidden h-full">
      {/* Header Banner */}
      <div className="bg-[#162238] border border-[#2B3A55] rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-base text-white flex items-center gap-2 uppercase tracking-wider">
              <Layers className="w-4 h-4 text-[#22D3EE]" />
              <span>Care Team Allocation & Capacity</span>
            </h2>
            <span className="bg-[#FBBF24]/15 text-[#FBBF24] text-[10px] font-mono px-2 py-0.5 rounded border border-[#FBBF24]/30 uppercase font-bold">
              Simulated Staffing Model
            </span>
          </div>
          <p className="text-[11px] font-mono text-[#94A3B8] mt-0.5 uppercase tracking-wide">
            Multidisciplinary care team assignments, workload distribution, and escalation routes (Simulated demo capacities).
          </p>
        </div>
      </div>

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto">
        {staffMembers.map((staff) => (
          <div
            key={staff.id}
            className="bg-[#162238] border border-[#2B3A55] rounded-lg p-4 flex flex-col justify-between gap-3 shadow-sm hover:border-[#22D3EE]/40 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <StaffAvatar
                    name={staff.name}
                    avatarUrl={staff.avatar}
                    initials={staff.initials}
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {staff.name}
                      <span className="text-[10px] font-mono text-[#94A3B8]">({staff.id})</span>
                    </h3>
                    <div className="text-xs text-[#22D3EE] font-mono">{staff.role}</div>
                    <div className="text-[10px] text-[#94A3B8] font-mono">{staff.specialty}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-[#CBD5E1]">
                    {staff.activeCases} <span className="text-[10px] text-[#94A3B8] font-normal">CASES</span>
                  </div>
                  {staff.criticalAlerts > 0 ? (
                    <span className="text-[9px] font-mono font-bold bg-[#FF5C5C]/20 text-[#FF5C5C] px-1.5 py-0.5 rounded border border-[#FF5C5C]/40">
                      {staff.criticalAlerts} Critical
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono font-bold bg-[#34D399]/20 text-[#34D399] px-1.5 py-0.5 rounded border border-[#34D399]/40">
                      Optimal
                    </span>
                  )}
                </div>
              </div>

              {/* Workload Capacity Bar */}
              <div className="space-y-1 mb-3">
                <div className="flex justify-between text-[10px] font-mono text-[#94A3B8] uppercase">
                  <span>Workload Capacity</span>
                  <span className="text-white font-bold">{staff.capacityPct}%</span>
                </div>
                <div className="w-full bg-[#101B2E] h-2 rounded overflow-hidden border border-[#2B3A55]">
                  <div
                    className={`h-full transition-all ${
                      staff.capacityPct > 80
                        ? 'bg-[#FF5C5C]'
                        : staff.capacityPct > 65
                        ? 'bg-[#FBBF24]'
                        : 'bg-[#34D399]'
                    }`}
                    style={{ width: `${staff.capacityPct}%` }}
                  />
                </div>
              </div>

              {/* Assigned Cohort Cases */}
              <div className="border-t border-[#2B3A55] pt-2.5">
                <div className="text-[10px] font-mono text-[#94A3B8] uppercase mb-1.5">
                  Assigned High-Priority Patients:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {staff.assignedPatients.map((pid) => {
                    const p = patients.find((item) => item.id === pid);
                    if (!p) return null;
                    return (
                      <button
                        key={pid}
                        onClick={() => onSelectPatient(p)}
                        className="bg-[#101B2E] hover:bg-[#22D3EE]/20 hover:border-[#22D3EE] border border-[#2B3A55] rounded px-2 py-1 text-[11px] font-mono text-white flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <span className="font-bold text-[#22D3EE]">{p.name}</span>
                        <span className="text-[9px] text-[#94A3B8]">({p.simulatedRisk})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
