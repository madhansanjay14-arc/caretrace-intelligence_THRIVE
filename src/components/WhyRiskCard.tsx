import React from 'react';
import { Patient } from '../types';
import { 
  BarChart2, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  HelpCircle,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';

interface WhyRiskCardProps {
  patient: Patient;
}

export const WhyRiskCard: React.FC<WhyRiskCardProps> = ({ patient }) => {
  return (
    <div className="bg-[#162238] border border-[#2B3A55] rounded-xl flex-1 flex flex-col p-5 shadow-sm justify-between gap-4">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between border-b border-[#2B3A55] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF5C5C] inline-block" />
            <h2 className="font-mono text-xs font-bold text-[#CBD5E1] uppercase tracking-wider">
              2. WHY IS THIS PATIENT AT RISK?
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#22D3EE] bg-[#22D3EE]/10 px-2.5 py-0.5 rounded border border-[#22D3EE]/30 uppercase font-bold">
            Explainable Factor Breakdown
          </span>
        </div>

        {/* Narrative Clinical Context Box */}
        <div className="bg-[#101B2E] border border-[#2B3A55] border-l-4 border-l-[#22D3EE] rounded-lg p-3.5 mb-4 shadow-sm">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-[11px] font-bold text-[#22D3EE] uppercase tracking-wide">
              Simulated Clinical Summary:
            </span>
          </div>
          <p className="text-xs text-[#CBD5E1] leading-relaxed">
            {patient.explanation}
          </p>
        </div>

        {/* FACTOR CONTRIBUTION VISUALIZATION (MAIN ANALYTICAL VISUALIZATION) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#22D3EE]" />
              Contributing Sensitivity Factors
            </h3>
            <span className="text-[10px] font-mono text-[#94A3B8] uppercase">
              Relative Factor Weight
            </span>
          </div>

          {/* Clean Horizontal Bars */}
          <div className="space-y-3">
            {patient.factors.map((factor) => {
              return (
                <div 
                  key={factor.id} 
                  className="bg-[#101B2E] border border-[#2B3A55] hover:border-[#22D3EE]/50 rounded-lg p-3 transition-colors"
                >
                  <div className="flex items-center justify-between font-mono text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">
                        {factor.name}
                      </span>
                      <span className="text-[11px] text-[#94A3B8] font-normal">
                        ({factor.valueDisplay})
                      </span>
                    </div>

                    <span 
                      className="font-bold text-xs font-mono"
                      style={{ color: factor.color }}
                    >
                      +{factor.percentage}% Impact
                    </span>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="h-2.5 w-full bg-[#24344D] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${factor.percentage}%`,
                        backgroundColor: factor.color,
                      }}
                    />
                  </div>

                  <p className="text-[11px] text-[#94A3B8] mt-1.5 leading-tight">
                    {factor.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Required Prominent Disclaimer & Summary */}
      <div className="space-y-2">
        <div className="bg-[#101B2E] border border-[#2B3A55] rounded-lg p-3 flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-2 text-[#CBD5E1]">
            <TrendingUp className="w-3.5 h-3.5 text-[#22D3EE] shrink-0" />
            <span>Primary Sensitivity Driver: <strong className="text-[#FF5C5C] font-bold">{patient.primaryRiskReason}</strong></span>
          </div>
          <span className="text-[#34D399] font-bold text-[10px] uppercase">Actionable</span>
        </div>

        {/* Required Mandatory Label */}
        <div className="p-2.5 bg-[#101B2E]/80 border border-[#2B3A55] rounded-lg flex flex-col sm:flex-row items-center justify-between gap-1.5 text-center sm:text-left">
          <span className="font-mono text-[10px] font-black tracking-wider text-[#CBD5E1] uppercase">
            SIMULATED CONTRIBUTION
          </span>
          <span className="font-mono text-[9px] font-bold tracking-widest text-[#64748B] uppercase">
            NOT A CLINICAL PREDICTION • FICTIONAL DATA
          </span>
        </div>
      </div>
    </div>
  );
};
