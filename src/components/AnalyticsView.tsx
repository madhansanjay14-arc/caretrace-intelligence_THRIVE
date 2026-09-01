import React from 'react';
import { Patient } from '../types';
import { calculateCohortAnalytics } from '../services/api';
import { 
  Activity, 
  BarChart3, 
  Layers, 
  Info
} from 'lucide-react';

interface AnalyticsViewProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  patients,
  onSelectPatient,
}) => {
  const analytics = calculateCohortAnalytics(patients);

  return (
    <div className="flex-1 flex flex-col gap-3.5 overflow-y-auto h-full pr-1 pb-4">
      {/* Header */}
      <div className="bg-[#162238] border border-[#2B3A55] rounded-lg p-4 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <h2 className="font-bold text-base text-white flex items-center gap-2 uppercase tracking-wider">
            <Activity className="w-4 h-4 text-[#22D3EE]" />
            <span>Population Risk Analytics & Cohort Modeling</span>
          </h2>
          <p className="text-[11px] font-mono text-[#94A3B8] mt-0.5 uppercase tracking-wide">
            Simulated aggregate metrics across the active decision-support cohort.
          </p>
        </div>

        <div className="bg-[#22D3EE]/15 border border-[#22D3EE]/30 px-3 py-1 rounded text-[11px] font-mono text-[#22D3EE] font-bold uppercase self-start sm:self-auto">
          Cohort Size: {analytics.totalPatients} Active Records
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#162238] border border-[#2B3A55] border-l-3 border-l-[#FF5C5C] rounded-lg p-3.5 shadow-sm">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase font-bold tracking-wider">High Risk Cohort</div>
          <div className="font-mono text-2xl lg:text-3xl font-black text-[#FF5C5C] mt-1">{analytics.highRiskCount}</div>
          <div className="text-[9px] font-mono text-[#94A3B8] uppercase mt-1">Immediate follow-up required</div>
        </div>

        <div className="bg-[#162238] border border-[#2B3A55] border-l-3 border-l-[#FBBF24] rounded-lg p-3.5 shadow-sm">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase font-bold tracking-wider">Medium Risk Tier</div>
          <div className="font-mono text-2xl lg:text-3xl font-black text-[#FBBF24] mt-1">{analytics.medRiskCount}</div>
          <div className="text-[9px] font-mono text-[#94A3B8] uppercase mt-1">Active remote monitoring</div>
        </div>

        <div className="bg-[#162238] border border-[#2B3A55] border-l-3 border-l-[#34D399] rounded-lg p-3.5 shadow-sm">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase font-bold tracking-wider">Low Risk / Stable</div>
          <div className="font-mono text-2xl lg:text-3xl font-black text-[#34D399] mt-1">{analytics.lowRiskCount}</div>
          <div className="text-[9px] font-mono text-[#94A3B8] uppercase mt-1">Adherent to protocol</div>
        </div>

        <div className="bg-[#162238] border border-[#2B3A55] border-l-3 border-l-[#22D3EE] rounded-lg p-3.5 shadow-sm">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase font-bold tracking-wider">Cohort Mean Score</div>
          <div className="font-mono text-2xl lg:text-3xl font-black text-[#22D3EE] mt-1">{analytics.meanRiskScore}<span className="text-xs font-normal text-[#94A3B8]">/100</span></div>
          <div className="text-[9px] font-mono text-[#94A3B8] uppercase mt-1">{analytics.totalMissedVisits} total missed check-ins</div>
        </div>
      </div>

      {/* Factor Sensitivity Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {/* Factor Impact */}
        <div className="bg-[#162238] border border-[#2B3A55] rounded-lg p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-3 border-b border-[#2B3A55] pb-2.5">
            <h3 className="font-bold text-xs text-white flex items-center gap-1.5 font-mono uppercase tracking-wider">
              <BarChart3 className="w-3.5 h-3.5 text-[#22D3EE]" />
              Simulated Factor Sensitivity Breakdown
            </h3>
            <span className="text-[9px] font-mono text-[#94A3B8] uppercase">Cohort Weights</span>
          </div>

          <div className="space-y-3">
            {analytics.factorWeights.map((fw, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-[11px] font-mono mb-1">
                  <span className="text-white uppercase">{fw.name}</span>
                  <span className="font-bold" style={{ color: fw.color }}>{fw.weight}% weight</span>
                </div>
                <div className="h-2 bg-[#101B2E] rounded-full overflow-hidden border border-[#2B3A55]">
                  <div className="h-full" style={{ width: `${fw.weight}%`, backgroundColor: fw.color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3.5 pt-2.5 border-t border-[#2B3A55] text-[10px] text-[#94A3B8] font-mono flex items-center gap-1.5 uppercase">
            <Info className="w-3.5 h-3.5 text-[#22D3EE] shrink-0" />
            <span>Simulated sensitivity models calibrated for decision-support transparency.</span>
          </div>
        </div>

        {/* Pathway Risk Distribution */}
        <div className="bg-[#162238] border border-[#2B3A55] rounded-lg p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-3 border-b border-[#2B3A55] pb-2.5">
            <h3 className="font-bold text-xs text-white flex items-center gap-1.5 font-mono uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-[#22D3EE]" />
              Risk Distribution By Specialty Pathway
            </h3>
            <span className="text-[9px] font-mono text-[#94A3B8] uppercase">Tiers</span>
          </div>

          <div className="space-y-2">
            {analytics.pathwayStats.map((p, idx) => (
              <div 
                key={idx} 
                className="bg-[#101B2E] p-2.5 rounded border border-[#2B3A55] flex items-center justify-between hover:border-[#22D3EE]/40 transition-colors cursor-pointer"
                onClick={() => {
                  const matchingPatient = patients.find((pt) => pt.pathway === p.pathway);
                  if (matchingPatient) onSelectPatient(matchingPatient);
                }}
              >
                <div>
                  <div className="text-xs font-bold text-white">{p.pathway}</div>
                  <div className="text-[10px] font-mono text-[#94A3B8] uppercase">{p.count} Enrolled Records</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold" style={{ color: p.color }}>
                    Score {p.avgRisk}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

