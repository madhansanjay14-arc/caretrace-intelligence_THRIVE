import React from 'react';
import { 
  X, 
  Settings, 
  ShieldCheck, 
  Info
} from 'lucide-react';

export const ProtocolGuideModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0D1B2A] border border-[#1E293B] rounded-lg w-full max-w-xl shadow-2xl overflow-hidden border-t-2 border-t-[#22D3EE]">
        <div className="p-4 border-b border-[#1E293B] flex items-center justify-between bg-[#07111F]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#22D3EE]/20 border border-[#22D3EE]/40 flex items-center justify-center text-[#22D3EE]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#F8FAFC] uppercase tracking-wider">CareTrace Intelligence Protocol</h3>
              <p className="text-[10px] font-mono text-[#94A3B8]">Core Decision-Support Framework & Principles</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-white p-1 rounded hover:bg-[#1E293B] cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3.5 max-h-[75vh] overflow-y-auto">
          {/* Tagline */}
          <div className="text-center py-2 bg-[#07111F] rounded border border-[#1E293B] font-mono">
            <span className="text-[9px] text-[#94A3B8] uppercase block">Platform Axiom</span>
            <span className="text-sm font-black text-[#22D3EE] tracking-widest uppercase">
              DETECT • EXPLAIN • SIMULATE • ACT
            </span>
          </div>

          {/* 4 Pillars */}
          <div className="space-y-2.5">
            <div className="p-3 bg-[#101B2E] rounded border-l-2 border-l-[#FF5C5C] border border-[#2B3A55]">
              <div className="font-mono text-[11px] font-bold text-[#FF5C5C] flex items-center gap-1.5 mb-0.5">
                <span className="w-3.5 h-3.5 rounded bg-[#FF5C5C]/20 flex items-center justify-center text-[9px]">1</span>
                DETECT
              </div>
              <p className="text-xs text-[#CBD5E1]">
                Identify which simulated patients require prioritized attention using deterministic clinical scoring based on missed appointments and logistic barriers.
              </p>
            </div>

            <div className="p-3 bg-[#101B2E] rounded border-l-2 border-l-[#22D3EE] border border-[#2B3A55]">
              <div className="font-mono text-[11px] font-bold text-[#22D3EE] flex items-center gap-1.5 mb-0.5">
                <span className="w-3.5 h-3.5 rounded bg-[#22D3EE]/20 flex items-center justify-center text-[9px]">2</span>
                EXPLAIN
              </div>
              <p className="text-xs text-[#CBD5E1]">
                Provide transparent factor decomposition (Missed Appointments, Distance, ER frequency) and plain-language summaries without black-box opacity.
              </p>
            </div>

            <div className="p-3 bg-[#101B2E] rounded border-l-2 border-l-[#FBBF24] border border-[#2B3A55]">
              <div className="font-mono text-[11px] font-bold text-[#FBBF24] flex items-center gap-1.5 mb-0.5">
                <span className="w-3.5 h-3.5 rounded bg-[#FBBF24]/20 flex items-center justify-center text-[9px]">3</span>
                SIMULATE (What-If Intervention Lab)
              </div>
              <p className="text-xs text-[#CBD5E1]">
                Allow care teams to dynamically adjust key variables (e.g. resolving missed visits, adding ride vouchers) and evaluate projected risk reductions in real time.
              </p>
            </div>

            <div className="p-3 bg-[#101B2E] rounded border-l-2 border-l-[#34D399] border border-[#2B3A55]">
              <div className="font-mono text-[11px] font-bold text-[#34D399] flex items-center gap-1.5 mb-0.5">
                <span className="w-3.5 h-3.5 rounded bg-[#34D399]/20 flex items-center justify-center text-[9px]">4</span>
                ACT
              </div>
              <p className="text-xs text-[#CBD5E1]">
                Seamlessly dispatch follow-up scheduling, automated multi-channel reminders, and direct clinician outreach with ride voucher integration.
              </p>
            </div>
          </div>

          <div className="p-3 bg-[#22D3EE]/10 rounded border border-[#22D3EE]/30 text-[10px] font-mono text-[#94A3B8] flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-[#22D3EE] shrink-0 mt-0.5" />
            <span>
              Disclaimer: CareTrace Intelligence is a decision-support prototype operating strictly on synthetic demo data. It does not provide clinical diagnosis.
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-[#07111F] border-t border-[#1E293B] flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#22D3EE] text-[#07111F] px-4 py-1.5 rounded font-mono text-[10px] font-bold hover:bg-[#22D3EE]/90 transition-all cursor-pointer uppercase tracking-wider"
          >
            ACKNOWLEDGE & RETURN
          </button>
        </div>
      </div>
    </div>
  );
};

export const SettingsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}> = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0D1B2A] border border-[#1E293B] rounded-lg w-full max-w-md shadow-2xl overflow-hidden border-t-2 border-t-[#22D3EE]">
        <div className="p-4 border-b border-[#1E293B] flex items-center justify-between bg-[#07111F]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#22D3EE]/20 border border-[#22D3EE]/40 flex items-center justify-center text-[#22D3EE]">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#F8FAFC] uppercase tracking-wider">Command Center Settings</h3>
              <p className="text-[10px] font-mono text-[#94A3B8]">Configuration & Simulation Presets</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-white p-1 rounded hover:bg-[#1E293B] cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between p-2.5 bg-[#101B2E] rounded border border-[#2B3A55]">
            <div>
              <div className="font-bold text-xs text-white uppercase">2D High-Performance Rendering</div>
              <div className="text-[9px] text-[#94A3B8] uppercase">Clean SVG Vector Visualizations</div>
            </div>
            <span className="text-[#34D399] font-bold text-[10px]">ACTIVE</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-[#101B2E] rounded border border-[#2B3A55]">
            <div>
              <div className="font-bold text-xs text-white uppercase">Deterministic Math Mode</div>
              <div className="text-[9px] text-[#94A3B8] uppercase">Reproducible hackathon scoring</div>
            </div>
            <span className="text-[#22D3EE] font-bold text-[10px]">LOCKED</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-[#101B2E] rounded border border-[#2B3A55]">
            <div>
              <div className="font-bold text-xs text-white uppercase">Data Environment</div>
              <div className="text-[9px] text-[#94A3B8] uppercase">Synthetic Local Cohort</div>
            </div>
            <span className="text-[#FBBF24] font-bold text-[10px]">DEMO v2.4</span>
          </div>
        </div>

        <div className="p-3.5 bg-[#07111F] border-t border-[#1E293B] flex justify-end gap-2">
          <button onClick={onClose} className="bg-[#07111F] border border-[#1E293B] px-3 py-1.5 rounded text-[10px] font-mono text-[#94A3B8] hover:text-white uppercase cursor-pointer">
            CLOSE
          </button>
          <button
            onClick={() => {
              onSuccess('Simulation parameters synchronized.');
              onClose();
            }}
            className="bg-[#22D3EE] text-[#07111F] px-4 py-1.5 rounded font-mono text-[10px] font-bold hover:bg-[#22D3EE]/90 uppercase cursor-pointer tracking-wider"
          >
            SAVE PRESETS
          </button>
        </div>
      </div>
    </div>
  );
};

